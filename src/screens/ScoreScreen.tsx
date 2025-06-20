import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { getScores, clearScores, type SavedScore } from "@/services/score";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MaterialIcons } from "@expo/vector-icons";
import AlertCustom from "@/components/AlertCustom";
import IconButton from "@/components/IconButton";
import NavBar from "@/components/NavBar";

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

    const getLabel = (item: SavedScore) => {
        switch (item.type) {
            case "comprehension":
                return `Compréhension – ${item.subType === "frToKo" ? "🇫🇷 → 🇰🇷" : "🇰🇷 → 🇫🇷"}`;
            case "ecoute":
                return `Écoute – ${item.subType === "koToKo" ? "🇰🇷 → 🇰🇷" : "🇰🇷 → 🇫🇷"}`;
            case "arrangement":
                return "Puzzle";
            case "ecriture":
                return "Écriture – 🇫🇷 → 🇰🇷";
            case "translation":
                return "Traduction – 🇫🇷 → 🇰🇷";
            default:
                return "Quiz";
        }
    };

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
                    <Text style={styles.info}>{getLabel(item)}</Text>
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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.container}>
                {/* ----------- Header ----------- */}
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

                {/*----------- Score list -----------*/}
                {scores.length === 0 ? (
                    <Text style={styles.empty}>Aucun score enregistré.</Text>
                ) : (
                    <FlatList
                        data={scores}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                    />
                )}

                <NavBar />

                {/* ----------- Modale confirmation -----------*/}
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
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 18,
    },
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
    list: {
        paddingBottom: 82,
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
