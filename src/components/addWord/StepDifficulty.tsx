import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SelectPill from "@/components/SelectPill";
import { Difficulty } from "@/types/Difficulty";
import i18n from "@/i18n";
import colors from "@/constants/colors";

type Props = {
    data: {
        difficulty: Difficulty;
    };
    setData: React.Dispatch<React.SetStateAction<any>>;
};

const difficulties = [
    { label: i18n.t("difficulties.easy"), value: "easy", color: "green" },
    { label: i18n.t("difficulties.medium"), value: "medium", color: "orange" },
    { label: i18n.t("difficulties.hard"), value: "hard", color: "red" },
];

export default function StepDifficulty({ data, setData }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{i18n.t("addWord.difficulty")}</Text>
            <SelectPill
                options={difficulties}
                selectedValue={data.difficulty}
                onSelect={(val) =>
                    setData((prev: any) => ({ ...prev, difficulty: val as Difficulty }))
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    label: {
        fontWeight: "bold",
        fontSize: 14,
        color: colors.text.primary,
    },
});