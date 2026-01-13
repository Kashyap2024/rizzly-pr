import React from "react";
import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

export default function GradientText({ children, style }) {
    return (
        <MaskedView
            maskElement={<Text style={style}>{children}</Text>}
        >
            <LinearGradient
                colors={['#9f4bf6', '#c084fc', '#e9d5ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={[style, { opacity: 0 }]}>{children}</Text>
            </LinearGradient>
        </MaskedView>
    );
};
