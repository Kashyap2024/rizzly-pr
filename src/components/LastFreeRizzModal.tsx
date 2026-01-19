import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

interface LastFreeRizzModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LastFreeRizzModal: React.FC<LastFreeRizzModalProps> = ({
    visible,
    onClose,
    onConfirm
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
                    className="w-full max-w-sm bg-surface-dark border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20"
                >
                    <LinearGradient
                        colors={['#7f13ec', '#9f4bf6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="py-10 items-center justify-center relative overflow-hidden"
                    >
                        {/* Decorative Background Icon */}
                        <MaterialIcons
                            name="auto-awesome"
                            size={120}
                            color="rgba(255,255,255,0.1)"
                            style={{ position: 'absolute' }}
                        />

                        <View className="bg-white/20 p-5 rounded-full border border-white/30 mb-4 shadow-xl">
                            <MaterialIcons name="star" size={40} color="white" />
                        </View>

                        <Text className="text-2xl font-space-bold text-white text-center px-6">
                            Last Free Rizz
                        </Text>
                    </LinearGradient>

                    <View className="p-8 items-center">
                        <Text className="text-gray-400 text-center font-space-regular text-base leading-relaxed mb-8">
                            This is your very last free generation. Make it count! {"\n\n"}
                            Upgrade to <Text className="text-primary-light font-bold">Pro</Text> later for unlimited rizz and advanced AI models.
                        </Text>

                        <View className="w-full gap-4">
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={onConfirm}
                                className="w-full h-16 rounded-full overflow-hidden"
                            >
                                <LinearGradient
                                    colors={['#7f13ec', '#9f4bf6']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="flex-1 items-center justify-center"
                                >
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-white font-space-bold text-lg">Use Last Rizz</Text>
                                        <MaterialIcons name="bolt" size={20} color="white" />
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={onClose}
                                className="w-full h-16 rounded-full border border-white/10 items-center justify-center"
                            >
                                <Text className="text-white/60 font-space-medium text-base">Wait, not yet</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};
