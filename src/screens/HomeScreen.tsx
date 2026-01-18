import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Background from "../components/Background";
import GradientText from "../components/GradientText";
import { useAuth } from "../contexts/AuthContext";
import { ModeCard } from "../components/ModeCard";
import { FloatingNav } from "../components/FloatingNav";

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const { profile } = useAuth();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<HomeScreenRouteProp>();

    // Prioritize context profile, fallback to route params or default
    const name = profile?.display_name || route.params?.name || "Alex";
    const gender = profile?.gender || route.params?.gender || "Male";

    // Use local assets based on gender
    const avatarSource = (gender.toLowerCase() === 'female' || gender.toLowerCase() === 'woman')
        ? require('../../assets/avatar_female.png')
        : require('../../assets/avatar_male.png');

    return (
        <View className="flex-1 bg-background-dark relative">
            <StatusBar style="light" />
            <Background />

            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <View className="flex-row items-center gap-3">
                        <View className="relative">
                            <View className="w-10 h-10 rounded-full bg-surface-dark border-2 border-primary/50 overflow-hidden items-center justify-center">
                                <Image
                                    source={avatarSource}
                                    className="w-full h-full"
                                />
                            </View>
                            <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background-dark rounded-full" />
                        </View>
                        <View>
                            <Text className="text-gray-400 text-xs font-space-medium uppercase tracking-wider">Welcome back</Text>
                            <Text className="text-lg font-space-bold text-white leading-none">{name}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Settings")}
                        className="w-10 h-10 rounded-full items-center justify-center bg-white/5 active:bg-white/10"
                    >
                        <MaterialIcons name="settings" size={24} color="#9ca3af" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-6 pb-32" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                    {/* Title */}
                    <View className="mt-4 mb-8">
                        <Text className="text-[32px] font-space-bold text-white leading-tight">
                            Ready to <GradientText style={{ fontSize: 32, fontFamily: 'SpaceGrotesk_700Bold' }}>charm?</GradientText>
                        </Text>
                        <Text className="text-gray-400 font-space-regular mt-2">
                            Select a mode below to unlock your full potential.
                        </Text>
                    </View>

                    {/* Action Cards */}
                    <View className="flex-col gap-5">
                        <ModeCard
                            title={`Generate\nPickup Line`}
                            subtitle="Break the ice with style"
                            icon="auto-awesome"
                            gradientColors={['rgba(127, 19, 236, 0.2)', 'transparent']}
                            glowColor="#7f13ec"
                            iconColor="#9f4bf6"
                            shadowColor="shadow-primary/20"
                            onPress={() => navigation.navigate("PickupLine")}
                        />

                        <ModeCard
                            title={`Reply\nGenerator`}
                            subtitle="Keep the conversation flowing"
                            icon="chat"
                            gradientColors={['rgba(37, 99, 235, 0.2)', 'transparent']}
                            glowColor="#2563eb"
                            iconColor="#60a5fa"
                            shadowColor="shadow-blue-500/20"
                            onPress={() => navigation.navigate("ReplyGenerator")}
                        />
                    </View>
                </ScrollView>

                <FloatingNav />
            </SafeAreaView>
        </View>
    );
}
