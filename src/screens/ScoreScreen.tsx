import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, } from "react-native";
import { getScores, clearScores, type SavedScore } from "@/services/score";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MaterialIcons } from "@expo/vector-icons";
import AlertCustom from "@/components/AlertCustom";

export default function ScoreScreen() {
    const [scores, setScores] = useState<SavedScore[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);

    const load = async () => {
        const data = await getScores();
        setScores(data);
    };

    // Delete scores history
    const handleClear = async () => {
        await clearScores();
        setScores([]);
        setShowConfirm(false);
    };

    // Load scores
    useEffect(() => {
        load();
    }, []);

    // Get medal image based on score percentage
    const getMedal = (percent: number) => {
        if (percent === 0) return require("../../assets/terrible.png");
        if (percent >= 80) return require("../../assets/gold_medal.png");
        if (percent >= 60) return require("../../assets/silver_medal.png");
        return require("../../assets/bronze_medal.png");
    };

    // Render one score card
    const renderItem = ({ item }: { item: SavedScore }) => {
        const percent = Math.round((item.score / item.total) * 100);
        return (
            <View style={styles.card}>
                <Image source={getMedal(percent)} style={styles.medal} />
                <View style={styles.details}>
                    <Text style={styles.percent}>{percent}%</Text>
                    <Text style={styles.info}>
                        {item.score} / {item.total}
                    </Text>
                    <Text style={styles.info}>
                        {item.type === "translation" ? "Traduction" : "Compréhension"} —{" "}
                        {item.inputMode === "input" ? "Saisie" : "QCM"}
                    </Text>
                    <Text style={styles.date}>
                        {formatDistanceToNow(new Date(item.date), {
                            addSuffix: true,
                            locale: fr,
                        })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* -------- Header with delete button -------- */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>Historique des scores</Text>
                {scores.length > 0 && (
                    <TouchableOpacity onPress={() => setShowConfirm(true)}>
                        <MaterialIcons name="delete" size={24} color="#ff4d4d" />
                    </TouchableOpacity>
                )}
            </View>

            {/* -------- List of scores -------- */}
            {scores.length === 0 ? (
                <Text style={styles.empty}>Aucun score enregistré.</Text>
            ) : (
                <FlatList
                    data={scores}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}

            {/* -------- Confirm delete modal -------- */}
            <AlertCustom
                visible={showConfirm}
                title="Réinitialiser les scores"
                description="Tous les scores vont être supprimés. Cette action est irréversible."
                onClose={() => setShowConfirm(false)}
                confirmText="Confirmer"
                cancelText="Annuler"
                onConfirm={handleClear}
                icon={
                    <MaterialIcons name="delete-forever" size={30} color="#e53935" />
                }
                iconColor="#e53935"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f9f9f9",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    medal: {
        width: 48,
        height: 48,
        marginRight: 12,
    },
    details: {
        flex: 1,
    },
    percent: {
        fontSize: 18,
        fontWeight: "bold",
    },
    info: {
        color: "#555",
    },
    date: {
        color: "#999",
        fontSize: 12,
        marginTop: 4,
    },
    empty: {
        marginTop: 60,
        textAlign: "center",
        color: "#999",
        fontSize: 16,
    },
});
