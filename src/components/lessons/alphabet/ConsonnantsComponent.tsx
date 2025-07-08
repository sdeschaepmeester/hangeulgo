'use client';

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';

interface Props {
    locale: string;
}

interface Consonant {
    symbol: string;
    romanization: string;
}

const consonantsData: Consonant[] = [
    { symbol: 'ㄱ', romanization: 'g/k' },
    { symbol: 'ㄴ', romanization: 'n' },
    { symbol: 'ㄷ', romanization: 'd/t' },
    { symbol: 'ㄹ', romanization: 'r/l' },
    { symbol: 'ㅁ', romanization: 'm' },
    { symbol: 'ㅂ', romanization: 'b/p' },
    { symbol: 'ㅅ', romanization: 's' },
    { symbol: 'ㅇ', romanization: 'ng' },
    { symbol: 'ㅈ', romanization: 'j' },
    { symbol: 'ㅊ', romanization: 'ch' },
    { symbol: 'ㅋ', romanization: 'k' },
    { symbol: 'ㅌ', romanization: 't' },
    { symbol: 'ㅍ', romanization: 'p' },
    { symbol: 'ㅎ', romanization: 'h' },
];

export const ConsonnesComponent: React.FC<Props> = ({ locale }) => {
    const playSound = (text: string) => {
        Speech.speak(text, { language: 'ko-KR' });
    };

    return (
        <View style={styles.container}>
            {consonantsData.map((c) => (
                <TouchableOpacity
                    key={c.symbol}
                    style={styles.button}
                    onPress={() => playSound(c.symbol)}
                >
                    <Text style={styles.symbol}>{c.symbol}</Text>
                    <Text style={styles.romanization}>{c.romanization}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    button: {
        width: 64,
        height: 64,
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
    romanization: {
        fontSize: 12,
        color: '#555',
    },
});