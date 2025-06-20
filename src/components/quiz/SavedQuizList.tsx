import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { View, StyleSheet } from "react-native";
import type { SavedQuizEntry } from "@/types/SavedQuizEntry";
import SavedQuizItem from "./SavedQuizItem";

type Props = {
    data: SavedQuizEntry[];
    onDelete: (id: number) => void;
    onSelect: (quiz: SavedQuizEntry) => void;
};

export default function SavedQuizList({ data, onDelete, onSelect }: Props) {
    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                {data.map((quiz) => (
                    <SavedQuizItem
                        key={quiz.id}
                        quiz={quiz}
                        onDelete={onDelete}
                        onSelect={onSelect}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    container: {
        gap: 12,
    },
});