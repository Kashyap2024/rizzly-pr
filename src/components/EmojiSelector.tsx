import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type EmojiMode = 'relevant' | 'on' | 'off';

interface EmojiSelectorProps {
    value: EmojiMode;
    onChange: (mode: EmojiMode) => void;
    compact?: boolean;
}

export const EmojiSelector: React.FC<EmojiSelectorProps> = ({ value, onChange, compact }) => {
    const options: { id: EmojiMode; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
        { id: 'relevant', label: 'Default', icon: 'auto-awesome' },
        { id: 'on', label: 'On', icon: 'sentiment-satisfied' },
        { id: 'off', label: 'Off', icon: 'block' }
    ];

    return (
        <View
            className={`bg-white/5 rounded-2xl p-1.5 flex-row ${compact ? '' : 'p-2'}`}
        >
            {options.map((option) => {
                const isSelected = value === option.id;
                return (
                    <TouchableOpacity
                        key={option.id}
                        onPress={() => onChange(option.id)}
                        className={`flex-1 items-center justify-center rounded-xl flex-row gap-2 ${compact ? 'py-2.5' : 'py-3'}`}
                        style={{
                            backgroundColor: isSelected ? 'rgba(127, 19, 236, 1)' : 'transparent',
                        }}
                    >
                        <MaterialIcons
                            name={option.icon}
                            size={compact ? 14 : 16}
                            color={isSelected ? 'white' : '#9ca3af'}
                        />
                        <Text className={`${compact ? 'text-[11px]' : 'text-xs'} font-space-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
