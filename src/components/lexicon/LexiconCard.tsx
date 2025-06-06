import React from "react";
import { View, Text, Switch, Pressable, StyleSheet } from "react-native";

type Props = {
    fr: string;
    ko: string;
    phonetic?: string | null;
    tags?: string | null;
    difficulty: "easy" | "medium" | "hard";
    active: number;
    onToggle: () => void;
    onDelete: () => void;
};

export default function LexiconCard({
    fr,
    ko,
    phonetic,
    tags,
    difficulty,
    active,
    onToggle,
    onDelete,
}: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.texts}>
                    <Text style={[styles.fr, { color: difficultyColor(difficulty) }]}>
                        🇫🇷 {fr}
                    </Text>
                    <Text style={styles.ko}>
                        🇰🇷 {ko}
                        {phonetic ? (
                            <Text style={styles.phoneticInline}> ({phonetic})</Text>
                        ) : null}
                    </Text>
                    {tags && (
                        <View style={styles.tagsContainer}>
                            <Text style={styles.tagsLabel}>Mots-clés :</Text>
                            <View style={styles.tagsRow}>
                                {tags.split(",").map((tag) => (
                                    <View key={tag.trim()} style={styles.tag}>
                                        <Text style={styles.tagText}>{tag.trim()}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
                <View style={styles.actions}>
                    <Switch value={active === 1} onValueChange={onToggle} />
                    <Pressable onPress={onDelete}>
                        <Text style={styles.delete}>🗑️</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

function difficultyColor(difficulty: string) {
    switch (difficulty) {
        case "easy":
            return "green";
        case "medium":
            return "orange";
        case "hard":
            return "red";
        default:
            return "black";
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    texts: {
        flex: 1,
        gap: 4,
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    fr: {
        fontSize: 16,
        fontWeight: "bold",
    },
    ko: {
        fontSize: 16,
    },
    phoneticInline: {
        fontSize: 13,
        color: "#888",
        fontStyle: "italic",
    },
    tagsContainer: {
        marginTop: 6,
    },
    tagsLabel: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#444",
        marginBottom: 4,
    },
    tagsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    tag: {
        backgroundColor: "#e0e0ff",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    tagText: {
        fontSize: 12,
        color: "#333",
    },
    delete: {
        fontSize: 20,
    },
});