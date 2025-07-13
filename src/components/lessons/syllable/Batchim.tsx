import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SubTitle from '../SubTitle';
import { syllableLesson } from '@/services/lessons';
import { ExampleBox } from '../ExampleBox';
import * as Speech from 'expo-speech';
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const BatchimComponent: React.FC = () => {
    const batchims = ["ㄳ", "ㄵ", "ㄶ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅄ"];
    const gyeobbatchimExamples = [
        {
            word: '감사합니다',
            romanization: 'gam-sa-hab-ni-da',
            prononciation: 'gam-sa-ham-ni-da',
            explanation: `${syllableLesson.chapters[1].consonnant} ㅂ ${syllableLesson.chapters[1].meeting} ㄴ ${syllableLesson.chapters[1].pronunced} "m"`,
        },
        {
            word: "읽다",
            romanization: "ilg-da",
            prononciation: "ik-tta",
            explanation: `${syllableLesson.chapters[1].consonnant} ㄺ ${syllableLesson.chapters[1].meeting} ㄷ ${syllableLesson.chapters[1].pronunced} "k"`
        }
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* ------------------------ What you learn ------------------------ */}
            <Text style={styles.intro}>
                {syllableLesson.chapters[1].description}
            </Text>

            {/* ------------------------ Introduction ------------------------ */}
            <View style={{ marginBottom: 16 }}>
                <SubTitle label={syllableLesson.chapters[1].introTitle ?? ""} />
                <Text>{syllableLesson.chapters[1].introTextParts?.[0]}</Text>
                <Text style={{ marginTop: 8 }}>{syllableLesson.chapters[1].introTextParts?.[1]}</Text>
                <Text style={{ marginTop: 8 }}>
                    {syllableLesson.chapters[1].introTextParts?.[2]}{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                        {syllableLesson.chapters[1].introTextParts?.[3]}
                    </Text>{' '}
                    {syllableLesson.chapters[1].introTextParts?.[4]}
                </Text>
            </View>

            {/* ------------------------ Batchim section ------------------------ */}
            <View style={{ marginBottom: 16 }}>
                <SubTitle label={syllableLesson.chapters[1].batchimTitle ?? ""} />
                <Text>{syllableLesson.chapters[1].batchimText}</Text>

                {/* List of batchims and their pronunciations */}
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableHeader, styles.cell]}>{syllableLesson.chapters[1].batchimTableHeaders?.[0]}</Text>
                        <Text style={[styles.tableHeader, styles.cell]}>{syllableLesson.chapters[1].batchimTableHeaders?.[1]}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.cell}>ㄱ, ㅋ, ㄲ</Text>
                        <Text style={styles.cell}>kk</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.cell}>ㅂ, ㅍ</Text>
                        <Text style={styles.cell}>p</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.cell}>ㅁ</Text>
                        <Text style={styles.cell}>m</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.cell}>ㄴ</Text>
                        <Text style={styles.cell}>n</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.cell}>ㄷ, ㅌ, ㅅ, ㅆ, ㅈ, ㅊ</Text>
                        <Text style={styles.cell}>t</Text>
                    </View>
                </View>
            </View>

            {/* ------------------------ Gyeobbatchims section ------------------------ */}
            <View style={{ marginBottom: 16 }}>
                <SubTitle label={syllableLesson.chapters[1].gyeobbatchimTitle ?? ""} />
                <Text>{syllableLesson.chapters[1].gyeobbatchimTextParts?.[0]}</Text>
                <Text style={{ fontWeight: 'bold' }}>
                    {syllableLesson.chapters[1].gyeobbatchimTextParts?.[1]}
                </Text>
                <View style={styles.examplesRow}>
                    {batchims.map((batchim) => (
                        <ExampleBox key={batchim} text={batchim} />
                    ))}
                </View>
                <Text style={{ marginTop: 8 }}>{syllableLesson.chapters[1].gyeobbatchimTextParts?.[2]}</Text>
                <Text style={{ marginTop: 8, fontWeight: 'bold' }}>{syllableLesson.chapters[1].gyeobbatchimTextParts?.[3]}</Text>
            </View>

            {/* ------------------------ Table of examples ------------------------ */}
            <View style={{ marginBottom: 16 }}>
                <SubTitle label={syllableLesson.chapters[1].liaisonTitle ?? ""} />
                <Text>{syllableLesson.chapters[1].liaisonText}</Text>
            </View>
            <View style={styles.table}>
                {/* Header */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableHeader, styles.cell, styles.wordCell]}>
                        <Text>{syllableLesson.chapters[1].word}</Text>
                    </View>
                    <Text style={[styles.tableHeader, styles.cell]}>{syllableLesson.chapters[1].phonetic}</Text>
                    <Text style={[styles.tableHeader, styles.cell]}>{syllableLesson.chapters[1].translation}</Text>
                    <Text style={[styles.tableHeader, styles.cell]}>{syllableLesson.chapters[1].pronunciation}</Text>
                </View>


                {/* Examples of batchim and gyeobbatchims */}
                {gyeobbatchimExamples.map((ex) => (
                    <View key={ex.word} style={styles.tableRow}>
                        <View style={[styles.cell, styles.wordCell]}>
                            <Text>{ex.word}</Text>
                            <TouchableOpacity
                                onPress={() =>
                                    Speech.speak(ex.word, { language: 'ko' })
                                }
                                style={{ marginLeft: 4 }}
                            >
                                <MaterialCommunityIcons
                                    name="volume-high"
                                    size={20}
                                    color="#333"
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.cell}>{ex.romanization}</Text>
                        <Text style={styles.cell}>{ex.prononciation}</Text>
                        <Text style={styles.cell}>{ex.explanation}</Text>
                    </View>
                ))}
            </View>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: 'column',
    },
    intro: {
        fontStyle: 'italic',
        marginBottom: 12,
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 8,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeader: {
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
    },
    cell: {
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    examplesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: 12,
    },
    wordCell: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
