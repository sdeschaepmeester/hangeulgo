import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SubTitle from "../SubTitle";
import { alphabetLesson } from "@/services/lessons";

interface ConsonantGroup {
    name: string;
    description: string;
    consonants: string;
}


export default function ConsonantGroups() {

    const consonantGroups: ConsonantGroup[] = [
        {
            name: alphabetLesson.chapters[0].bilabial ?? "",
            description: alphabetLesson.chapters[0].bilabialSound ?? "",
            consonants: "ㅂ (b/p), ㅍ (p), ㅁ (m)",
        },
        {
            name: alphabetLesson.chapters[0].alveolar ?? "",
            description: alphabetLesson.chapters[0].alveolarSound ?? "",
            consonants: "ㄷ (d/t), ㅌ (t), ㄴ (n), ㄹ (r/l), ㅅ (s)",
        },
        {
            name: alphabetLesson.chapters[0].palatal ?? "",
            description: alphabetLesson.chapters[0].palatalSound ?? "",
            consonants: "ㅈ (j), ㅊ (ch)",
        },
        {
            name: alphabetLesson.chapters[0].glottal ?? "",
            description: alphabetLesson.chapters[0].glottalSound ?? "",
            consonants: "ㅎ (h)",
        },
        {
            name: alphabetLesson.chapters[0].velars ?? "",
            description: alphabetLesson.chapters[0].velarsSound ?? "",
            consonants: "ㄱ (g/k), ㅋ (k), ㅇ (ng)",
        },
    ];

    return (
        <View style={{ marginTop: 12 }}>
            <SubTitle label={alphabetLesson.chapters[0].consonnantGroupTitle ?? ''} />
            <Text>
                {alphabetLesson.chapters[0].consonnantGroupIntro}
            </Text>
            {consonantGroups.map((group) => (
                <Text key={group.name} style={{ marginTop: 8 }}>
                    <Text style={styles.groupName}>{group.name} :</Text>{" "}
                    {group.description}. {alphabetLesson.chapters[0].consonnants} {group.consonants}.
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    groupName: {
        fontWeight: "bold",
    },
});
