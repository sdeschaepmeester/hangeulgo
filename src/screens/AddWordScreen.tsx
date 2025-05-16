import React, { useState, useRef } from "react";
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
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
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

  const phoneticRef = useRef<TextInput>(null);
  const koRef = useRef<TextInput>(null);

  const isValid = fr.trim() && ko.trim();

  const onSubmit = async () => {
    console.log('coucou')
    console.log(isValid)
    if (!isValid) return;
        console.log("ca marche ?")
    const db = await dbPromise;
    await db.runAsync(
      `INSERT INTO lexicon (fr, ko, phonetic, difficulty, active, tags) VALUES (?, ?, ?, ?, ?, ?)`,
      fr.trim(),
      ko.trim(),
      phonetic.trim(),
      difficulty,
      1,
      tags.trim()
    );
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
          <View style={styles.labelRow}>
            <Text style={styles.label}>🇫🇷 Français</Text>
          </View>
          <TextInput
            value={fr}
            onChangeText={setFr}
            style={styles.input}
            placeholder="Ex : Bonjour"
            returnKeyType="next"
            onSubmitEditing={() => phoneticRef.current?.focus()}
          />
        </View>

        <View style={styles.field}>
          <View style={styles.labelRow}>
            <MaterialCommunityIcons name="alphabetical" size={20} color="#333" style={styles.labelIcon} />
            <Text style={styles.label}>Phonétique</Text>
          </View>
          <TextInput
            ref={phoneticRef}
            value={phonetic}
            onChangeText={setPhonetic}
            style={styles.input}
            placeholder="Ex : annyeonghaseyo"
            returnKeyType="next"
            onSubmitEditing={() => koRef.current?.focus()}
          />
        </View>

        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>🇰🇷 Coréen</Text>
          </View>
          <TextInput
            ref={koRef}
            value={ko}
            onChangeText={setKo}
            style={styles.input}
            placeholder="Ex : 안녕하세요"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>

        <Text style={styles.label}>Mots-clés</Text>
        <TextInput
          value={tags}
          onChangeText={setTags}
          style={styles.input}
          placeholder="Ex : nourriture, salutations"
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Difficulté d’apprentissage</Text>
        <SelectPill
          options={difficulties}
          selectedValue={difficulty}
          onSelect={(value) => setDifficulty(value as Difficulty)}
        />

        <TouchableOpacity
          style={[styles.fullButton, !isValid && styles.disabled]}
          onPress={onSubmit}
          disabled={!isValid}
        >
          <Text style={styles.fullButtonText}>Ajouter au lexique</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require("../../assets/dictionary.png")}
        style={styles.dictionary}
      />

      <AlertCustom
        visible={showSuccess}
        icon={<MaterialCommunityIcons name="check-circle" size={30} color="#4caf50" />}
        iconColor="#4caf50"
        title="Ajouté !"
        description="Le mot a été ajouté au lexique."
        onClose={() => setShowSuccess(false)}
      />
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    gap: 12,
    paddingTop: 50
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  form: {
    gap: 16,
    marginTop: 4,
  },
  field: {
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelIcon: {
    marginRight: 4,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
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
  dictionary: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginTop: 24,
    opacity: 0.9,
  }
});
