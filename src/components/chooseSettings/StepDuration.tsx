import React from "react";
import { Text, StyleSheet } from "react-native";
import SelectPill from "@/components/SelectPill";
import i18n from "@/i18n";

type Props = {
    selected: number;
    onSelect: (val: number) => void;
};

const options = [
    { label: i18n.t("duration.short"), value: 10, color: "#4caf50" },
    { label: i18n.t("duration.medium"), value: 20, color: "#ff9800" },
    { label: i18n.t("duration.long"), value: 30, color: "#f44336" },
];

export default function StepDuration({ selected, onSelect }: Props) {
    return (
        <>
            <Text style={styles.label}>{i18n.t("quiz.duration")}</Text>
            <SelectPill
                options={options}
                selectedValue={selected}
                onSelect={(val) => onSelect(typeof val === "string" ? parseInt(val) : val)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        fontWeight: "bold",
        color: "grey",
        fontSize: 24
    },
});
