import React, { useRef } from 'react';
import { View, Text, PanResponder } from 'react-native';

interface FlatterySliderProps {
    value: number;
    onChange: (value: number) => void;
}

export const FlatterySlider: React.FC<FlatterySliderProps> = ({ value, onChange }) => {
    const sliderWidthRef = useRef(0);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const x = evt.nativeEvent.locationX;
                if (sliderWidthRef.current > 0) {
                    const newLevel = Math.round((x / sliderWidthRef.current) * 100);
                    onChange(Math.max(0, Math.min(100, newLevel)));
                }
            },
            onPanResponderMove: (evt) => {
                const x = evt.nativeEvent.locationX;
                if (sliderWidthRef.current > 0) {
                    const newLevel = Math.round((x / sliderWidthRef.current) * 100);
                    onChange(Math.max(0, Math.min(100, newLevel)));
                }
            },
        })
    ).current;

    return (
        <View className="flex-col gap-4">
            <View className="flex-row justify-between items-end">
                <Text className="text-base font-space-medium text-white">Flattery Level</Text>
                <Text className="text-white font-space-bold text-lg">{value}%</Text>
            </View>

            {/* Visual Slider */}
            <View
                className="relative w-full h-8 justify-center"
                onLayout={(e) => { sliderWidthRef.current = e.nativeEvent.layout.width; }}
                {...panResponder.panHandlers}
            >
                <View className="absolute w-full h-1.5 bg-white/10 rounded-full overflow-hidden" pointerEvents="none">
                    <View
                        className="h-full bg-primary"
                        style={{ width: `${value}%` }}
                    />
                </View>
                <View
                    className="absolute -translate-x-3 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-primary items-center justify-center"
                    style={{ left: `${value}%` }}
                    pointerEvents="none"
                >
                    <View className="w-1.5 h-1.5 bg-primary rounded-full" />
                </View>
            </View>

            <View className="flex-row justify-between text-xs">
                <Text className="text-gray-500 font-space-regular text-xs">Subtle</Text>
                <Text className="text-gray-500 font-space-regular text-xs">Down Bad</Text>
            </View>
        </View>
    );
};
