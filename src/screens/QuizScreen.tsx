import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import { generateQuestions, type Question } from "@/services/quizGenerator";

type Props = NativeStackScreenProps<RootStackParamList, "Quiz">;

export default function QuizScreen({ route, navigation }: Props) {
  const { settings } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const current = questions[currentIndex];

  useEffect(() => {
    generateQuestions(settings).then(setQuestions);
  }, []);

  const checkAnswer = (answer: string) => {
    const isCorrect = answer.trim() === current.correctAnswer;
    if (isCorrect) setScore((s) => s + 1);
    setShowResult(true);
    setSelected(answer);
  };

  const next = () => {
    setShowResult(false);
    setSelected(null);
    setUserInput("");
    if (currentIndex + 1 >= questions.length) {
      navigation.replace("Result", { score, total: questions.length });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#9da7ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>
        {currentIndex + 1} / {questions.length}
      </Text>

      <Text style={styles.prompt}>
        {settings.type === "translation" ? current.fr : current.ko}
      </Text>

      {settings.type === "translation" && settings.inputMode === "input" ? (
        <TextInput
          style={styles.input}
          placeholder="Votre réponse en coréen"
          value={userInput}
          onChangeText={setUserInput}
          onSubmitEditing={() => checkAnswer(userInput)}
          editable={!showResult}
        />
      ) : (
        <View style={styles.choices}>
          {current.choices?.map((choice: string) => (
            <TouchableOpacity
              key={choice}
              style={[
                styles.choice,
                selected === choice && {
                  backgroundColor: choice === current.correctAnswer ? "#c6f6d5" : "#feb2b2",
                },
              ]}
              onPress={() => !showResult && checkAnswer(choice)}
            >
              <Text>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {settings.length == "unlimited" && !showResult && (
        <>
          <TouchableOpacity style={styles.quitButton} onPress={() => {
            navigation.replace("Result", { score, total: currentIndex });
          }}>
            <Text style={styles.quitText}>Terminer</Text>
          </TouchableOpacity>
        </>
      )}
      {showResult && (
        <TouchableOpacity style={styles.nextButton} onPress={next}>
          <Text style={styles.nextText}>Continuer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  counter: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  prompt: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
  },
  choices: {
    gap: 12,
  },
  choice: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: "#9da7ff",
    padding: 12,
    borderRadius: 8,
  },
  nextText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  quitButton: {
    marginTop: 24,
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#ff9d9d",
  },
  quitText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  }
});
