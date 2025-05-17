import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { dbPromise } from "@/db/database";
import type { Difficulty } from "@/types/Difficulty";
import SelectPill from "@/components/SelectPill";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import AlertCustom from "@/components/AlertCustom";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import NavBar from "@/components/NavBar";

const difficulties = [
  { label: "Facile", value: "easy", color: "green" },
  { label: "Moyen", value: "medium", color: "orange" },
  { label: "Difficile", value: "hard", color: "red" },
];

export default function AddWordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fr, setFr] = useState("");
  const [ko, setKo] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [showSuccess, setShowSuccess] = useState(false);
  const [tags, setTags] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const phoneticRef = useRef<TextInput>(null);
  const koRef = useRef<TextInput>(null);

  const isValid = fr.trim() && ko.trim();

  useEffect(() => {
    const fetchTags = async () => {
      const db = await dbPromise;
      const rows = await db.getAllAsync<{ tag: string }>(
        `SELECT DISTINCT tag FROM lexicon_tags`
      );
      setAllTags(rows.map(r => r.tag));
    };
    fetchTags();
  }, []);

  const handleTagChange = (text: string) => {
    setTags(text);
    const lastPart = text.split(",").pop()?.trim().toLowerCase() ?? "";
    if (lastPart.length >= 2) {
      const matching = allTags.filter((tag) => tag.toLowerCase().startsWith(lastPart));
      setSuggestions(matching);
    } else {
      setSuggestions([]);
    }
  };

  const applySuggestion = (tag: string) => {
    const parts = tags.split(",").map((t) => t.trim());
    parts[parts.length - 1] = tag;
    setTags(parts.join(", ") + ", ");
    setSuggestions([]);
  };

  const onSubmit = async () => {
    if (!isValid) return;
    const db = await dbPromise;
    await db.runAsync(
      `INSERT INTO lexicon (fr, ko, phonetic, difficulty, active) VALUES (?, ?, ?, ?, ?)`,
      fr.trim(),
      ko.trim(),
      phonetic.trim(),
      difficulty,
      1
    );
    const lastInsert = await db.getFirstAsync<{ id: number }>(`SELECT last_insert_rowid() as id`);
    const cleanTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (lastInsert?.id) {
      for (const tag of cleanTags) {
        await db.runAsync(`INSERT INTO lexicon_tags (lexicon_id, tag) VALUES (?, ?)`, [lastInsert.id, tag]);
      }
    }
    setShowSuccess(true);
    setFr("");
    setKo("");
    setPhonetic("");
    setDifficulty("easy");
    setTags("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Ajouter du vocabulaire</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <MaterialIcons name="close" size={28} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>🇫🇷 Français</Text>
          <TextInput
            value={fr}
            onChangeText={setFr}
            style={styles.input}
            placeholderTextColor="#000"
            placeholder="Ex : Bonjour"
            returnKeyType="next"
            onSubmitEditing={() => phoneticRef.current?.focus()}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phonétique</Text>
          <TextInput
            ref={phoneticRef}
            value={phonetic}
            onChangeText={setPhonetic}
            style={styles.input}
            placeholderTextColor="#000"
            placeholder="Ex : annyeonghaseyo"
            returnKeyType="next"
            onSubmitEditing={() => koRef.current?.focus()}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>🇰🇷 Coréen</Text>
          <TextInput
            ref={koRef}
            value={ko}
            onChangeText={setKo}
            style={styles.input}
            placeholderTextColor="#000"
            placeholder="Ex : 안녕하세요"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>

        <Text style={styles.label}>Mots-clés</Text>
        <TextInput
          value={tags}
          onChangeText={handleTagChange}
          style={styles.input}
          placeholderTextColor="#000"
          placeholder="Ex : nourriture, salutations"
        />

        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((tag) => (
              <TouchableOpacity key={tag} onPress={() => applySuggestion(tag)}>
                <Text style={styles.suggestion}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.label, { marginTop: 16 }]}>Difficulté</Text>
        <SelectPill
          options={difficulties}
          selectedValue={difficulty}
          onSelect={(val) => setDifficulty(val as Difficulty)}
        />

        <TouchableOpacity
          style={[styles.fullButton, !isValid && styles.disabled]}
          onPress={onSubmit}
          disabled={!isValid}
        >
          <Text style={styles.fullButtonText}>Ajouter au lexique</Text>
        </TouchableOpacity>
      </View>

      <Image source={require("../../assets/dictionary.png")} style={styles.dictionary} />

      <AlertCustom
        visible={showSuccess}
        icon={<MaterialCommunityIcons name="check-circle" size={30} color="#4caf50" />}
        iconColor="#4caf50"
        title="Ajouté !"
        description="Le mot a été ajouté au lexique."
        onClose={() => setShowSuccess(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, gap: 12, paddingTop: 50 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "bold" },
  form: { gap: 16, marginTop: 4 },
  field: { gap: 6 },
  label: { fontWeight: "bold", fontSize: 14 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 14, fontSize: 16 },
  fullButton: { marginTop: 28, backgroundColor: "#9da7ff", paddingVertical: 16, borderRadius: 8 },
  fullButtonText: { textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16 },
  disabled: { opacity: 0.4 },
  dictionary: { width: 120, height: 120, alignSelf: "center", marginTop: 24, opacity: 0.9 },
  suggestionsContainer: { backgroundColor: "#f1f1ff", borderRadius: 8, padding: 8, marginTop: -8 },
  suggestion: { padding: 6, fontSize: 14, color: "#333" },
});
