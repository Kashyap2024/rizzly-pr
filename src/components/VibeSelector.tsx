import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface Vibe {
    id: string;
    label: string;
    icon?: keyof typeof MaterialIcons.glyphMap | null;
}

interface VibeSelectorProps {
    vibes: Vibe[];
    selectedVibe: string;
    onSelect: (id: string) => void;
}

export const VibeSelector: React.FC<VibeSelectorProps> = ({ vibes, selectedVibe, onSelect }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-4 px-4"
            contentContainerStyle={{ paddingRight: 32 }}
        >
            <View className="flex-row gap-3 pb-2">
                {vibes.map((vibe) => {
                    const isSelected = selectedVibe === vibe.id;
                    return (
                        <Pressable
                            key={vibe.id}
                            onPress={() => onSelect(vibe.id)}
                            className="h-10 px-6 rounded-full flex-row items-center gap-2 border"
                            style={{
                                backgroundColor: isSelected ? '#7f13ec' : 'rgba(255, 255, 255, 0.05)',
                                borderColor: isSelected ? '#7f13ec' : 'rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            {isSelected && (
                                <MaterialIcons
                                    name="auto-awesome"
                                    size={18}
                                    color="white"
                                />
                            )}
                            <Text className={`text-sm font-space-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                {vibe.label}
                            </Text>
                        </Pressable>
                    )
                })}
            </View>
        </ScrollView>
    );
};
