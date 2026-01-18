import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Background from "../components/Background";
import { ScreenHeader } from "../components/ScreenHeader";
import { FloatingNav } from "../components/FloatingNav";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen() {
    const { profile, signOut } = useAuth();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View className="flex-1 bg-background-dark relative">
            <StatusBar style="light" />
            <Background />

            <ScreenHeader
                title="Profile"
                onBack={() => navigation.goBack()}
            />

            <SafeAreaView style={{ flex: 1 }} className="px-6 pt-32">
                <View className="items-center mb-8">
                    <View className="w-24 h-24 rounded-full bg-surface-dark border-4 border-primary/30 items-center justify-center mb-4">
                        <MaterialIcons name="person" size={48} color="#9f4bf6" />
                    </View>
                    <Text className="text-2xl font-space-bold text-white">{profile?.display_name || "User"}</Text>
                    <Text className="text-gray-400 font-space-medium uppercase tracking-widest text-xs mt-1">{profile?.gender || "Not set"}</Text>
                </View>

                <View className="bg-surface-dark/50 rounded-3xl p-6 border border-white/5">
                    <TouchableOpacity
                        onPress={signOut}
                        className="flex-row items-center gap-4 py-2"
                    >
                        <View className="w-10 h-10 rounded-2xl bg-red-500/10 items-center justify-center">
                            <MaterialIcons name="logout" size={20} color="#ef4444" />
                        </View>
                        <Text className="text-white font-space-bold">Sign Out</Text>
                    </TouchableOpacity>
                </View>

                <FloatingNav />
            </SafeAreaView>
        </View>
    );
}
