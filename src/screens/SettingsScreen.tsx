import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Background from "../components/Background";
import { ScreenHeader } from "../components/ScreenHeader";
import { VibeSelector, Vibe } from "../components/VibeSelector";
import { FlatterySlider } from "../components/FlatterySlider";
import { EmojiSelector, EmojiMode } from "../components/EmojiSelector";
import { ActionButton } from "../components/ActionButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VIBES: Vibe[] = [
    { id: 'default', label: 'Default', icon: 'auto-awesome' },
    { id: 'funny', label: 'Funny', icon: null },
    { id: 'playful', label: 'Playful', icon: null },
    { id: 'bold', label: 'Bold', icon: null },
    { id: 'sweet', label: 'Sweet', icon: null },
    { id: 'teasing', label: 'Teasing', icon: null },
];

export default function SettingsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // AI Intelligence Defaults State
    const [defaultVibe, setDefaultVibe] = useState('default');
    const [defaultFlattery, setDefaultFlattery] = useState(75);
    const [defaultEmoji, setDefaultEmoji] = useState<EmojiMode>('relevant');
    const [targetGender, setTargetGender] = useState<'Woman' | 'Man' | 'Other'>('Woman');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const saved = await AsyncStorage.getItem('rizz_defaults');
            if (saved) {
                const parsed = JSON.parse(saved);
                setDefaultVibe(parsed.vibe || 'default');
                setDefaultFlattery(parsed.flattery || 75);
                setDefaultEmoji(parsed.emoji || 'relevant');
                setTargetGender(parsed.targetGender || 'Woman');
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const settings = {
                vibe: defaultVibe,
                flattery: defaultFlattery,
                emoji: defaultEmoji,
                targetGender
            };
            await AsyncStorage.setItem('rizz_defaults', JSON.stringify(settings));
            // Small delay for UX
            setTimeout(() => {
                setIsSaving(false);
                navigation.goBack();
            }, 500);
        } catch (error) {
            console.error('Failed to save settings', error);
            setIsSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-background-dark relative">
            <StatusBar style="light" />
            <Background />

            <ScreenHeader
                title="Settings"
                subtitle="Configure your AI"
                onBack={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1 pt-32 px-4 pb-8"
                contentContainerStyle={{ paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-8">
                    <View className="flex-row items-center gap-2 mb-4 px-1">
                        <MaterialIcons name="psychology" size={20} color="#9f4bf6" />
                        <Text className="text-gray-400 text-xs font-space-bold uppercase tracking-widest">AI Intelligence Defaults</Text>
                    </View>

                    {/* Target Gender selector */}
                    <View className="bg-surface-dark/50 rounded-3xl p-5 border border-white/5 mb-6">
                        <Text className="text-gray-400 text-xs font-space-bold uppercase tracking-widest mb-4">Target Audience</Text>
                        <View className="flex-row gap-3">
                            {['Woman', 'Man', 'Other'].map((g) => (
                                <TouchableOpacity
                                    key={g}
                                    onPress={() => setTargetGender(g as any)}
                                    className={`flex-1 py-3 rounded-2xl border ${targetGender === g ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/5'}`}
                                >
                                    <Text className={`text-center font-space-bold ${targetGender === g ? 'text-primary-light' : 'text-gray-500'}`}>{g}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text className="text-[10px] text-gray-500 font-space-medium mt-3 text-center">Lines will be generated primarily for this audience</Text>
                    </View>

                    {/* Default Vibe */}
                    <View className="mb-6">
                        <Text className="text-gray-400 text-xs font-space-bold uppercase tracking-widest mb-4 px-1">Default Vibe</Text>
                        <VibeSelector vibes={VIBES} selectedVibe={defaultVibe} onSelect={setDefaultVibe} />
                    </View>

                    {/* Flattery Intensity */}
                    <View className="mb-6">
                        <Text className="text-gray-400 text-xs font-space-bold uppercase tracking-widest mb-4 px-1">Base Flattery Level</Text>
                        <View className="bg-surface-dark/50 rounded-3xl p-5 border border-white/5">
                            <FlatterySlider value={defaultFlattery} onChange={setDefaultFlattery} />
                        </View>
                    </View>

                    {/* Emoji Preference */}
                    <View className="mb-6">
                        <Text className="text-gray-400 text-xs font-space-bold uppercase tracking-widest mb-4 px-1">Emoji Preference</Text>
                        <EmojiSelector value={defaultEmoji} onChange={setDefaultEmoji} />
                    </View>
                </View>

                <ActionButton
                    label={isSaving ? "Saving..." : "Save Preferences"}
                    onPress={handleSave}
                />

            </ScrollView>
        </View>
    );
}
