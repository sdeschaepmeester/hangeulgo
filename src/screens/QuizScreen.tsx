import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import type { Question } from "@/types/Question";
import { generateQuestions } from "@/services/quizGenerator";

type Props = NativeStackScreenProps<RootStackParamList, "Quiz">;

export default function QuizScreen({ route, navigation }: Props) {
  const { settings } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('coucou quiz screen')
    console.log(settings)
    generateQuestions(settings).then((q) => {
      setQuestions(q);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#9da7ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Début du quiz !</Text>
      <Text style={styles.subtitle}>
        {questions.length} question{questions.length > 1 ? "s" : ""}
      </Text>
      {/* Ici viendra la logique d'affichage des questions une par une */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
});
