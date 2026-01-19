import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TextInput, NativeSyntheticEvent, TextInputScrollEventData, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Background from "../components/Background";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

// Modular Components
import { ScreenHeader } from "../components/ScreenHeader";
import { EmojiSelector, EmojiMode } from "../components/EmojiSelector";
import { VibeSelector, Vibe } from "../components/VibeSelector";
import { FlatterySlider } from "../components/FlatterySlider";
import { ActionButton } from "../components/ActionButton";
import { RizzCard } from "../components/RizzCard";
import { LastFreeRizzModal } from "../components/LastFreeRizzModal";
import { TrialExhaustedModal } from "../components/TrialExhaustedModal";
import { apiService } from "../services/api";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { historyService } from "../services/historyService";
import { sessionService } from "../services/sessionService";
import { RizzSkeleton } from "../components/RizzSkeleton";
import { usePlacement } from "expo-superwall";

const VIBES: Vibe[] = [
    { id: 'default', label: 'Default', icon: 'auto-awesome' },
    { id: 'funny', label: 'Funny', icon: null },
    { id: 'playful', label: 'Playful', icon: null },
    { id: 'bold', label: 'Bold', icon: null },
    { id: 'sweet', label: 'Sweet', icon: null },
    { id: 'teasing', label: 'Teasing', icon: null },
];

const MALE_PLACEHOLDERS = [
    "She likes hiking and dogs, say something funny",
    "She has a travel blog and loves Italian food",
    "Professional coffee taster and rock climber"
];

const FEMALE_PLACEHOLDERS = [
    "He's a big fan of Star Wars and plays guitar",
    "Passionate about photography and exploration",
    "Loves early morning runs and matcha lattes"
];

type Props = NativeStackScreenProps<RootStackParamList, 'PickupLine'>;

export default function PickupLineScreen({ navigation }: Props) {
    const { profile } = useAuth();
    const [flatteryLevel, setFlatteryLevel] = useState(75);
    const [emojiMode, setEmojiMode] = useState<EmojiMode>('relevant');
    const [selectedVibe, setSelectedVibe] = useState('default');
    const [context, setContext] = useState("");
    const [placeholderText, setPlaceholderText] = useState("");
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [cardFeedback, setCardFeedback] = useState<{ [key: string]: 'like' | 'dislike' | null }>({});
    const [showThankYou, setShowThankYou] = useState<{ [key: string]: boolean }>({});
    const [results, setResults] = useState<{ text: string, history_id: string, server_id: string }[]>(
        sessionService.getResults('Pickup Line').map(r => ({ text: r.text, history_id: r.id, server_id: r.serverId }))
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isLastFree, setIsLastFree] = useState(false);
    const [isTrialExhausted, setIsTrialExhausted] = useState(false);
    const [showLastFreeModal, setShowLastFreeModal] = useState(false);
    const [showTrialExhaustedModal, setShowTrialExhaustedModal] = useState(false);
    const [animatingId, setAnimatingId] = useState<string | null>(null);

    const { registerPlacement } = usePlacement();

    // Scrollbar state
    const [contentHeight, setContentHeight] = useState(0);
    const [containerHeight, setContainerHeight] = useState(120);
    const [scrollY, setScrollY] = useState(0);
    const [overrideTargetGender, setOverrideTargetGender] = useState<string | null>(null);

    const userGender = profile?.gender?.toLowerCase() || 'other';
    const oppositeGender = overrideTargetGender || ((userGender === 'man' || userGender === 'male') ? 'Female' : 'Male');

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

    const activePlaceholders = (userGender === 'man' || userGender === 'male')
        ? MALE_PLACEHOLDERS
        : FEMALE_PLACEHOLDERS;

    useEffect(() => {
        const typingSpeed = isDeleting ? 25 : 45;
        const pauseDelay = 1500;

        const currentFullText = activePlaceholders[placeholderIndex % activePlaceholders.length];

        const handleTyping = () => {
            if (!isDeleting) {
                if (charIndex < currentFullText.length) {
                    setPlaceholderText(currentFullText.substring(0, charIndex + 1));
                    setCharIndex(charIndex + 1);
                } else {
                    setTimeout(() => setIsDeleting(true), pauseDelay);
                }
            } else {
                if (charIndex > 0) {
                    setPlaceholderText(currentFullText.substring(0, charIndex - 1));
                    setCharIndex(charIndex - 1);
                } else {
                    setIsDeleting(false);
                    setPlaceholderIndex((prev) => (prev + 1) % activePlaceholders.length);
                }
            }
        };

        const timeout = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, placeholderIndex, activePlaceholders]);

    const handleGenerate = async () => {
        if (!context.trim()) return;

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
        if (!context.trim()) return;

        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) throw new Error("No session found");

            const prompt = `Person Description: ${context}
Give me reply for ${oppositeGender}
- Flittering: ${flatteryLevel}%
- Emoji: ${emojiMode === 'relevant' ? 'Relevant' : emojiMode === 'on' ? 'On' : 'Off'}
- Tone: ${selectedVibe}`;

            const res = await apiService.generateRizz({
                type: 'text',
                prompt
            }, session.access_token);

            if (res.is_last_free_rizz) {
                setIsLastFree(true);
            }

            // Save to local history
            const localItem = await historyService.saveHistory({
                text: res.rizz,
                type: 'Pickup Line',
                settings: {
                    vibe: selectedVibe,
                    flattery: flatteryLevel,
                    emoji: emojiMode,
                    targetGender: profile?.gender === 'Male' ? 'Female' : 'Male'
                }
            });

            // Save to session service
            sessionService.addResult({
                id: localItem.id,
                serverId: res.history_id, // Store actual server ID
                text: localItem.text,
                type: 'Pickup Line'
            });

            setAnimatingId(localItem.id);
            setResults(prev => [{ text: localItem.text, history_id: localItem.id, server_id: res.history_id }, ...prev]);
        } catch (error: any) {
            console.error("Generation failed:", error);
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

    const handleScroll = (event: NativeSyntheticEvent<TextInputScrollEventData>) => {
        setScrollY(event.nativeEvent.contentOffset.y);
    };

    // Calculate scrollbar thumb position
    const showScrollbar = contentHeight > containerHeight;
    const thumbHeight = Math.max(30, (containerHeight / contentHeight) * containerHeight);
    const thumbOffset = (scrollY / (contentHeight - containerHeight)) * (containerHeight - thumbHeight);

    return (
        <View className="flex-1 bg-background-dark relative">
            <StatusBar style="light" />
            <Background />

            <ScreenHeader
                title="Generate Lines"
                onBack={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1 pt-32 px-4 pb-8"
                contentContainerStyle={{ paddingBottom: 200 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >

                {/* Person Context Input */}
                <View className="mb-6">
                    <Text className="text-gray-400 text-xs font-space-bold uppercase tracking-widest mb-4 px-1">Describe the Person</Text>
                    <View className="bg-surface-dark rounded-[1.5rem] p-5 border border-white/5 relative overflow-hidden">
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput
                                value={context}
                                onChangeText={setContext}
                                placeholder={placeholderText}
                                placeholderTextColor="rgba(156, 163, 175, 0.4)"
                                multiline
                                onContentSizeChange={(e) => setContentHeight(e.nativeEvent.contentSize.height)}
                                onScroll={handleScroll}
                                className="text-white font-space-medium text-base text-left align-top flex-1"
                                style={{
                                    minHeight: 80,
                                    maxHeight: 120, // Limit height to trigger scroll
                                    textAlignVertical: 'top'
                                }}
                                scrollEnabled={true}
                            />
                            {/* Custom Scrollbar */}
                            {showScrollbar && (
                                <View
                                    className="absolute right-0 top-0 bottom-0 w-1 bg-white/5 rounded-full overflow-hidden"
                                    style={{ height: 120 }}
                                >
                                    <View
                                        className="w-full bg-primary/40 rounded-full"
                                        style={{
                                            height: thumbHeight,
                                            transform: [{ translateY: thumbOffset || 0 }]
                                        }}
                                    />
                                </View>
                            )}
                        </View>
                        <View className="flex-row items-center gap-2 mt-3 pt-3 border-t border-white/5">
                            <MaterialIcons name="info-outline" size={14} color="#6b7280" />
                            <Text className="text-[10px] text-gray-500 font-space-regular">More details = Better Rizz</Text>
                        </View>
                    </View>
                </View>

                {/* Tone Customization */}
                <View className="mb-6">
                    <Text className="text-gray-400 text-xs font-space-bold uppercase tracking-widest mb-4 px-1">Tone Customization</Text>
                    <View className="bg-surface-dark rounded-[1.5rem] p-5 border border-white/5">
                        <FlatterySlider value={flatteryLevel} onChange={setFlatteryLevel} />
                    </View>
                </View>

                {/* Emoji Selection */}
                <View className="mb-6">
                    <Text className="text-gray-400 text-xs font-space-bold uppercase tracking-widest mb-4 px-1">Emoji Preference</Text>
                    <EmojiSelector value={emojiMode} onChange={setEmojiMode} />
                </View>

                {/* Vibe Selection */}
                <View className="mb-6">
                    <Text className="text-gray-400 text-xs font-space-bold uppercase tracking-widest mb-4 px-1">Select Vibe</Text>
                    <VibeSelector vibes={VIBES} selectedVibe={selectedVibe} onSelect={setSelectedVibe} />
                </View>

                {/* Generate Button */}
                <ActionButton
                    label={isLoading ? "Generating Magic..." : "Generate Rizz"}
                    onPress={handleGenerate}
                    isLoading={isLoading}
                    disabled={context.trim().split(/\s+/).filter(word => word.length > 0).length < 2}
                />

                {/* Results Section */}
                <View className="space-y-4 gap-4 mt-8">
                    {results.length > 0 && (
                        <View className="flex-row items-center justify-between px-1">
                            <Text className="text-gray-400 text-xs font-space-bold uppercase tracking-widest">Generated Results</Text>
                            <View className="bg-primary/20 px-2 py-0.5 rounded-full">
                                <Text className="text-[10px] text-primary-light font-bold">{results.length} NEW</Text>
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
