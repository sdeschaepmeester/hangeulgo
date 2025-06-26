import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { getDaysSinceInstall } from "@/services/tester";
import i18n from "@/i18n";
import colors from "@/constants/colors";

export default function TesterDaysTestBigCard() {
    const [days, setDays] = useState<number | null>(null);

    useEffect(() => {
        const fetch = async () => {
            const d = await getDaysSinceInstall();
            setDays(d);
        };
        fetch();
    }, []);

    if (days === null) return null;

    const hasReachedQuota = days >= 14;
    const textColor = hasReachedQuota ? colors.success : colors.warning;

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>
                {i18n.t("test.daysTesting")}
            </Text>
            <View style={styles.card}>
                <Text style={[styles.daysText, { color: textColor }]}>
                    {days} / 14
                </Text>
            </View>
            <Text style={styles.thankYou}>
                {i18n.t("test.thankYou")}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 12,
        width: "100%",
    },
    titleText: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 24,
        color: "#333",
    },
    thankYou: {
        fontSize: 18,
        color: "#333",
        marginTop: 32
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: "50%",
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    daysText: {
        fontSize: 36,
        fontWeight: "bold",
    },
});