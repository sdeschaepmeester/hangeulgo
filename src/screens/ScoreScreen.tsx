import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { getScores, clearScores, type SavedScore } from "@/services/score";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MaterialIcons } from "@expo/vector-icons";
import AlertCustom from "@/components/AlertCustom";
import IconButton from "@/components/IconButton";
import MainLayout from "@/layouts/MainLayout";

export default function ScoreScreen() {
    const [scores, setScores] = useState<SavedScore[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);

    const load = async () => {
        const data = await getScores();
        setScores(data);
    };

    const handleClear = async () => {
        await clearScores();
        setScores([]);
        setShowConfirm(false);
    };

    useEffect(() => {
        load();
    }, []);

    const getMedal = (percent: number) => {
        if (percent === 0) return require("../../assets/terrible.png");
        if (percent >= 80) return require("../../assets/gold_medal.png");
        if (percent >= 60) return require("../../assets/silver_medal.png");
        return require("../../assets/bronze_medal.png");
    };

    const renderItem = ({ item }: { item: SavedScore }) => {
        const percent = Math.round((item.score / item.total) * 100);
        return (
            <View style={styles.card}>
                <Image source={getMedal(percent)} style={styles.medal} />
                <View style={styles.details}>
                    <Text style={styles.percent}>{percent}%</Text>
                    <Text style={styles.info}>{item.score} / {item.total}</Text>
                    <Text style={styles.info}>{item.type}</Text>
                    <Text style={styles.date}>
                        {formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: fr })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <MainLayout scrollable={false}>
            {/* -------- Header fixed -------- */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>Historique des scores</Text>
                {scores.length > 0 && (
                    <IconButton
                        label="Tout effacer"
                        icon="delete"
                        onPress={() => setShowConfirm(true)}
                        backgroundColor="#fcebea"
                        color="#e53935"
                    />
                )}
            </View>

            {/* -------- List scrollable -------- */}
            {scores.length === 0 ? (
                <Text style={styles.empty}>Aucun score enregistré.</Text>
            ) : (
                <FlatList
                    data={scores}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* -------- Confirmation modale -------- */}
            <AlertCustom
                visible={showConfirm}
                title="Réinitialiser les scores"
                description="Tous les scores vont être supprimés. Cette action est irréversible."
                onClose={() => setShowConfirm(false)}
                confirmText="Confirmer"
                cancelText="Annuler"
                onConfirm={handleClear}
                icon={<MaterialIcons name="delete-forever" size={30} color="#e53935" />}
                iconColor="#e53935"
            />
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    listContainer: {
        paddingBottom: 24,
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
        borderWidth: 1,
        borderColor: "#e0e0e0",
        overflow: "hidden",
    },
    medal: {
        width: 48,
        height: 48,
        marginRight: 12,
        resizeMode: "contain",
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
