import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { getScores, clearScores, type SavedScore } from "@/services/score";
import { formatDistanceToNow } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { MaterialIcons } from "@expo/vector-icons";
import AlertCustom from "@/components/AlertCustom";
import IconButton from "@/components/IconButton";
import MainLayout from "@/layouts/MainLayout";
import i18n from "@/i18n";
import { getQuizTypeLabel } from "@/services/quiz";
import colors from "@/constants/colors";

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

    const getLocale = () => {
        return i18n.locale === "fr" ? fr : enUS;
    };

    const renderItem = ({ item }: { item: SavedScore }) => {
        const percent = Math.round((item.score / item.total) * 100);
        return (
            <View style={styles.card}>
                <Image source={getMedal(percent)} style={styles.medal} />
                <View style={styles.details}>
                    <Text style={styles.percent}>{percent}%</Text>
                    <Text style={styles.info}>{item.score} / {item.total}</Text>
                    <Text style={styles.info}>{getQuizTypeLabel(item.type)}</Text>
                    <Text style={styles.date}>
                        {formatDistanceToNow(new Date(item.date), {
                            addSuffix: true,
                            locale: getLocale(),
                        })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <MainLayout scrollable={false}>
            {/* -------- Header fixed -------- */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>{i18n.t("scores.title")}</Text>
                {scores.length > 0 && (
                    <IconButton
                        label={i18n.t("actions.deleteAll")}
                        icon="delete"
                        onPress={() => setShowConfirm(true)}
                        backgroundColor={colors.danger.lightest}
                        color={colors.danger.light}
                    />
                )}
            </View>

            {/* -------- List scrollable -------- */}
            {scores.length === 0 ? (
                <Text style={styles.empty}>{i18n.t("scores.noScore")}</Text>
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
                title={i18n.t("modaleDelete.confirmDeletionScoreTitle")}
                description={i18n.t("modaleDelete.confirmDeletionScoreText")}
                onClose={() => setShowConfirm(false)}
                confirmText={i18n.t("actions.confirm")}
                cancelText={i18n.t("actions.cancel")}
                onConfirm={handleClear}
                icon={<MaterialIcons name="delete-forever" size={30} color={colors.danger.main} />}
                iconColor={colors.danger.main}
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
        color: colors.neutral.darker,
    },
    listContainer: {
        paddingBottom: 24,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.neutral.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: colors.neutral.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: colors.neutral.light,
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
        color: colors.neutral.dark,
    },
    date: {
        color: colors.neutral.main,
        fontSize: 12,
        marginTop: 4,
    },
    empty: {
        marginTop: 60,
        textAlign: "center",
        color: colors.neutral.main,
        fontSize: 16,
    },
});
