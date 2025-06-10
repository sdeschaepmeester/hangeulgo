import React, { useState, useEffect, JSX } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import type { Difficulty } from "@/types/Difficulty";
import type { GameSettings, InputMode } from "@/types/GameSettings";
import SelectPill from "@/components/SelectPill";
import Storage from "expo-sqlite/kv-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import IconCardSelectMultiple from "@/components/IconCardSelectMultiple";
import { getAllUniqueTags } from "@/services/tags";

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

const lengths = [
  { label: "Court", value: "10", color: "#b3b3ff" },
  { label: "Normal", value: "20", color: "#b3b3ff" },
  { label: "Long", value: "30", color: "#b3b3ff" },
  { label: "Sans fin", value: "unlimited", color: "#b3b3ff" },
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
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);

  useEffect(() => {
    getAllUniqueTags().then(setAllTags);
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
      ...(selectedTags.length > 0 && { tags: selectedTags }),
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
      <Text style={styles.title}>Choix du mode de jeu</Text>

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
        options={lengths}
        selectedValue={String(length)}
        onSelect={(val) => setLength(val === "unlimited" ? "unlimited" : parseInt(val.toString()))}
      />

      {allTags.length > 0 && (
        <>
          <Text style={styles.label}>Types de mots</Text>
          <TouchableOpacity
            onPress={() => setShowTags((prev) => !prev)}
            style={[styles.tagItem, { flexDirection: "row", justifyContent: "space-between" }]}
          >
            <Text style={{ color: "#333" }}>
              {selectedTags.length > 0 ? selectedTags.join(", ") : "Aucun mot clé sélectionné"}
            </Text>
            <MaterialCommunityIcons name={showTags ? "chevron-up" : "chevron-down"} size={20} />
          </TouchableOpacity>

          {showTags && (
            <View style={{ gap: 6, marginTop: 8 }}>
              {allTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagItem,
                    selectedTags.includes(tag) && styles.tagItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                >
                  <Text style={{ color: selectedTags.includes(tag) ? "white" : "#333" }}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}

      {/* ----------------- Choose settings Traduction game specific ----------------- */}
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
        style={[styles.fullButton, isDisabled && styles.disabled]}
        onPress={startGame}
        disabled={isDisabled}
      >
        <Text style={styles.fullButtonText}>🎮 Commencer la partie 🎮</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
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
  fullButton: {
    marginTop: 28,
    backgroundColor: "#9da7ff",
    paddingVertical: 16,
    borderRadius: 8,
  },
  fullButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.4,
  },
  tagItem: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tagItemSelected: {
    backgroundColor: "#9da7ff",
    borderColor: "#9da7ff",
  }
});
