import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { dbPromise } from "@/db/database";
import type { Difficulty } from "@/types/Difficulty";
import SelectPill from "@/components/SelectPill";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import AlertCustom from "@/components/AlertCustom";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

  const phoneticRef = useRef<TextInput>(null);
  const koRef = useRef<TextInput>(null);

  const isValid = fr.trim() && ko.trim();

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
    setShowSuccess(true);
    setFr("");
    setKo("");
    setPhonetic("");
    setDifficulty("easy");
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("../../assets/write.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={{ padding: 18, gap: 12 }}>
        <Text style={styles.title}>Ajouter du vocabulaire</Text>

        <Text style={styles.label}>Français</Text>
        <TextInput
          value={fr}
          onChangeText={setFr}
          style={styles.input}
          placeholder="Ex : Bonjour"
          returnKeyType="next"
          onSubmitEditing={() => phoneticRef.current?.focus()}
        />

        <Text style={styles.label}>Phonétique</Text>
        <TextInput
          ref={phoneticRef}
          value={phonetic}
          onChangeText={setPhonetic}
          style={styles.input}
          placeholder="Ex : annyeonghaseyo"
          returnKeyType="next"
          onSubmitEditing={() => koRef.current?.focus()}
        />

        <Text style={styles.label}>Coréen</Text>
        <TextInput
          ref={koRef}
          value={ko}
          onChangeText={setKo}
          style={styles.input}
          placeholder="Ex : 안녕하세요"
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />

        <Text style={styles.label}>Difficulté</Text>
        <SelectPill
          options={difficulties}
          selectedValue={difficulty}
          onSelect={(value) => setDifficulty(value as Difficulty)}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancel]}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submit, !isValid && styles.disabled]}
            onPress={onSubmit}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Ajouter au lexique</Text>
          </TouchableOpacity>
        </View>
      </View>


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
  imageWrapper: {
    width: "100%",
    height: (280 / 395) * Dimensions.get("window").width * 0.75,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#ffd6d6",
  },
  submit: {
    backgroundColor: "#9da7ff",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.4,
  },
});