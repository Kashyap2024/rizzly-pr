import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

interface TrialExhaustedModalProps {
    visible: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

export const TrialExhaustedModal: React.FC<TrialExhaustedModalProps> = ({
    visible,
    onClose,
    onUpgrade
}) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <View className="flex-1 items-center justify-center px-6">
                <BlurView
                    intensity={80}
                    tint="dark"
                    className="absolute inset-0"
                />

                <Animated.View
                    entering={ZoomIn.duration(400)}
                    exiting={ZoomOut.duration(300)}
                    className="w-full max-w-sm bg-surface-dark border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/40"
                >
                    <View className="p-8 items-center">
                        <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-6">
                            <MaterialIcons name="lock" size={40} color="#9f4bf6" />
                        </View>

                        <Text className="text-2xl font-space-bold text-white text-center mb-2">
                            Trial Exhausted
                        </Text>

                        <Text className="text-gray-400 text-center font-space-regular text-base leading-relaxed mb-8">
                            You've used all your free Rizz. Upgrade to Pro for unlimited generations and premium AI models.
                        </Text>

                        <View className="w-full gap-4">
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={onUpgrade}
                                className="w-full h-16 rounded-full overflow-hidden"
                            >
                                <LinearGradient
                                    colors={['#7f13ec', '#9f4bf6']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="flex-1 items-center justify-center"
                                >
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-white font-space-bold text-lg">Join Rizzly Pro</Text>
                                        <MaterialIcons name="workspace-premium" size={20} color="white" />
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={onClose}
                                className="w-full h-16 rounded-full border border-white/10 items-center justify-center"
                            >
                                <Text className="text-white/60 font-space-medium text-base">Maybe later</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Bottom Gradient Accent */}
                    <LinearGradient
                        colors={['transparent', 'rgba(127, 19, 236, 0.1)']}
                        className="h-2 w-full"
                    />
                </Animated.View>
            </View>
        </Modal>
    );
};
