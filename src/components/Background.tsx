import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

export default function Background() {
    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: -1 }]} className="bg-background-dark">
            {/* SVG Background Layer for Soft Radial Gradients */}
            <View className="absolute inset-0 z-0">
                <Svg height="100%" width="100%">
                    <Defs>
                        <RadialGradient
                            id="grad1"
                            cx="0%"
                            cy="0%"
                            rx="60%"
                            ry="40%"
                            fx="0%"
                            fy="0%"
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset={0} stopColor="#7f13ec" stopOpacity={0.4} />
                            <Stop offset={1} stopColor="#191022" stopOpacity={0} />
                        </RadialGradient>
                        <RadialGradient
                            id="grad2"
                            cx="100%"
                            cy="100%"
                            rx="60%"
                            ry="40%"
                            fx="100%"
                            fy="100%"
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset={0} stopColor="#2563eb" stopOpacity={0.2} />
                            <Stop offset={1} stopColor="#191022" stopOpacity={0} />
                        </RadialGradient>
                    </Defs>

                    {/* Background Base */}
                    <Rect x="0" y="0" width="100%" height="100%" fill="#191022" />

                    {/* Top Left Gradient */}
                    <Rect x="0" y="0" width="100%" height="80%" fill="url(#grad1)" />

                    {/* Bottom Right Gradient */}
                    <Rect x="0" y="20%" width="100%" height="100%" fill="url(#grad2)" />
                </Svg>
            </View>

            {/* Top Gradient Fade Overlay */}
            <View
                className="absolute top-0 left-0 right-0 h-[400px] w-full z-0 opacity-50"
            >
                <LinearGradient
                    colors={['rgba(127, 19, 236, 0.15)', 'transparent']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
        </View>
    );
}
