import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface RizzCardProps {
    text: string;
    onCopy: () => void;
    feedbackStatus?: 'like' | 'dislike' | null;
    showThankYou?: boolean;
    onFeedback: (type: 'like' | 'dislike') => void;
}

export const RizzCard: React.FC<RizzCardProps> = ({
    text,
    onCopy,
    feedbackStatus,
    showThankYou,
    onFeedback
}) => {
    return (
        <TouchableOpacity
            className="group relative bg-surface-dark border border-white/10 rounded-2xl p-4 active:border-primary/40 transition-colors"
            activeOpacity={0.9}
        >
            <View className="flex-col gap-4">
                <View className="flex-row justify-between items-start gap-3">
                    <Text className="text-sm leading-relaxed text-gray-200 flex-1 font-space-regular">
                        {text}
                    </Text>
                    <TouchableOpacity
                        onPress={onCopy}
                        className="shrink-0 p-2 rounded-lg bg-white/5 active:bg-primary/20"
                    >
                        <MaterialIcons name="content-copy" size={18} color="#9ca3af" />
                    </TouchableOpacity>
                </View>

                {(!feedbackStatus || showThankYou) && (
                    <View className="flex-row items-center h-10">
                        {showThankYou ? (
                            <View className="animate-fade-in flex-row items-center gap-2">
                                <MaterialIcons name="check-circle" size={14} color="#4ade80" />
                                <Text className="text-[10px] font-space-bold text-green-400">Thank you for feedback!</Text>
                            </View>
                        ) : (
                            <View className="flex-row items-center gap-2">
                                <TouchableOpacity
                                    onPress={() => onFeedback('like')}
                                    className={`p-2 rounded-full border ${feedbackStatus === 'like' ? 'bg-green-500/20 border-green-500/50' : 'bg-white/5 border-white/5'}`}
                                >
                                    <MaterialIcons name="thumb-up" size={16} color={feedbackStatus === 'like' ? '#4ade80' : '#9ca3af'} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => onFeedback('dislike')}
                                    className={`p-2 rounded-full border ${feedbackStatus === 'dislike' ? 'bg-red-500/20 border-red-500/50' : 'bg-white/5 border-white/5'}`}
                                >
                                    <MaterialIcons name="thumb-down" size={16} color={feedbackStatus === 'dislike' ? '#f87171' : '#9ca3af'} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};
