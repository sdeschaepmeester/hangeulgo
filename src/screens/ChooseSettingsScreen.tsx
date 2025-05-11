import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import type { Difficulty } from "@/types/Difficulty";
import type { GameSettings, InputMode } from "@/types/GameSettings";
import SelectPill from "@/components/SelectPill";
import SelectPillMultiple from "@/components/SelectPillMultiple";

const difficulties: { label: string; value: Difficulty; color: string }[] = [
  { label: "Facile", value: "easy", color: "green" },
  { label: "Moyen", value: "medium", color: "orange" },
  { label: "Difficile", value: "hard", color: "red" },
];

const lengths = [
  { label: "Court", value: 10 },
  { label: "Normal", value: 20 },
  { label: "Long", value: 30 },
  { label: "Sans fin", value: "unlimited" },
];

const modes = [
  { label: "QCM", value: "multiple", color: "#9da7ff" },
  { label: "Saisie", value: "input", color: "#9da7ff" },
];

type Props = NativeStackScreenProps<RootStackParamList, "ChooseSettings">;

export default function ChooseSettingsScreen({ route, navigation }: Props) {
  const { type } = route.params;
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>(["easy"]);
  const [length, setLength] = useState<number | "unlimited">(10);
  const [inputMode, setInputMode] = useState<InputMode>("multiple");

  const startGame = () => {
    const settings: GameSettings = {
      type,
      difficulties: selectedDifficulties,
      length,
      ...(type === "translation" && { inputMode }),
    };
    navigation.navigate("Quiz", { settings });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres du jeu</Text>

      <Text style={styles.label}>Difficulté des mots</Text>
      <SelectPillMultiple
        options={difficulties}
        selectedValues={selectedDifficulties}
        onToggle={(val) =>
          setSelectedDifficulties((prev) =>
            prev.includes(val)
              ? prev.filter((d) => d !== val)
              : [...prev, val]
          )
        }
      />

      <Text style={styles.label}>Durée de jeu</Text>
      <SelectPill
        options={lengths.map((l) => ({
          label: l.label,
          value: l.value,
          color: "#ccc",
        }))}
        selectedValue={length}
        onSelect={(val) => setLength(val as number | "unlimited")}
      />

      {type === "translation" && (
        <>
          <Text style={styles.label}>Mode de réponse</Text>
          <SelectPill
            options={modes}
            selectedValue={inputMode}
            onSelect={(val) => setInputMode(val as InputMode)}
          />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={startGame}>
        <Text style={styles.buttonText}>Démarrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#9da7ff",
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 24,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});