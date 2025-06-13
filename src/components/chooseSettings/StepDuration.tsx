import React from "react";
import { Text, StyleSheet } from "react-native";
import SelectPill from "@/components/SelectPill";

type Props = {
    selected: number;
    onSelect: (val: number) => void;
};

const options = [
    { label: "Court", value: 10, color: "#4caf50" },
    { label: "Normal", value: 20, color: "#ff9800" },
    { label: "Long", value: 30, color: "#f44336" },
];

export default function StepDuration({ selected, onSelect }: Props) {
    return (
        <>
            <Text style={styles.label}>Durée de jeu</Text>
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
