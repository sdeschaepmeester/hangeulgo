import React, { useEffect } from "react";
import SelectPill from "@/components/SelectPill";
import type { GameSubType } from "@/types/GameSettings";
import i18n from "@/i18n";
import colors from "@/constants/colors";

type Props = {
    available: GameSubType[];
    selected: GameSubType | null;
    onChange: (subType: GameSubType) => void;
};

export default function StepType({ available, selected, onChange }: Props) {

    const labelMap: Record<GameSubType, string> = {
        nativeToKo: `${i18n.t("flag")}\u00A0→\u00A0🇰🇷`,
        koToNative: `🇰🇷\u00A0→\u00A0${i18n.t("flag")}`,
        koToKo: "🇰🇷",
        order: i18n.t("quiz.putInOrder"),
    };

    // Preselect the first available option if none is selected
    useEffect(() => {
        if (!selected && available.length > 0) {
            onChange(available[0]);
        }
    }, [available, selected]);

    const options = available.map((value) => ({
        label: labelMap[value],
        value,
        color: colors.primary.main,
    }));

    return (
        <>
            <SelectPill
                options={options}
                selectedValue={selected ?? ""}
                onSelect={(val) => onChange(val as GameSubType)}
            />
        </>
    );
}