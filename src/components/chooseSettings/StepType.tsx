import React from "react";
import { Text, StyleSheet } from "react-native";
import SelectPill from "@/components/SelectPill";
import type { InputMode } from "@/types/GameSettings";

const modes = [
    { label: "QCM", value: "multiple", color: "#9da7ff" },
    { label: "Saisie", value: "input", color: "#9da7ff" },
];

type Props = {
    inputMode: InputMode;
    onChange: (mode: InputMode) => void;
};

export default function StepType({ inputMode, onChange }: Props) {
    return (
        <>
            <Text style={styles.label}>Mode de réponse</Text>
            <SelectPill
                options={modes}
                selectedValue={inputMode}
                onSelect={(val) => onChange(val as InputMode)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        fontWeight: "bold",
        color: "grey",
        fontSize: 24,
        marginBottom: 12,
    },
});