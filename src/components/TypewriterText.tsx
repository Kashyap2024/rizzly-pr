import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

interface TypewriterTextProps {
    text: string;
    speed?: number;
    delay?: number;
    onComplete?: () => void;
    className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    speed = 20,
    delay = 0,
    onComplete,
    className
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsStarted(true);
        }, delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!isStarted) return;

        if (displayedText.length < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length + 1));
            }, speed);
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [displayedText, text, speed, isStarted, onComplete]);

    return (
        <Text className={className}>
            {displayedText}
        </Text>
    );
};
