import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

interface ActionButtonProps {
    label: string;
    onPress: () => void;
    icon?: keyof typeof MaterialIcons.glyphMap;
    variant?: 'primary' | 'secondary';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ label, onPress, icon = 'auto-awesome', variant = 'primary' }) => {
    return (
        <View className="mb-8">
            <TouchableOpacity
                onPress={onPress}
                className="relative w-full h-16 rounded-full overflow-hidden shadow-[0_0_20px_rgba(127,19,236,0.4)] active:scale-[0.98]"
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={variant === 'primary' ? ['#7f13ec', '#9f4bf6'] : ['#312e81', '#4338ca']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="absolute inset-0"
                />
                <View className="absolute inset-0 bg-white/10 opacity-10" />
                <View className="flex-1 flex-row items-center justify-center gap-3">
                    <Text className="text-white text-lg font-space-bold tracking-wide uppercase">{label}</Text>
                    <View className="animate-pulse">
                        <MaterialIcons name={icon} size={24} color="white" />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};
