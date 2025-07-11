'use client';

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SubTitle from '../SubTitle';
import { getLessonTranslation } from '@/services/lessons';
import LetterItem from './LetterItem';

interface Props { }

interface Consonant {
    symbol: string;
    romanization: string;
    name: string;
}

const doubleConsonantsData: Consonant[] = [
    { symbol: 'ㄲ', name: 'Ssang Giyeok', romanization: 'kk' },
    { symbol: 'ㄸ', name: 'Ssang Digeut', romanization: 'tt' },
    { symbol: 'ㅃ', name: 'Ssang Bieup', romanization: 'pp' },
    { symbol: 'ㅆ', name: 'Ssang Siot', romanization: 'ss' },
    { symbol: 'ㅉ', name: 'Ssang Jieut', romanization: 'jj' },
];

export const DoubleConsonnantsComponent: React.FC<Props> = () => {
    const localLesson = getLessonTranslation("alphabet");
    if (!localLesson) {
        throw new Error("No translation found for alphabet lesson.");
    }

    return (
        <View style={styles.container}>
            {/* ------------------------ What you learn ------------------------ */}
            <Text style={{ fontStyle: "italic", marginBottom: 8 }}>
                {localLesson.chapters[2].description}
            </Text>

            {/* ------------------------ Info ------------------------ */}
            <Text style={{ marginBottom: 12 }}>
                {localLesson.chapters[2].doubleConsonnantExplanation ?? ''}
            </Text>

            {/* ------------------------ Double consonants list ------------------------ */}
            <View style={{ marginTop: 12 }}>
                <SubTitle label={localLesson.chapters[2].doubleConsonnantTitle ?? 'Consonnes doubles'} />
                <Text>
                    {localLesson.chapters[2].doubleConsonnantIntro ?? 'Voici les 5 principales consonnes doubles :'}
                </Text>
                <View style={styles.list}>
                    {doubleConsonantsData.map((c) => (
                        <LetterItem
                            key={c.symbol}
                            symbol={c.symbol}
                            name={c.name}
                            romanization={c.romanization}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: 12,
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
});
