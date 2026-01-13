import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Background from "../components/Background";
import Glow from "../components/Glow";
import GradientText from "../components/GradientText";
import { BlurView } from "expo-blur";

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<HomeScreenRouteProp>();
    const { name, gender } = route.params || { name: "Alex", gender: "Male" };

    // Use local assets based on gender
    const avatarSource = gender === 'Female'
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
                    <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center bg-white/5 active:bg-white/10">
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
                        {/* Card 1: Generate Pickup Line */}
                        <TouchableOpacity
                            className="w-full h-[200px] rounded-[2.5rem] bg-surface-dark border border-white/5 relative overflow-hidden p-6"
                            activeOpacity={0.96}
                            onPress={() => navigation.navigate("PickupLine")}
                        >
                            <View className="absolute inset-0 opacity-60">
                                <LinearGradient colors={['rgba(127, 19, 236, 0.2)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }} />
                            </View>
                            <View className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full overflow-hidden opacity-50">
                                <Glow color="#7f13ec" style={{ width: '100%', height: '100%' }} />
                            </View>

                            <View className="relative z-10 flex-col justify-between h-full">
                                <View className="flex-row justify-between items-start">
                                    <View className="w-16 h-16 rounded-2xl bg-white/10 items-center justify-center border border-white/10 shadow-lg shadow-primary/20">
                                        <MaterialIcons name="auto-awesome" size={32} color="#9f4bf6" />
                                    </View>
                                    <MaterialIcons name="arrow-forward" size={32} color="rgba(255,255,255,0.3)" />
                                </View>
                                <View className="mt-4">
                                    <Text className="text-3xl font-space-bold text-white leading-none mb-1">Generate{'\n'}Pickup Line</Text>
                                    <Text className="text-gray-400 font-space-medium text-sm">Break the ice with style</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Card 2: Reply Generator */}
                        <TouchableOpacity
                            className="w-full h-[200px] rounded-[2.5rem] bg-surface-dark border border-white/5 relative overflow-hidden p-6"
                            activeOpacity={0.96}
                            onPress={() => navigation.navigate("ReplyGenerator")}
                        >
                            <View className="absolute inset-0 opacity-60">
                                <LinearGradient colors={['rgba(37, 99, 235, 0.2)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }} />
                            </View>
                            <View className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full overflow-hidden opacity-50">
                                <Glow color="#2563eb" style={{ width: '100%', height: '100%' }} />
                            </View>

                            <View className="relative z-10 flex-col justify-between h-full">
                                <View className="flex-row justify-between items-start">
                                    <View className="w-16 h-16 rounded-2xl bg-white/10 items-center justify-center border border-white/10 shadow-lg shadow-blue-500/20">
                                        <MaterialIcons name="chat" size={32} color="#60a5fa" />
                                    </View>
                                    <MaterialIcons name="arrow-forward" size={32} color="rgba(255,255,255,0.3)" />
                                </View>
                                <View className="mt-4">
                                    <Text className="text-3xl font-space-bold text-white leading-none mb-1">Reply{'\n'}Generator</Text>
                                    <Text className="text-gray-400 font-space-medium text-sm">Keep the conversation flowing</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Bottom Navigation */}
                <View className="absolute bottom-20 left-0 right-0 px-12 z-20">
                    <BlurView
                        intensity={50}
                        tint="dark"
                        className="w-full h-16 rounded-full overflow-hidden"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.5,
                            shadowRadius: 20,
                            elevation: 10,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderWidth: 1,
                            borderColor: 'rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <View className="flex-1 flex-row items-center justify-around">
                            <TouchableOpacity className="items-center justify-center gap-1 w-12">
                                <MaterialIcons name="home" size={24} color="#9f4bf6" />
                                <Text className="text-[10px] font-space-bold text-primary-light">Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="items-center justify-center gap-1 w-12">
                                <MaterialIcons name="bookmark-border" size={24} color="#9ca3af" />
                                <Text className="text-[10px] font-space-medium text-gray-400">Saved</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="items-center justify-center gap-1 w-12">
                                <MaterialIcons name="person-outline" size={24} color="#9ca3af" />
                                <Text className="text-[10px] font-space-medium text-gray-400">Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </View>
            </SafeAreaView>
        </View>
    );
}
