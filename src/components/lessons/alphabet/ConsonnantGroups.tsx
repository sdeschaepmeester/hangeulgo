import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SubTitle from "../SubTitle";
import { getLessonTranslation } from "@/services/lessons";

interface ConsonantGroup {
    name: string;
    description: string;
    consonants: string;
}


export default function ConsonantGroups() {
    const localLesson = getLessonTranslation("alphabet");
    if (!localLesson) {
        throw new Error("No translation found for alphabet lesson.");
    }
    const consonantGroups: ConsonantGroup[] = [
        {
            name: localLesson.chapters[0].bilabial ?? "",
            description: localLesson.chapters[0].bilabialSound ?? "",
            consonants: "ㅂ (b/p), ㅍ (p), ㅁ (m)",
        },
        {
            name: localLesson.chapters[0].alveolar ?? "",
            description: localLesson.chapters[0].alveolarSound ?? "",
            consonants: "ㄷ (d/t), ㅌ (t), ㄴ (n), ㄹ (r/l), ㅅ (s)",
        },
        {
            name: localLesson.chapters[0].palatal ?? "",
            description: localLesson.chapters[0].palatalSound ?? "",
            consonants: "ㅈ (j), ㅊ (ch)",
        },
        {
            name: localLesson.chapters[0].glottal ?? "",
            description: localLesson.chapters[0].glottalSound ?? "",
            consonants: "ㅎ (h)",
        },
        {
            name: localLesson.chapters[0].velars ?? "",
            description: localLesson.chapters[0].velarsSound ?? "",
            consonants: "ㄱ (g/k), ㅋ (k), ㅇ (ng)",
        },
    ];

    return (
        <View style={{ marginTop: 12 }}>
            <SubTitle label={localLesson.chapters[0].consonnantGroupTitle ?? ''} />
            <Text>
                {localLesson.chapters[0].consonnantGroupIntro}
            </Text>
            {consonantGroups.map((group) => (
                <Text key={group.name} style={{ marginTop: 8 }}>
                    <Text style={styles.groupName}>{group.name} :</Text>{" "}
                    {group.description}. {localLesson.chapters[0].consonnants} {group.consonants}.
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
