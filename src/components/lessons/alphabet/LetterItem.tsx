import React, { useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Speech from 'expo-speech';

interface Props {
    symbol: string;
    name: string;
    romanization?: string;
}

export default function LetterItem({ symbol, name, romanization }: Props) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const playSound = () => {
        setIsSpeaking(true);

        Speech.speak(symbol, {
            language: 'ko-KR',
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
        });
    };

    return (
        <TouchableOpacity
            style={[
                styles.item,
                { backgroundColor: isSpeaking ? "#cce5ff" : "#eee" }
            ]}
            onPress={playSound}
            activeOpacity={0.7}
        >
            <Text style={styles.symbol}>{symbol}</Text>
            <Text style={styles.name}>{name}</Text>
            {romanization ? (
                <Text style={styles.romanization}>
                    ({romanization})
                </Text>
            ) : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        minWidth: 72,
        maxWidth: 100,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
    },
    symbol: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 12,
        marginTop: 2,
        color: '#333',
        textAlign: 'center',
    },
    romanization: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
    },
});