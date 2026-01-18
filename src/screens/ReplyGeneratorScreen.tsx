import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Pressable, PanResponder, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Background from "../components/Background";
import { BlurView } from "expo-blur";
import * as ImagePicker from 'expo-image-picker';

const VIBES = [
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
    const [emojiMode, setEmojiMode] = useState<'relevant' | 'on' | 'off'>('relevant');
    const [selectedVibe, setSelectedVibe] = useState('default');
    const [image, setImage] = useState<string | null>(null);
    const [cardFeedback, setCardFeedback] = useState<{ [key: number]: 'like' | 'dislike' | null }>({});
    const [showThankYou, setShowThankYou] = useState<{ [key: number]: boolean }>({});

    // Use a ref for slider width to avoid stale closures in PanResponder without re-creating it
    const sliderWidthRef = useRef(0);

    // Create PanResponder once using a ref. 
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const x = evt.nativeEvent.locationX;
                if (sliderWidthRef.current > 0) {
                    const newLevel = Math.round((x / sliderWidthRef.current) * 100);
                    setFlatteryLevel(Math.max(0, Math.min(100, newLevel)));
                }
            },
            onPanResponderMove: (evt) => {
                const x = evt.nativeEvent.locationX;
                if (sliderWidthRef.current > 0) {
                    const newLevel = Math.round((x / sliderWidthRef.current) * 100);
                    setFlatteryLevel(Math.max(0, Math.min(100, newLevel)));
                }
            },
        })
    ).current;

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
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

        // Auto-hide thank you message after 2 seconds
        setTimeout(() => {
            setShowThankYou(prev => ({ ...prev, [id]: false }));
        }, 2000);
    };

    return (
        <View className="flex-1 bg-background-dark relative">
            <StatusBar style="light" />
            <Background />

            {/* Header */}
            <BlurView
                intensity={80}
                tint="dark"
                className="absolute top-0 left-0 right-0 z-50 pt-12 pb-4 px-4 flex-row items-center justify-between overflow-hidden"
                style={{
                    backgroundColor: 'rgba(25, 16, 34, 0.7)',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 rounded-full items-center justify-center bg-surface-dark border border-white/10 active:bg-white/10"
                >
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View>
                    <Text className="text-white text-lg font-space-bold tracking-wider uppercase text-center">Reply Generator</Text>
                    <Text className="text-primary text-[10px] font-space-bold tracking-widest uppercase text-center">Craft Your Response</Text>
                </View>
                <View className="w-10" />
            </BlurView>

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
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4" contentContainerStyle={{ paddingRight: 32 }}>
                        <View className="flex-row gap-3 pb-2">
                            {VIBES.map((vibe) => {
                                const isSelected = selectedVibe === vibe.id;
                                return (
                                    <Pressable
                                        key={vibe.id}
                                        onPress={() => setSelectedVibe(vibe.id)}
                                        className="h-10 px-6 rounded-full flex-row items-center gap-2 border"
                                        style={{
                                            backgroundColor: isSelected ? '#7f13ec' : 'rgba(23, 23, 23, 0.6)',
                                            borderColor: isSelected ? '#7f13ec' : 'rgba(255, 255, 255, 0.1)',
                                        }}
                                    >
                                        {isSelected && (
                                            <MaterialIcons
                                                name="auto-awesome"
                                                size={18}
                                                color="white"
                                            />
                                        )}
                                        <Text className={`text-sm font-space-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                            {vibe.label}
                                        </Text>
                                    </Pressable>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>

                {/* Controls Container */}
                <View className="bg-surface-dark/50 backdrop-blur-lg border border-white/10 rounded-2xl p-5 mb-6 flex-col gap-5">

                    {/* Flattery Slider */}
                    <View>
                        <View className="flex-row justify-between items-end mb-4">
                            <Text className="text-base font-space-medium text-white">Flattery Level</Text>
                            <Text className="text-white font-space-bold text-lg">{flatteryLevel}%</Text>
                        </View>

                        {/* Visual Slider */}
                        <View
                            className="relative w-full h-8 justify-center"
                            onLayout={(e) => { sliderWidthRef.current = e.nativeEvent.layout.width; }}
                            {...panResponder.panHandlers}
                        >
                            <View className="absolute w-full h-1.5 bg-white/10 rounded-full overflow-hidden" pointerEvents="none">
                                <View
                                    className="h-full bg-primary"
                                    style={{ width: `${flatteryLevel}%` }}
                                />
                            </View>
                            <View
                                className="absolute -translate-x-3 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-primary items-center justify-center"
                                style={{ left: `${flatteryLevel}%` }}
                                pointerEvents="none"
                            >
                                <View className="w-1.5 h-1.5 bg-primary rounded-full" />
                            </View>
                        </View>
                    </View>

                    <View className="h-px bg-white/5 w-full" />

                    {/* Emoji Selection */}
                    <View>
                        <View className="flex-row items-center gap-2 mb-4">
                            <MaterialIcons name="sentiment-satisfied" size={20} color="#facc15" />
                            <Text className="text-sm font-space-medium text-gray-300">Emoji Preference</Text>
                        </View>
                        <View className="bg-white/5 rounded-2xl p-1.5 flex-row">
                            {[
                                { id: 'relevant', label: 'Default', icon: 'auto-awesome' },
                                { id: 'on', label: 'On', icon: 'sentiment-satisfied' },
                                { id: 'off', label: 'Off', icon: 'block' }
                            ].map((option) => {
                                const isSelected = emojiMode === option.id;
                                return (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={() => setEmojiMode(option.id as any)}
                                        className="flex-1 py-2.5 items-center justify-center rounded-xl flex-row gap-2"
                                        style={{
                                            backgroundColor: isSelected ? 'rgba(127, 19, 236, 1)' : 'transparent',
                                        }}
                                    >
                                        <MaterialIcons
                                            name={option.icon as any}
                                            size={14}
                                            color={isSelected ? 'white' : '#9ca3af'}
                                        />
                                        <Text className={`text-[11px] font-space-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
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

                    {/* Result Card 1 */}
                    <TouchableOpacity className="group relative bg-surface-dark border border-white/10 rounded-2xl p-4 active:border-primary/40 transition-colors">
                        <View className="flex-col gap-4">
                            <View className="flex-row justify-between items-start gap-3">
                                <Text className="text-sm leading-relaxed text-gray-200 flex-1 font-space-regular">
                                    I was going to use a cheesy pickup line, but your bio is already funnier than anything I could come up with. 😂
                                </Text>
                                <TouchableOpacity className="shrink-0 p-2 rounded-lg bg-white/5 active:bg-primary/20">
                                    <MaterialIcons name="content-copy" size={18} color="#9ca3af" />
                                </TouchableOpacity>
                            </View>

                            {(!cardFeedback[0] || showThankYou[0]) && (
                                <View className="flex-row items-center h-10">
                                    {showThankYou[0] ? (
                                        <View className="animate-fade-in flex-row items-center gap-2">
                                            <MaterialIcons name="check-circle" size={14} color="#4ade80" />
                                            <Text className="text-[10px] font-space-bold text-green-400">Thank you for feedback!</Text>
                                        </View>
                                    ) : (
                                        <View className="flex-row items-center gap-2">
                                            <TouchableOpacity
                                                onPress={() => handleFeedback(0, 'like')}
                                                className={`p-2 rounded-full border ${cardFeedback[0] === 'like' ? 'bg-green-500/20 border-green-500/50' : 'bg-white/5 border-white/5'}`}
                                            >
                                                <MaterialIcons name="thumb-up" size={16} color={cardFeedback[0] === 'like' ? '#4ade80' : '#9ca3af'} />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => handleFeedback(0, 'dislike')}
                                                className={`p-2 rounded-full border ${cardFeedback[0] === 'dislike' ? 'bg-red-500/20 border-red-500/50' : 'bg-white/5 border-white/5'}`}
                                            >
                                                <MaterialIcons name="thumb-down" size={16} color={cardFeedback[0] === 'dislike' ? '#f87171' : '#9ca3af'} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Result Card 2 */}
                    <TouchableOpacity className="group relative bg-surface-dark border border-white/10 rounded-2xl p-4 active:border-primary/40 transition-colors">
                        <View className="flex-col gap-4">
                            <View className="flex-row justify-between items-start gap-3">
                                <Text className="text-sm leading-relaxed text-gray-200 flex-1 font-space-regular">
                                    Is your name Wi-Fi? Because I'm feeling a really strong connection right now. 📶
                                </Text>
                                <TouchableOpacity className="shrink-0 p-2 rounded-lg bg-white/5 active:bg-primary/20">
                                    <MaterialIcons name="content-copy" size={18} color="#9ca3af" />
                                </TouchableOpacity>
                            </View>

                            {(!cardFeedback[1] || showThankYou[1]) && (
                                <View className="flex-row items-center h-10">
                                    {showThankYou[1] ? (
                                        <View className="animate-fade-in flex-row items-center gap-2">
                                            <MaterialIcons name="check-circle" size={14} color="#4ade80" />
                                            <Text className="text-[10px] font-space-bold text-green-400">Thank you for feedback!</Text>
                                        </View>
                                    ) : (
                                        <View className="flex-row items-center gap-2">
                                            <TouchableOpacity
                                                onPress={() => handleFeedback(1, 'like')}
                                                className={`p-2 rounded-full border ${cardFeedback[1] === 'like' ? 'bg-green-500/20 border-green-500/50' : 'bg-white/5 border-white/5'}`}
                                            >
                                                <MaterialIcons name="thumb-up" size={16} color={cardFeedback[1] === 'like' ? '#4ade80' : '#9ca3af'} />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => handleFeedback(1, 'dislike')}
                                                className={`p-2 rounded-full border ${cardFeedback[1] === 'dislike' ? 'bg-red-500/20 border-red-500/50' : 'bg-white/5 border-white/5'}`}
                                            >
                                                <MaterialIcons name="thumb-down" size={16} color={cardFeedback[1] === 'dislike' ? '#f87171' : '#9ca3af'} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Bottom Generate Button */}
            <View className="absolute bottom-0 left-0 right-0 p-5 pt-10 pb-8 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-30">
                <TouchableOpacity
                    className="w-full h-14 rounded-full bg-primary flex-row items-center justify-center gap-2 shadow-lg shadow-primary/30 overflow-hidden relative"
                    activeOpacity={0.9}
                >
                    <View className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20" />
                    <View className="animate-pulse">
                        <MaterialIcons name="auto-awesome" size={24} color="white" />
                    </View>
                    <Text className="text-white font-space-bold text-lg tracking-wide">Generate Reply</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}
