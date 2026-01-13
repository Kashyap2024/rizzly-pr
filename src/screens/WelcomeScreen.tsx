import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Background from "../components/Background";
import GradientText from "../components/GradientText";
import Glow from "../components/Glow";

export default function WelcomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const glowOpacity = useSharedValue(0.4);

    useEffect(() => {
        glowOpacity.value = withRepeat(
            withSequence(
                withTiming(0.6, { duration: 1500, easing: Easing.ease }),
                withTiming(0.4, { duration: 1500, easing: Easing.ease })
            ),
            -1,
            true
        );
    }, []);

    const animatedGlowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    return (
        <View className="flex-1 bg-background-dark relative overflow-hidden">
            <StatusBar style="light" />
            <Background />

            <View
                className="flex-1 items-center justify-between p-8 py-12 w-full max-w-md mx-auto"
                style={{ zIndex: 10, elevation: 10 }} // Ensure on top of background
            >

                {/* Hero Section */}
                <View className="flex-col items-center justify-center mt-12 w-full flex-1">
                    <View className="relative items-center justify-center">
                        <Animated.View
                            style={[animatedGlowStyle, { position: 'absolute', width: 200, height: 200 }]}
                        >
                            <Glow color="#7f13ec" style={{ width: '100%', height: '100%' }} />
                        </Animated.View>

                        <Image
                            source={require('../../assets/rizzly-logo.png')}
                            style={{ width: 160, height: 160, resizeMode: 'contain', borderRadius: 20 }}
                        />
                    </View>
                </View>

                {/* Text Section */}
                <View className="flex-col items-center text-center space-y-6 max-w-xs mx-auto mb-8">
                    <Text className="text-[42px] leading-tight font-space-bold text-white text-center">
                        Ready to {'\n'}
                        <View style={{ height: 60, justifyContent: 'center' }}>
                            <GradientText style={{ fontSize: 42, fontFamily: 'SpaceGrotesk_700Bold', textShadowColor: 'rgba(159, 75, 246, 0.6)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 }}>
                                charm?
                            </GradientText>
                        </View>
                    </Text>

                    <Text className="text-gray-400 font-space-regular text-lg text-center leading-relaxed mt-4">
                        Unleash your full social potential with AI.
                    </Text>
                </View>

                {/* Button Section */}
                <View className="w-full mb-8">
                    <TouchableOpacity
                        className="w-full h-[72px] rounded-full overflow-hidden bg-surface-dark"
                        activeOpacity={0.9}
                        style={{
                            shadowColor: '#7f13ec',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.3,
                            shadowRadius: 20,
                            elevation: 10
                        }}
                        onPress={() => navigation.navigate("Onboarding")}
                    >
                        {/* Background Gradient */}
                        <LinearGradient
                            colors={['#6e11d0', '#9f4bf6']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        />

                        <View className="flex-1 flex-row items-center justify-center gap-2">
                            <Text className="text-white text-xl font-space-bold tracking-wide">
                                Get Started
                            </Text>
                            <MaterialIcons name="arrow-forward" size={26} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
