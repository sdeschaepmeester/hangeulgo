import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { dbPromise } from "@/db/database";
import type { Difficulty } from "@/types/Difficulty";
import SelectPill from "@/components/SelectPill";

const difficulties = [
  { label: "Facile", value: "easy", color: "green" },
  { label: "Moyen", value: "medium", color: "orange" },
  { label: "Difficile", value: "hard", color: "red" },
];

export default function AddWordScreen() {
  const [fr, setFr] = useState("");
  const [ko, setKo] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const onSubmit = async () => {
    if (!fr.trim() || !ko.trim()) {
      Alert.alert("Champs requis", "Français et Coréen sont obligatoires.");
      return;
    }

    const db = await dbPromise;
    await db.runAsync(
      `INSERT INTO lexicon (fr, ko, phonetic, difficulty, active) VALUES (?, ?, ?, ?, ?)`,
      fr.trim(),
      ko.trim(),
      phonetic.trim(),
      difficulty,
      1
    );

    Alert.alert("Ajouté", "Le mot a été ajouté au lexique.");
    setFr("");
    setKo("");
    setPhonetic("");
    setDifficulty("easy");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Français</Text>
      <TextInput value={fr} onChangeText={setFr} style={styles.input} />

      <Text style={styles.label}>Phonétique</Text>
      <TextInput value={phonetic} onChangeText={setPhonetic} style={styles.input} />

      <Text style={styles.label}>Coréen</Text>
      <TextInput value={ko} onChangeText={setKo} style={styles.input} />

      <Text style={styles.label}>Difficulté</Text>
      <SelectPill
        options={difficulties}
        selectedValue={difficulty}
        onSelect={(value) => setDifficulty(value as Difficulty)}
      />

      <Button title="Ajouter au lexique" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
  },
});