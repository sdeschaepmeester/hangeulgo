import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

export default function ResultScreen({ route, navigation }: Props) {
  const { score, total } = route.params;
  const percent = Math.round((score / total) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Résultat</Text>
      <Text style={styles.score}>{score} / {total}</Text>
      <Text style={styles.percent}>{percent}% de réussite</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.retry]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Rejouer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.quit]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Quitter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  score: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4caf50",
  },
  percent: {
    fontSize: 18,
    color: "#555",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retry: {
    backgroundColor: "#9da7ff",
  },
  quit: {
    backgroundColor: "#ff9d9d",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});