import React, { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import SelectPill from "@/components/SelectPill";
import type { GameSubType } from "@/types/GameSettings";
import i18n from "@/i18n";

type Props = {
    available: GameSubType[];
    selected: GameSubType | null;
    onChange: (subType: GameSubType) => void;
};

const labelMap: Record<GameSubType, string> = {
    nativeToKo: `${i18n.t("flag")}\u00A0→\u00A0🇰🇷`,
    koToNative: `🇰🇷\u00A0→\u00A0${i18n.t("flag")}`,
    koToKo: "🇰🇷",
    order: i18n.t("quiz.putInOrder"),
};

export default function StepType({ available, selected, onChange }: Props) {
    // Preselect the first available option if none is selected
    useEffect(() => {
        if (!selected && available.length > 0) {
            onChange(available[0]);
        }
    }, [available, selected]);

    const options = available.map((value) => ({
        label: labelMap[value],
        value,
        color: "#9da7ff",
    }));

    return (
        <>
            <Text style={styles.label}>{i18n.t("quiz.whichOrder")}</Text>
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