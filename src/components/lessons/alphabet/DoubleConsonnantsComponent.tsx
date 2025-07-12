import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import SubTitle from '../SubTitle';
import LetterItem from './LetterItem';
import { alphabetLesson } from '@/services/lessons';

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
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* ------------------------ What you learn ------------------------ */}
            <Text style={{ fontStyle: 'italic', marginBottom: 8 }}>
                {alphabetLesson.chapters[2].description}
            </Text>

            {/* ------------------------ Info ------------------------ */}
            <Text style={{ marginBottom: 12 }}>
                {alphabetLesson.chapters[2]?.doubleConsonnantExplanation ?? ''}
            </Text>

            {/* ------------------------ Double consonants list ------------------------ */}
            <View style={{ marginTop: 12 }}>
                <SubTitle label={alphabetLesson.chapters[2].doubleConsonnantTitle ?? ''} />
                <Text>{alphabetLesson.chapters[2].doubleConsonnantIntro ?? ''}</Text>
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: 'column',
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
});