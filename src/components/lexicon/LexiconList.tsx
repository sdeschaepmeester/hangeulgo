import React from "react";
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { LexiconEntry } from "@/types/LexiconEntry";
import LexiconCard from "@/components/lexicon/LexiconCard";

type Props = {
    data: LexiconEntry[];
    onToggle: (id: number, current: number) => void;
    onDelete: (id: number) => void;
    onDeleteAll: () => void;
    onUpdate: () => void;
};

export default function LexiconList({ data, onToggle, onDelete, onDeleteAll, onUpdate }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Lexique</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={onDeleteAll}>
                    <MaterialCommunityIcons name="delete-empty" size={18} color="#e53935" />
                    <Text style={styles.deleteButtonText}>Supprimer tout</Text>
                </TouchableOpacity>
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
        padding: 12,
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