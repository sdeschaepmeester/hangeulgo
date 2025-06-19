import React from "react";
import { Text, StyleSheet } from "react-native";
import SelectPill from "@/components/SelectPill";
import type { GameSubType } from "@/types/GameSettings";

type Props = {
    available: GameSubType[];
    selected: GameSubType | null;
    onChange: (subType: GameSubType) => void;
};

const labelMap: Record<GameSubType, string> = {
    frToKo: "🇫🇷\u00A0→\u00A0🇰🇷",
    koToFr: "🇰🇷\u00A0→\u00A0🇫🇷",
    koToKo: "🇰🇷",
    order: "Remettre en ordre",
};

export default function StepType({ available, selected, onChange }: Props) {
    const options = available.map((value) => ({
        label: labelMap[value],
        value,
        color: "#9da7ff",
    }));

    return (
        <>
            <Text style={styles.label}>Dans quel sens ?</Text>
            <SelectPill
                options={options}
                selectedValue={selected ?? ""}
                onSelect={(val) => onChange(val as GameSubType)}
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
