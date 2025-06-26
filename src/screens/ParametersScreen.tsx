import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MainLayout from "@/layouts/MainLayout";
import TesterDaysTestBigCard from "@/components/test/TesterDaysTestBigCard";
import colors from "@/constants/colors";
import { isSoundEnabled, setSoundEnabled } from "@/services/sound";
import { playSoundIfEnabled } from "@/services/sound";
import i18n from "@/i18n";

export default function ParametersScreen() {
    const [soundEnabled, setSound] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        isSoundEnabled().then(setSound);
    }, []);

    const toggleSound = async () => {
        setLoading(true);
        const newValue = !soundEnabled;
        setSound(newValue);
        await setSoundEnabled(newValue);
        if (newValue) {
            await playSoundIfEnabled(require("../../assets/sounds/correct.mp3"));
        }
        setLoading(false);
    };

    return (
        <MainLayout style={{ backgroundColor: colors.primary.light }}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Number of days testing */}
                <TesterDaysTestBigCard />
                {/* Manage sound effects */}
                <TouchableOpacity style={styles.soundToggle} onPress={toggleSound} disabled={loading}>
                    <MaterialCommunityIcons
                        name={soundEnabled ? "volume-high" : "volume-mute"}
                        size={28}
                        color={colors.neutral.darker}
                    />
                    <Text style={styles.soundText}>
                        {soundEnabled ? i18n.t("soundActivated") : i18n.t("soundInactivated")}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 20,
        alignItems: "center",
        gap: 24,
    },
    soundToggle: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: "80%"
    },
    soundText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.neutral.darker,
    },
});
