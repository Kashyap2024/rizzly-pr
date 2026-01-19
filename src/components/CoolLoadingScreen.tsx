import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    FadeIn,
    FadeOut
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import Background from "./Background";

const CAPTIONS = [
    "Consulting the Rizz experts...",
    "Calibrating charm intensity...",
    "Polishing your social aura...",
    "Warming up the AI engine...",
    "Analyzing social cues...",
    "Loading premium vibes...",
    "Preparing your next move...",
    "Sharpening the wit...",
    "Gathering social intelligence...",
    "Brewing fresh rizz..."
];

export const CoolLoadingScreen = () => {
    const [captionIndex, setCaptionIndex] = useState(0);
    const pulseValue = useSharedValue(1);

    useEffect(() => {
        // Caption rotation
        const interval = setInterval(() => {
            setCaptionIndex((prev) => (prev + 1) % CAPTIONS.length);
        }, 2500);

        // Pulsating logo animation
        pulseValue.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );

        return () => clearInterval(interval);
    }, []);

    const animatedLogoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseValue.value }],
        opacity: 0.8 + (pulseValue.value - 1) * 2
    }));

    return (
        <View style={{ flex: 1, backgroundColor: '#191022' }}>
            <Background />

            <View className="flex-1 items-center justify-center px-8">
                {/* Logo Area */}
                <Animated.View style={animatedLogoStyle} className="mb-10">
                    <View className="bg-primary/10 p-1 rounded-full overflow-hidden border border-white/10 shadow-2xl shadow-primary">
                        <Image
                            source={require("../../assets/rizzly-logo.png")}
                            style={{ width: 140, height: 140 }}
                            resizeMode="contain"
                            className="rounded-full"
                        />
                    </View>
                </Animated.View>

                {/* Content */}
                <View className="items-center">
                    <Text className="text-white text-3xl font-space-bold mb-2 tracking-tight">
                        Rizzly
                    </Text>

                    <View className="h-6 justify-center">
                        <Animated.Text
                            key={captionIndex}
                            entering={FadeIn.duration(600)}
                            exiting={FadeOut.duration(400)}
                            className="text-primary-light/80 text-sm font-space-medium text-center"
                        >
                            {CAPTIONS[captionIndex]}
                        </Animated.Text>
                    </View>
                </View>

                {/* Custom Loader */}
                <View className="absolute bottom-24">
                    <ActivityIndicator size="small" color="#7f13ec" />
                </View>
            </View>
        </View>
    );
};
