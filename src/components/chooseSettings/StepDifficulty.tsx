import React, { useEffect, useRef } from "react";
import IconCardSelectMultiple from "@/components/IconCardSelectMultiple";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Difficulty } from "@/types/Difficulty";
import i18n from "@/i18n";

const difficultyOptions = [
    {
        label: i18n.t("difficulties.easy"),
        value: "easy" as Difficulty,
        icon: (
            <MaterialCommunityIcons
                name="emoticon-happy"
                size={32}
                color="green"
            />
        ),
    },
    {
        label: i18n.t("difficulties.medium"),
        value: "medium" as Difficulty,
        icon: (
            <MaterialCommunityIcons
                name="emoticon-neutral"
                size={32}
                color="orange"
            />
        ),
    },
    {
        label: i18n.t("difficulties.hard"),
        value: "hard" as Difficulty,
        icon: (
            <MaterialCommunityIcons
                name="emoticon-sad"
                size={32}
                color="red"
            />
        ),
    },
];

type Props = {
    selected: Difficulty[];
    onChange: (difficulties: Difficulty[]) => void;
    disabledDifficultyList?: Difficulty[];
};

export default function StepDifficulty({
    selected,
    onChange,
    disabledDifficultyList = [],
}: Props) {
    const didInit = useRef(false);

    useEffect(() => {
        if (!didInit.current && selected.length === 0) {
            const available = difficultyOptions
                .map((opt) => opt.value)
                .filter((d) => !disabledDifficultyList.includes(d));
            onChange(available);
            didInit.current = true;
        }
    }, []);

    return (
        <IconCardSelectMultiple<Difficulty>
            options={difficultyOptions}
            selectedValues={selected}
            onToggle={(val) =>
                onChange(
                    selected.includes(val)
                        ? selected.filter((d) => d !== val)
                        : [...selected, val]
                )
            }
            disabledValues={disabledDifficultyList}
        />
    );
}
