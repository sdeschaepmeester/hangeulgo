import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SubTitle from '../SubTitle';
import { syllableLesson } from '@/services/lessons';
import { ExampleBox } from '../ExampleBox';
import { ScrollView } from 'react-native-gesture-handler';

export const SyllableIntroductionComponent: React.FC = () => {
    return (
        <ScrollView style={styles.container}>
            {/* ------------------------ What you learn ------------------------ */}
            <Text style={{ fontStyle: "italic", marginBottom: 8 }}>
                {syllableLesson.chapters[0].description}
            </Text>

            {/* ------------------------ Rules about syllables ------------------------ */}
            <View style={{ marginBottom: 12 }}>
                <SubTitle label={syllableLesson.chapters[0].rulesTitle ?? ''} />

                {syllableLesson.chapters[0].rules?.map((rule, index) => (
                    <View key={index} style={{ marginBottom: 12 }}>
                        <Text style={styles.ruleItem}>• {rule}</Text>
                        {index === 0 && <ExampleBox text="한" label={syllableLesson.chapters[0].examples?.[0]} />}
                        {index === 1 && <ExampleBox text="아" label={syllableLesson.chapters[0].examples?.[1]} />}
                        {index === 2 && <ExampleBox text="가" label={syllableLesson.chapters[0].examples?.[2]} />}
                        {index === 3 && (
                            <View style={{ flexDirection: "row" }}>
                                <ExampleBox text="가" label="ga" />
                                <ExampleBox text="나" label="na" />
                                <ExampleBox text="다" label="da" />
                            </View>
                        )}
                    </View>
                ))}
            </View>

            {/* ------------------------ Construction of a syllable ------------------------ */}
            <View style={{ marginBottom: 12 }}>
                <SubTitle label={syllableLesson.chapters[0].constructionTitle ?? ''} />
                <Text>
                    {syllableLesson.chapters[0].constructionDescription ?? ''}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <ExampleBox text="가" label={syllableLesson.chapters[0].examples?.[4]} />
                    <ExampleBox text="보" label={syllableLesson.chapters[0].examples?.[3]} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        flexDirection: 'column',
        gap: 12,
    },
    ruleItem: {
        marginBottom: 2,
    },
    example: {
        marginTop: 2,
        marginLeft: 12,
        fontStyle: 'italic',
        color: '#555',
    },
});
