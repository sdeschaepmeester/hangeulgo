import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import type { LexiconEntry } from "@/types/LexiconEntry";
import LexiconCard from "@/components/lexicon/LexiconCard";
import IconButton from "../IconButton";

type Props = {
    data: LexiconEntry[];
    onToggle: (id: number, current: number) => void;
    onDelete: (id: number) => void;
    onDeleteAll: () => void;
    onUpdate: (id: number) => void;
};

export default function LexiconList({ data, onToggle, onDelete, onDeleteAll, onUpdate }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Lexique</Text>

                <IconButton
                    label="Supprimer tout"
                    icon="delete-empty"
                    onPress={onDeleteAll}
                    backgroundColor="#fcebea"
                    color="#e53935"
                />
            </View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <LexiconCard
                        id={item.id}
                        fr={item.fr}
                        ko={item.ko}
                        phonetic={item.phonetic}
                        tags={item.tags}
                        difficulty={item.difficulty}
                        active={item.active}
                        onToggle={() => onToggle(item.id, item.active)}
                        onDelete={() => onDelete(item.id)}
                        onUpdate={onUpdate}
                    />
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    listContent: {
        paddingBottom: 15,
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fcebea",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    deleteButtonText: {
        marginLeft: 6,
        color: "#e53935",
        fontSize: 14,
        fontWeight: "500",
    }
});