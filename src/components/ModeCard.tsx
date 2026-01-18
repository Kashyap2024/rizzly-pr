import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Glow from './Glow';

interface ModeCardProps {
    title: string;
    subtitle: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    gradientColors: [string, string, ...string[]];
    glowColor: string;
    iconColor: string;
    shadowColor: string;
    onPress: () => void;
}

export const ModeCard: React.FC<ModeCardProps> = ({
    title,
    subtitle,
    icon,
    gradientColors,
    glowColor,
    iconColor,
    shadowColor,
    onPress
}) => {
    return (
        <TouchableOpacity
            className="w-full h-[200px] rounded-[2.5rem] bg-surface-dark border border-white/5 relative overflow-hidden p-6"
            activeOpacity={0.96}
            onPress={onPress}
        >
            <View className="absolute inset-0 opacity-60">
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1 }}
                />
            </View>
            <View className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full overflow-hidden opacity-50">
                <Glow color={glowColor} style={{ width: '100%', height: '100%' }} />
            </View>

            <View className="relative z-10 flex-col justify-between h-full">
                <View className="flex-row justify-between items-start">
                    <View
                        className={`w-16 h-16 rounded-2xl bg-white/10 items-center justify-center border border-white/10 shadow-lg ${shadowColor}`}
                    >
                        <MaterialIcons name={icon} size={32} color={iconColor} />
                    </View>
                    <MaterialIcons name="arrow-forward" size={32} color="rgba(255,255,255,0.3)" />
                </View>
                <View className="mt-4">
                    <Text className="text-3xl font-space-bold text-white leading-none mb-1">{title}</Text>
                    <Text className="text-gray-400 font-space-medium text-sm">{subtitle}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
