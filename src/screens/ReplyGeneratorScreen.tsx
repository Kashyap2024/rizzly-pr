import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Background from "../components/Background";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from "../contexts/AuthContext";
import { LastFreeRizzModal } from "../components/LastFreeRizzModal";
import { TrialExhaustedModal } from "../components/TrialExhaustedModal";

// Modular Components
import { ScreenHeader } from "../components/ScreenHeader";
import { EmojiSelector, EmojiMode } from "../components/EmojiSelector";
import { VibeSelector, Vibe } from "../components/VibeSelector";
import { FlatterySlider } from "../components/FlatterySlider";
import { ActionButton } from "../components/ActionButton";
import { RizzCard } from "../components/RizzCard";
import { apiService } from "../services/api";
import { supabase } from "../lib/supabase";
import { storageService } from "../services/storageService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { historyService } from "../services/historyService";
import { sessionService } from "../services/sessionService";
import { RizzSkeleton } from "../components/RizzSkeleton";
import { usePlacement } from "expo-superwall";

const VIBES: Vibe[] = [
    { id: 'default', label: 'Default', icon: 'auto-awesome' },
    { id: 'playful', label: 'Playful', icon: null },
    { id: 'funny', label: 'Funny', icon: null },
    { id: 'bold', label: 'Bold', icon: null },
    { id: 'sweet', label: 'Sweet', icon: null },
    { id: 'teasing', label: 'Teasing', icon: null },
];

type Props = NativeStackScreenProps<RootStackParamList, 'ReplyGenerator'>;

export default function ReplyGeneratorScreen({ navigation }: Props) {
    const { profile, user } = useAuth();
    const [flatteryLevel, setFlatteryLevel] = useState(75);
    const [emojiMode, setEmojiMode] = useState<EmojiMode>('relevant');
    const [selectedVibe, setSelectedVibe] = useState('default');
    const [image, setImage] = useState<string | null>(null);
    const [cardFeedback, setCardFeedback] = useState<{ [key: string]: 'like' | 'dislike' | null }>({});
    const [showThankYou, setShowThankYou] = useState<{ [key: string]: boolean }>({});
    const [results, setResults] = useState<{ text: string, history_id: string, server_id: string }[]>(
        sessionService.getResults('Reply Generator').map(r => ({ text: r.text, history_id: r.id, server_id: r.serverId }))
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isLastFree, setIsLastFree] = useState(false);
    const [isTrialExhausted, setIsTrialExhausted] = useState(false);
    const [showLastFreeModal, setShowLastFreeModal] = useState(false);
    const [showTrialExhaustedModal, setShowTrialExhaustedModal] = useState(false);
    const [animatingId, setAnimatingId] = useState<string | null>(null);
    const { registerPlacement } = usePlacement();
    const [overrideTargetGender, setOverrideTargetGender] = useState<string | null>(null);

    const userGender = profile?.gender?.toLowerCase() || 'other';
    const oppositeGender = overrideTargetGender || ((userGender === 'man' || userGender === 'male') ? 'Woman' : 'Man');

    useEffect(() => {
        const loadDefaults = async () => {
            try {
                const saved = await AsyncStorage.getItem('rizz_defaults');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.vibe) setSelectedVibe(parsed.vibe);
                    if (parsed.flattery) setFlatteryLevel(parsed.flattery);
                    if (parsed.emoji) setEmojiMode(parsed.emoji);
                    if (parsed.targetGender) setOverrideTargetGender(parsed.targetGender);
                }
            } catch (e) {
                console.error("Load defaults error", e);
            }
        };
        loadDefaults();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [9, 16],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleGenerate = async () => {
        if (!image) return;

        if (isTrialExhausted) {
            setShowTrialExhaustedModal(true);
            return;
        }

        if (isLastFree) {
            setShowLastFreeModal(true);
            return;
        }

        await performGeneration();
    };

    const handleUpgrade = () => {
        setShowTrialExhaustedModal(false);
        registerPlacement({ placement: 'reach_limit' });
    };

    const handleConfirmedGenerate = async () => {
        setShowLastFreeModal(false);
        await performGeneration();
    };

    const performGeneration = async () => {
        if (!image) return;

        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) return;

            // 1. Upload image to Supabase
            const imagePath = await storageService.uploadChatScreenshot(image, user?.id || 'anonymous');

            // 2. Format context prompt
            const prompt = `Give me reply for ${oppositeGender}
- Flattery: ${flatteryLevel}%
- Emoji: ${emojiMode === 'relevant' ? 'Relevant' : emojiMode === 'on' ? 'On' : 'Off'}
- Tone: ${selectedVibe}`;

            // 3. Call AI API
            const res = await apiService.generateRizz({
                type: 'ocr',
                prompt,
                imagePath
            }, session.access_token);

            if (res.is_last_free_rizz) {
                setIsLastFree(true);
            }

            // 4. Save to local history
            const localItem = await historyService.saveHistory({
                text: res.rizz,
                type: 'Reply Generator',
                settings: {
                    vibe: selectedVibe,
                    flattery: flatteryLevel,
                    emoji: emojiMode,
                    targetGender: oppositeGender
                }
            });

            // Save to session service
            sessionService.addResult({
                id: localItem.id,
                serverId: res.history_id, // Store actual server ID
                text: localItem.text,
                type: 'Reply Generator'
            });

            setAnimatingId(localItem.id);
            setResults(prev => [{ text: localItem.text, history_id: localItem.id, server_id: res.history_id }, ...prev]);
        } catch (error: any) {
            console.error("OCR Generation failed:", error);
            if (error.status === 402) {
                console.log('[Superwall] 402 Error detected, showing trial exhausted modal');
                setIsTrialExhausted(true);
                setShowTrialExhaustedModal(true);
            } else {
                Alert.alert("Error", error.message || "Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFeedback = async (serverId: string, localId: string, feedback: 'like' | 'dislike') => {
        // UI state uses local mapping
        setCardFeedback(prev => ({ ...prev, [localId]: feedback }));
        setShowThankYou(prev => ({ ...prev, [localId]: true }));

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                // Backend uses real history_id
                await apiService.provideFeedback(serverId, feedback, session.access_token);
            }
        } catch (error) {
            console.error("Feedback failed:", error);
        }

        // Auto-hide thank you message after 2 seconds
        setTimeout(() => {
            setShowThankYou(prev => ({ ...prev, [localId]: false }));
        }, 2000);
    };

    return (
        <View className="flex-1 bg-background-dark relative">
            <StatusBar style="light" />
            <Background />

            <ScreenHeader
                title="Reply Generator"
                subtitle="Craft Your Response"
                onBack={() => navigation.goBack()}
            />

            <ScrollView className="flex-1 pt-32 px-4 pb-8" contentContainerStyle={{ paddingBottom: 220 }} showsVerticalScrollIndicator={false}>

                {/* Upload Screenshot Section */}
                <View className="mb-8 relative group">
                    <View className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-[2rem] opacity-30 blur" />
                    <TouchableOpacity
                        onPress={pickImage}
                        className="relative w-full h-56 rounded-[2rem] border-2 border-dashed border-white/10 bg-surface-dark flex-col items-center justify-center gap-4 overflow-hidden active:bg-surface-dark/80"
                    >
                        {image ? (
                            <Image source={{ uri: image }} className="absolute inset-0 w-full h-full" resizeMode="contain" />
                        ) : (
                            <>
                                <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center">
                                    <MaterialIcons name="add-a-photo" size={32} color="#7f13ec" />
                                </View>
                                <View className="items-center">
                                    <Text className="font-space-bold text-lg text-white mb-1">Upload Screenshot</Text>
                                    <Text className="text-sm text-gray-400">Profile bio or chat history</Text>
                                </View>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Vibe Selection */}
                <View className="mb-6">
                    <Text className="text-gray-400 text-xs font-space-bold uppercase tracking-widest mb-4 px-1">Select Vibe</Text>
                    <VibeSelector vibes={VIBES} selectedVibe={selectedVibe} onSelect={setSelectedVibe} />
                </View>

                {/* Controls Container */}
                <View className="bg-surface-dark/50 backdrop-blur-lg border border-white/10 rounded-2xl p-5 mb-6 flex-col gap-5">
                    <FlatterySlider value={flatteryLevel} onChange={setFlatteryLevel} />

                    <View className="h-px bg-white/5 w-full" />

                    <View>
                        <View className="flex-row items-center gap-2 mb-4">
                            <MaterialIcons name="sentiment-satisfied" size={20} color="#facc15" />
                            <Text className="text-sm font-space-medium text-gray-300">Emoji Preference</Text>
                        </View>
                        <EmojiSelector value={emojiMode} onChange={setEmojiMode} compact />
                    </View>
                </View>

                {/* Results Section */}
                <View className="space-y-4 gap-4 pb-6 animate-fade-in-up">
                    {results.length > 0 && (
                        <View className="flex-row items-center justify-between px-1">
                            <Text className="text-sm font-bold text-white">AI Suggestions</Text>
                            <View className="bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                <Text className="text-xs text-primary">{results.length} generated</Text>
                            </View>
                        </View>
                    )}

                    {isLoading && <RizzSkeleton />}

                    {results.map((result, index) => (
                        <RizzCard
                            key={result.history_id}
                            text={result.text}
                            onCopy={() => { }}
                            feedbackStatus={cardFeedback[result.history_id]}
                            showThankYou={showThankYou[result.history_id]}
                            onFeedback={(type) => handleFeedback(result.server_id, result.history_id, type)}
                            animate={animatingId === result.history_id}
                        />
                    ))}
                </View>

            </ScrollView>

            {/* Bottom Generate Button */}
            <View className="absolute bottom-0 left-0 right-0 p-5 pt-10 pb-8 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-30">
                <ActionButton
                    label={isLoading ? "Analyzing..." : "Generate Reply"}
                    onPress={handleGenerate}
                    isLoading={isLoading}
                    disabled={!image && !isLoading}
                />
            </View>

            <LastFreeRizzModal
                visible={showLastFreeModal}
                onClose={() => setShowLastFreeModal(false)}
                onConfirm={handleConfirmedGenerate}
            />

            <TrialExhaustedModal
                visible={showTrialExhaustedModal}
                onClose={() => setShowTrialExhaustedModal(false)}
                onUpgrade={handleUpgrade}
            />
        </View>
    );
}
