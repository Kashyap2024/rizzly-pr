import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInLeft, FadeOutRight, useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { RootStackParamList } from "../types";
import Background from "../components/Background";
import Glow from "../components/Glow";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Path } from 'react-native-svg';
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

const genders = ["Male", "Female", "Other"];

export default function OnboardingScreen() {
    const { signInWithGoogle, user, refreshProfile } = useAuth();
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [currentStep, setCurrentStep] = useState<'auth' | 'gender' | 'name'>('auth');
    const [isSaving, setIsSaving] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const progress = useSharedValue(0.33);
    const animatedProgressStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
    }));

    const handleSaveProfile = async () => {
        if (!user) {
            Alert.alert("Error", "You must be signed in to save your profile.");
            return;
        }

        try {
            setIsSaving(true);

            // Map UI gender to enum values
            const genderMap: Record<string, string> = {
                'Male': 'man',
                'Female': 'woman',
                'Other': 'other'
            };

            const dbGender = genderMap[selectedGender!] || 'other';

            console.log('--- SAVE PROFILE DEBUG ---');
            const { data: { session } } = await supabase.auth.getSession();
            console.log('Session User ID:', session?.user?.id);
            console.log('Target ID:', user?.id);
            console.log('Target Name:', name.trim());
            console.log('Target Gender:', dbGender);

            const { data, error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    display_name: name.trim(),
                    gender: dbGender,
                    email: user.email
                })
                .select();

            console.log('Supabase Error:', error);
            console.log('Supabase Data:', data);
            console.log('Rows affected:', data?.length || 0);
            console.log('---------------------------');

            if (error) throw error;

            // Trigger AuthContext to re-check profile completeness
            // This will automatically transition us to Home via the RootNavigator in App.js
            await refreshProfile();
        } catch (error: any) {
            console.error('Save Profile Error:', error);
            Alert.alert("Error", "Failed to save your profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 bg-background-dark relative">
                    <StatusBar style="light" />
                    <Background />

                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 16 }}>
                            {/* Progress Bar */}
                            <View className="w-full h-1 bg-white/10 rounded-full mb-6 mt-2">
                                <Animated.View
                                    className="h-full bg-primary rounded-full"
                                    style={[{ shadowColor: '#7f13ec', shadowRadius: 8, shadowOpacity: 0.6, elevation: 5 }, animatedProgressStyle]}
                                />
                            </View>

                            <View className="flex-1">
                                {currentStep === 'auth' ? (
                                    <Animated.View
                                        entering={FadeInLeft.duration(400)}
                                        exiting={FadeOutRight.duration(400)}
                                        className="flex-1"
                                    >
                                        <View className="mt-4 mb-10 md:mt-8">
                                            <Text className="text-[42px] font-space-bold tracking-tight text-white leading-[1.1]">
                                                Save your{"\n"}
                                                <Text className="text-white">progress</Text>
                                            </Text>
                                            <Text className="mt-4 text-gray-400 text-lg leading-relaxed font-space-regular">
                                                Sign in to sync your Rizz across devices and never lose your history.
                                            </Text>
                                        </View>

                                        <View className="flex-1 justify-center">
                                            <TouchableOpacity
                                                activeOpacity={0.9}
                                                onPress={async () => {
                                                    await signInWithGoogle();
                                                    progress.value = withTiming(0.66, { duration: 500 });
                                                    setCurrentStep('gender');
                                                }}
                                                className="relative w-full rounded-[1.5rem]"
                                            >
                                                <View className="flex-row items-center justify-center gap-4 w-full p-6 bg-surface-dark border border-white/10 rounded-[1.5rem]">
                                                    <Svg width={24} height={24} viewBox="0 0 24 24">
                                                        <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                        <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                        <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                        <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                                                    </Svg>
                                                    <Text className="text-xl font-space-medium text-white tracking-wide">
                                                        Continue with Google
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                        <Text className="text-center text-xs text-gray-500 px-6 font-space-regular mb-4">
                                            By continuing, you agree to the Terms of Service and Privacy Policy.
                                        </Text>
                                    </Animated.View>
                                ) : currentStep === 'gender' ? (
                                    <Animated.View
                                        entering={FadeInLeft.duration(400)}
                                        exiting={FadeOutRight.duration(400)}
                                        className="w-full"
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                progress.value = withTiming(0.33, { duration: 500 });
                                                setCurrentStep('auth');
                                            }}
                                            className="mb-6 -ml-2 p-2 w-12"
                                        >
                                            <MaterialIcons name="arrow-back" size={24} color="white" />
                                        </TouchableOpacity>
                                        <View className="mb-6">
                                            <Text className="text-[36px] font-space-bold tracking-tight text-white">
                                                What is your{"\n"}
                                                <Text className="text-white">gender?</Text>
                                            </Text>
                                        </View>

                                        <View className="flex flex-col gap-5 w-full max-w-sm mx-auto">
                                            {genders.map((gender) => {
                                                const isSelected = selectedGender === gender;
                                                return (
                                                    <TouchableOpacity
                                                        key={gender}
                                                        onPress={() => setSelectedGender(gender)}
                                                        activeOpacity={0.98}
                                                        className="relative w-full rounded-[1.5rem]"
                                                    >
                                                        {isSelected && (
                                                            <View className="absolute inset-0 rounded-[1.5rem] overflow-hidden">
                                                                <Glow color="#7f13ec" style={{ width: '100%', height: '100%', opacity: 0.5 }} />
                                                            </View>
                                                        )}
                                                        <View
                                                            className={`relative flex-row items-center justify-between w-full p-6 bg-surface-dark border rounded-[1.5rem] ${isSelected ? 'border-primary' : 'border-white/10'}`}
                                                        >
                                                            <Text className={`text-xl font-space-medium tracking-wide ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                                                {gender}
                                                            </Text>
                                                            <View className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-white/10'}`}>
                                                                {isSelected && <View className="w-3 h-3 bg-primary rounded-full" />}
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </Animated.View>
                                ) : (
                                    <Animated.View
                                        entering={FadeInLeft.duration(400)}
                                        exiting={FadeOutRight.duration(400)}
                                        className="w-full"
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                progress.value = withTiming(0.66, { duration: 500 });
                                                setCurrentStep('gender');
                                            }}
                                            className="mb-6 -ml-2 p-2 w-12"
                                        >
                                            <MaterialIcons name="arrow-back" size={24} color="white" />
                                        </TouchableOpacity>
                                        <View className="mb-4">
                                            <Text className="text-[36px] font-space-bold tracking-tight text-white leading-tight">
                                                What's your{"\n"}
                                                <Text className="text-primary-light font-space-bold">name?</Text>
                                            </Text>
                                        </View>
                                        <TextInput
                                            value={name}
                                            onChangeText={setName}
                                            placeholder="Enter your name"
                                            placeholderTextColor="#6b7280"
                                            className="w-full bg-surface-dark/50 border border-white/10 rounded-2xl p-6 text-xl text-white font-space-medium"
                                            style={{ height: 72 }}
                                            autoFocus
                                            maxLength={20}
                                        />
                                    </Animated.View>
                                )}
                            </View>

                            {currentStep !== 'auth' && (
                                <View className="mt-auto mb-4">
                                    <TouchableOpacity
                                        className={`relative w-full h-[72px] rounded-full overflow-hidden bg-surface-dark ${(currentStep === 'gender' && !selectedGender) || (currentStep === 'name' && name.trim().length === 0) ? 'opacity-40' : ''}`}
                                        disabled={(currentStep === 'gender' && !selectedGender) || (currentStep === 'name' && name.trim().length === 0)}
                                        activeOpacity={0.9}
                                        onPress={() => {
                                            if (currentStep === 'gender' && selectedGender) {
                                                progress.value = withTiming(1.0, { duration: 500 });
                                                setCurrentStep('name');
                                            } else if (currentStep === 'name' && name.trim().length > 0) {
                                                handleSaveProfile();
                                            }
                                        }}
                                    >
                                        <LinearGradient
                                            colors={['#6e11d0', '#9f4bf6']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
                                        />
                                        <View className="absolute inset-0 flex items-center justify-center">
                                            {isSaving ? (
                                                <ActivityIndicator color="white" />
                                            ) : (
                                                <Text className="text-white text-xl font-space-bold tracking-wide flex items-center justify-center gap-2">
                                                    Continue
                                                </Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </SafeAreaView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
