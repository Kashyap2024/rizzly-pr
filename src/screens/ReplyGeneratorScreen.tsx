import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Background from "../components/Background";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

// Modular Components
import { ScreenHeader } from "../components/ScreenHeader";
import { EmojiSelector, EmojiMode } from "../components/EmojiSelector";
import { VibeSelector, Vibe } from "../components/VibeSelector";
import { FlatterySlider } from "../components/FlatterySlider";
import { ActionButton } from "../components/ActionButton";
import { RizzCard } from "../components/RizzCard";

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
    const [flatteryLevel, setFlatteryLevel] = useState(75);
    const [emojiMode, setEmojiMode] = useState<EmojiMode>('relevant');
    const [selectedVibe, setSelectedVibe] = useState('default');
    const [image, setImage] = useState<string | null>(null);
    const [cardFeedback, setCardFeedback] = useState<{ [key: number]: 'like' | 'dislike' | null }>({});
    const [showThankYou, setShowThankYou] = useState<{ [key: number]: boolean }>({});

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

    const handleFeedback = (id: number, type: 'like' | 'dislike') => {
        setCardFeedback(prev => ({ ...prev, [id]: type }));
        setShowThankYou(prev => ({ ...prev, [id]: true }));

        setTimeout(() => {
            setShowThankYou(prev => ({ ...prev, [id]: false }));
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
                            <Image source={{ uri: image }} className="absolute inset-0 w-full h-full" resizeMode="cover" />
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
                <View className="space-y-4 gap-4 animate-fade-in-up">
                    <View className="flex-row items-center justify-between px-1">
                        <Text className="text-sm font-bold text-white">AI Suggestions</Text>
                        <View className="bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                            <Text className="text-xs text-primary">3 generated</Text>
                        </View>
                    </View>

                    <RizzCard
                        text="I was going to use a cheesy pickup line, but your bio is already funnier than anything I could come up with. 😂"
                        onCopy={() => { }}
                        feedbackStatus={cardFeedback[0]}
                        showThankYou={showThankYou[0]}
                        onFeedback={(type) => handleFeedback(0, type)}
                    />

                    <RizzCard
                        text="Is your name Wi-Fi? Because I'm feeling a really strong connection right now. 📶"
                        onCopy={() => { }}
                        feedbackStatus={cardFeedback[1]}
                        showThankYou={showThankYou[1]}
                        onFeedback={(type) => handleFeedback(1, type)}
                    />
                </View>

            </ScrollView>

            {/* Bottom Generate Button */}
            <View className="absolute bottom-0 left-0 right-0 p-5 pt-10 pb-8 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-30">
                <ActionButton label="Generate Reply" onPress={() => { }} />
            </View>

        </View>
    );
}
