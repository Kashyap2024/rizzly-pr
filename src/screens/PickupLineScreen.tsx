import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, Pressable, PanResponder } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Background from "../components/Background";
import { BlurView } from "expo-blur";

const VIBES = [
    { id: 'default', label: 'Default', icon: 'auto-awesome' },
    { id: 'funny', label: 'Funny', icon: null },
    { id: 'playful', label: 'Playful', icon: null },
    { id: 'bold', label: 'Bold', icon: null },
    { id: 'sweet', label: 'Sweet', icon: null },
    { id: 'teasing', label: 'Teasing', icon: null },
];

type Props = NativeStackScreenProps<RootStackParamList, 'PickupLine'>;

export default function PickupLineScreen({ navigation }: Props) {
    const [flatteryLevel, setFlatteryLevel] = useState(75);
    const [includeEmojis, setIncludeEmojis] = useState(true);
    const [selectedVibe, setSelectedVibe] = useState('default');

    // Use a ref for slider width to avoid stale closures in PanResponder without re-creating it
    const sliderWidthRef = useRef(0);

    // Create PanResponder once using a ref. 
    // It reads the current sliderWidth from sliderWidthRef.current
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
                    backgroundColor: 'rgba(25, 16, 34, 0.7)', // Semi-transparent background-dark (#191022)
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
                <Text className="text-white text-lg font-space-bold tracking-wider uppercase">Generate Lines</Text>
                <View className="w-10" />
            </BlurView>

            <ScrollView className="flex-1 pt-32 px-4 pb-8" contentContainerStyle={{ paddingBottom: 200 }} showsVerticalScrollIndicator={false}>

                {/* Tone Customization */}
                <View className="mb-6">
                    <Text className="text-gray-400 text-xs font-space-bold uppercase tracking-widest mb-4 px-1">Tone Customization</Text>
                    <View className="bg-surface-dark rounded-[1.5rem] p-5 border border-white/5">
                        <View className="flex-col gap-4">
                            <View className="flex-row justify-between items-end">
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

                            <View className="flex-row justify-between text-xs">
                                <Text className="text-gray-500 font-space-regular text-xs">Subtle</Text>
                                <Text className="text-gray-500 font-space-regular text-xs">Down Bad</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Include Emojis */}
                <View className="mb-6">
                    <View className="bg-surface-dark rounded-full px-5 h-16 border border-white/5 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <MaterialIcons name="sentiment-satisfied" size={24} color="#9ca3af" />
                            <Text className="text-base font-space-medium text-white">Include Emojis</Text>
                        </View>
                        <Switch
                            value={includeEmojis}
                            onValueChange={setIncludeEmojis}
                            trackColor={{ false: "#374151", true: "#7f13ec" }}
                            thumbColor={"#fff"}
                        />
                    </View>
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
                                        // Use static className for base styles
                                        className="h-10 px-6 rounded-full flex-row items-center gap-2 border"
                                        // Use style prop for dynamic styles to bypass NativeWind re-processing issues
                                        style={{
                                            backgroundColor: isSelected ? '#7f13ec' : 'rgba(255, 255, 255, 0.05)',
                                            borderColor: isSelected ? '#7f13ec' : 'rgba(255, 255, 255, 0.1)',
                                            // shadow is harder to do inline, simplifying for test
                                        }}
                                    >
                                        {isSelected && (
                                            <MaterialIcons
                                                name="auto-awesome"
                                                size={18}
                                                color="white"
                                            />
                                        )}
                                        <Text className={`text-sm font-space-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                            {vibe.label}
                                        </Text>
                                    </Pressable>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>

                {/* Generate Button */}
                <View className="mb-8">
                    <TouchableOpacity
                        className="relative w-full h-16 rounded-full overflow-hidden shadow-[0_0_20px_rgba(127,19,236,0.4)] active:scale-[0.98]"
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#7f13ec', '#9f4bf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="absolute inset-0"
                        />
                        <View className="absolute inset-0 bg-white/10 opacity-10" />
                        <View className="flex-1 flex-row items-center justify-center gap-3">
                            <Text className="text-white text-lg font-space-bold tracking-wide uppercase">Generate Rizz</Text>
                            <View className="animate-pulse">
                                <MaterialIcons name="auto-awesome" size={24} color="white" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Results Section */}
                <View className="space-y-4 gap-4">
                    <View className="flex-row items-center justify-between px-1">
                        <Text className="text-gray-400 text-xs font-space-bold uppercase tracking-widest">Generated Results</Text>
                        <View className="bg-primary/20 px-2 py-0.5 rounded-full">
                            <Text className="text-[10px] text-primary-light font-bold">2 NEW</Text>
                        </View>
                    </View>

                    {/* Result Card 1 */}
                    <TouchableOpacity className="group relative bg-surface-dark border border-white/10 rounded-2xl p-4 active:border-primary/40 transition-colors">
                        <View className="flex-row justify-between items-start gap-3">
                            <Text className="text-sm leading-relaxed text-gray-200 flex-1 font-space-regular">
                                "Do you have a name, or can I call you mine?" <Text>😉</Text>
                            </Text>
                            <TouchableOpacity className="shrink-0 p-2 rounded-lg bg-white/5 active:bg-primary/20 active:text-primary">
                                <MaterialIcons name="content-copy" size={18} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>

                    {/* Result Card 2 */}
                    <TouchableOpacity className="group relative bg-surface-dark border border-white/10 rounded-2xl p-4 active:border-primary/40 transition-colors">
                        <View className="flex-row justify-between items-start gap-3">
                            <Text className="text-sm leading-relaxed text-gray-200 flex-1 font-space-regular">
                                "Are you a magician? Because whenever I look at you, everyone else disappears." <Text>✨</Text>
                            </Text>
                            <TouchableOpacity className="shrink-0 p-2 rounded-lg bg-white/5 active:bg-primary/20 active:text-primary">
                                <MaterialIcons name="content-copy" size={18} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}
