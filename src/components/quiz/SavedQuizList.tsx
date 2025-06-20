import React from "react";
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
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
});