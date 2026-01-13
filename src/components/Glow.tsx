import React from "react";
import { View } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

export default function Glow({ color = "#7f13ec", style }) {
    return (
        <View style={style}>
            <Svg height="100%" width="100%">
                <Defs>
                    <RadialGradient
                        id="glowGrad"
                        cx="50%"
                        cy="50%"
                        rx="50%"
                        ry="50%"
                        fx="50%"
                        fy="50%"
                        gradientUnits="userSpaceOnUse"
                    >
                        <Stop offset={0} stopColor={color} stopOpacity={0.6} />
                        <Stop offset={1} stopColor={color} stopOpacity={0} />
                    </RadialGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowGrad)" />
            </Svg>
        </View>
    );
}
