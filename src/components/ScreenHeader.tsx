import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    onBack: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, onBack }) => {
    return (
        <BlurView
            intensity={80}
            tint="dark"
            className="absolute top-0 left-0 right-0 z-50 pt-12 pb-4 px-4 flex-row items-center justify-between overflow-hidden"
            style={{
                backgroundColor: 'rgba(25, 16, 34, 0.7)',
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255, 255, 255, 0.1)',
            }}
        >
            <TouchableOpacity
                onPress={onBack}
                className="w-10 h-10 rounded-full items-center justify-center bg-surface-dark border border-white/10 active:bg-white/10"
            >
                <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View>
                <Text className="text-white text-lg font-space-bold tracking-wider uppercase text-center">{title}</Text>
                {subtitle && (
                    <Text className="text-primary text-[10px] font-space-bold tracking-widest uppercase text-center">{subtitle}</Text>
                )}
            </View>

            <View className="w-10" />
        </BlurView>
    );
};
