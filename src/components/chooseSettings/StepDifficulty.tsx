import React from "react";
import { StyleSheet, Text } from "react-native";
import IconCardSelectMultiple from "@/components/IconCardSelectMultiple";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Difficulty } from "@/types/Difficulty";

const difficultyOptions = [
    {
        label: "Facile",
        value: "easy" as Difficulty,
        icon: <MaterialCommunityIcons name="emoticon-happy" size={32} color="green" />,
    },
    {
        label: "Moyen",
        value: "medium" as Difficulty,
        icon: <MaterialCommunityIcons name="emoticon-neutral" size={32} color="orange" />,
    },
    {
        label: "Difficile",
        value: "hard" as Difficulty,
        icon: <MaterialCommunityIcons name="emoticon-sad" size={32} color="red" />,
    },
];

type Props = {
    selected: Difficulty[];
    onChange: (difficulties: Difficulty[]) => void;
};

export default function StepDifficulty({ selected, onChange }: Props) {
    return (
        <>
            <Text style={styles.label}>Difficulté des questions</Text>
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