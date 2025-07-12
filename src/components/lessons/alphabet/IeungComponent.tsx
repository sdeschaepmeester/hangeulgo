import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import SubTitle from '../SubTitle';
import { alphabetLesson } from '@/services/lessons';
import LetterItem from './LetterItem';

interface Syllable {
    symbol: string;
    name: string;
}

const ieungVowelsData: Syllable[] = [
    { symbol: '아', name: 'a' },
    { symbol: '어', name: 'eo' },
    { symbol: '오', name: 'o' },
    { symbol: '우', name: 'u' },
    { symbol: '이', name: 'i' },
    { symbol: '에', name: 'e' },
    { symbol: '애', name: 'ae' },
    { symbol: '야', name: 'ya' },
    { symbol: '여', name: 'yeo' },
    { symbol: '요', name: 'yo' },
    { symbol: '유', name: 'yu' },
    { symbol: '의', name: 'ui' },
];

export const IeungComponent: React.FC = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* ------------------------ What you learn ------------------------ */}
            <Text style={{ fontStyle: "italic", marginBottom: 8 }}>
                {alphabetLesson.chapters[3].description}
            </Text>

            {/* ------------------------ Info ------------------------ */}
            <Text style={{ marginBottom: 12 }}>
                {alphabetLesson.chapters[3]?.doubleConsonnantExplanation ?? ''}
            </Text>

            {/* ------------------------ Ieung rules ------------------------ */}
            <View style={{ marginTop: 12 }}>
                <SubTitle label={alphabetLesson.chapters[3].ieungTitle ?? ""} />
                <Text>{alphabetLesson.chapters[3].ieungIntro ?? ""}</Text>
                <Text>{alphabetLesson.chapters[3].ieungExplanation ?? ""}</Text>
            </View>

            {/* ------------------------ Example of how ieung sounds next to vowels ------------------------ */}
            <View style={{ marginTop: 12 }}>
                <SubTitle label="Examples: ieung + vowel" />
                <View style={styles.list}>
                    {ieungVowelsData.map((s) => (
                        <LetterItem key={s.symbol} symbol={s.symbol} name={s.name} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: 'column'
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
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
    name: {
        fontSize: 12,
        color: '#555',
    },
});