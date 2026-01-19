import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';

export const RizzSkeleton = () => {
    const shimmerValue = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = shimmerValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <View className="bg-surface-dark border border-white/5 rounded-2xl p-4 mb-4">
            <View className="flex-col gap-4">
                <View className="flex-row justify-between items-start gap-3">
                    <View className="flex-1 gap-2">
                        <Animated.View style={{ opacity }} className="h-4 bg-white/10 rounded-md w-full" />
                        <Animated.View style={{ opacity }} className="h-4 bg-white/10 rounded-md w-3/4" />
                        <Animated.View style={{ opacity }} className="h-4 bg-white/10 rounded-md w-1/2" />
                    </View>
                    <View className="p-2 rounded-lg bg-white/5 w-10 h-10" />
                </View>
                <View className="flex-row items-center gap-2 h-10">
                    <Animated.View style={{ opacity }} className="w-8 h-8 rounded-full bg-white/10" />
                    <Animated.View style={{ opacity }} className="w-8 h-8 rounded-full bg-white/10" />
                </View>
            </View>
        </View>
    );
};
