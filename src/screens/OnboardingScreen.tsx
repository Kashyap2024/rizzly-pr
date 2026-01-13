import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
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

const genders = ["Male", "Female", "Other"];

export default function OnboardingScreen() {
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [currentStep, setCurrentStep] = useState<'gender' | 'name'>('gender');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const progress = useSharedValue(0.25);
    const animatedProgressStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
    }));

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
                                {currentStep === 'gender' ? (
                                    <Animated.View
                                        entering={FadeInLeft.duration(400)}
                                        exiting={FadeOutRight.duration(400)}
                                        className="w-full"
                                    >
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
                                                progress.value = withTiming(0.25, { duration: 500 });
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

                            {/* Continue Button */}
                            <View className="mt-auto mb-4">
                                <TouchableOpacity
                                    className={`relative w-full h-[72px] rounded-full overflow-hidden bg-surface-dark ${(currentStep === 'gender' && !selectedGender) || (currentStep === 'name' && name.trim().length === 0) ? 'opacity-40' : ''}`}
                                    disabled={(currentStep === 'gender' && !selectedGender) || (currentStep === 'name' && name.trim().length === 0)}
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        if (currentStep === 'gender' && selectedGender) {
                                            progress.value = withTiming(0.5, { duration: 500 });
                                            setCurrentStep('name');
                                        } else if (currentStep === 'name' && name.trim().length > 0) {
                                            navigation.navigate("Home", { name: name.trim(), gender: selectedGender! });
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
                                        <Text className="text-white text-xl font-space-bold tracking-wide flex items-center justify-center gap-2">
                                            Continue
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
