'use client';

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ConsonantGroups from './ConsonnantGroups';
import SubTitle from '../SubTitle';
import { getLessonTranslation } from '@/services/lessons';
import LetterItem from './LetterItem';

interface Props {
    locale: string;
}

interface Consonant {
    symbol: string;
    romanization: string;
    name: string;
}

const consonantsData: Consonant[] = [
    { symbol: 'ㄱ', name: 'Giyeok', romanization: 'g/k' },
    { symbol: 'ㄴ', name: 'Nieun', romanization: 'n' },
    { symbol: 'ㄷ', name: 'Digeut', romanization: 'd/t' },
    { symbol: 'ㄹ', name: 'Rieul', romanization: 'r/l' },
    { symbol: 'ㅁ', name: 'Mieum', romanization: 'm' },
    { symbol: 'ㅂ', name: 'Bieup', romanization: 'b/p' },
    { symbol: 'ㅅ', name: 'Siot', romanization: 's' },
    { symbol: 'ㅇ', name: 'Ieung', romanization: 'ng' },
    { symbol: 'ㅈ', name: 'Jieut', romanization: 'j' },
    { symbol: 'ㅊ', name: 'Chieut', romanization: 'ch' },
    { symbol: 'ㅋ', name: 'Kieuk', romanization: 'k' },
    { symbol: 'ㅌ', name: 'Tieut', romanization: 't' },
    { symbol: 'ㅍ', name: 'Pieup', romanization: 'p' },
    { symbol: 'ㅎ', name: 'Hieut', romanization: 'h' },
];

export const ConsonnantsComponent: React.FC<Props> = () => {
    const localLesson = getLessonTranslation("alphabet");
    if (!localLesson) {
        throw new Error("No translation found for alphabet lesson.");
    }

    return (
        <View style={styles.container}>
            {/* ------------------------ What you learn ------------------------ */}
            <Text style={{ fontStyle: "italic", marginBottom: 8 }}>
                {localLesson.chapters[0].description}
            </Text>
            {/* ------------------------ Consonnants types ------------------------ */}
            <ConsonantGroups />
            {/* ------------------------ Consonnants list ------------------------ */}
            <View style={{ marginTop: 12 }}>
                <SubTitle label={localLesson.chapters[0].consonnantTitle ?? ''} />
                <Text>
                    {localLesson.chapters[0].consonnantIntro}
                </Text>
                <View style={styles.list}>
                    {consonantsData.map((c) => (
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
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    }
});