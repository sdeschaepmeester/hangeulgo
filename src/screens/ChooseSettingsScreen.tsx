import React, { useState, useEffect, JSX } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import type { Difficulty } from "@/types/Difficulty";
import type { GameSettings, InputMode } from "@/types/GameSettings";
import SelectPill from "@/components/SelectPill";
import Storage from "expo-sqlite/kv-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import IconCardSelectMultiple from "@/components/IconCardSelectMultiple";

const difficultyOptions: { label: string; value: Difficulty; icon: JSX.Element }[] = [
  {
    label: "Facile",
    value: "easy",
    icon: <MaterialCommunityIcons name="emoticon-happy" size={32} color="green" />,
  },
  {
    label: "Moyen",
    value: "medium",
    icon: <MaterialCommunityIcons name="emoticon-neutral" size={32} color="orange" />,
  },
  {
    label: "Difficile",
    value: "hard",
    icon: <MaterialCommunityIcons name="emoticon-sad" size={32} color="red" />,
  },
];

const lengths: { label: string; value: string }[] = [
  { label: "Court", value: "10" },
  { label: "Normal", value: "20" },
  { label: "Long", value: "30" },
  { label: "Sans fin", value: "unlimited" },
];

const modes = [
  { label: "QCM", value: "multiple", color: "#9da7ff" },
  { label: "Saisie", value: "input", color: "#9da7ff" },
];

type Props = NativeStackScreenProps<RootStackParamList, "ChooseSettings">;

export default function ChooseSettingsScreen({ route, navigation }: Props) {
  const { type } = route.params;
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [length, setLength] = useState<number | "unlimited">(10);
  const [inputMode, setInputMode] = useState<InputMode>("multiple");
  const [rememberSettings, setRememberSettings] = useState(false);

  useEffect(() => {
    Storage.getItem("gameSettings").then((data) => {
      if (!data) return;
      const parsed = JSON.parse(data);
      setSelectedDifficulties(parsed.difficulties);
      setLength(parsed.length);
      if (parsed.inputMode) setInputMode(parsed.inputMode);
      setRememberSettings(true);
    });
  }, []);

  const startGame = () => {
    const settings: GameSettings = {
      type,
      difficulties: selectedDifficulties,
      length,
      ...(type === "translation" && { inputMode }),
    };
    if (rememberSettings) {
      Storage.setItem(
        "gameSettings",
        JSON.stringify({ difficulties: selectedDifficulties, length, inputMode })
      );
    }
    navigation.navigate("Quiz", { settings });
  };

  const isDisabled = selectedDifficulties.length === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres du jeu</Text>

      <Text style={styles.label}>Difficulté des mots</Text>
      <IconCardSelectMultiple<Difficulty>
        options={difficultyOptions}
        selectedValues={selectedDifficulties}
        onToggle={(val) =>
          setSelectedDifficulties((prev) =>
            prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val]
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
        selectedValue={String(length)}
        onSelect={(val) => setLength(val === "unlimited" ? "unlimited" : parseInt(val as string))}
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

      <View style={styles.checkboxRow}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setRememberSettings((prev) => !prev)}
        >
          <View style={[styles.box, rememberSettings && styles.boxChecked]} />
          <Text style={styles.checkboxLabel}>Conserver les réglages</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isDisabled && styles.disabledButton]}
        onPress={startGame}
        disabled={isDisabled}
      >
        <Text style={styles.buttonText}>🚀 Démarrer</Text>
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
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#999",
    marginRight: 8,
  },
  boxChecked: {
    backgroundColor: "#9da7ff",
  },
  checkboxLabel: {
    fontSize: 14,
  },
  button: {
    backgroundColor: "#6c74ff",
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});