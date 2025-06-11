import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, TextInput, ImageBackground, PanResponder, Vibration, Platform, UIManager, StyleSheet, } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import { generateQuestions, type Question } from "@/services/quizGenerator";
import PromptBox from "@/components/quiz/PromptBox";
import Feedback from "@/components/quiz/Feedback";

type Props = NativeStackScreenProps<RootStackParamList, "Quiz">;

export default function QuizScreen({ route, navigation }: Props) {
  const { settings } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const backgrounds = [
    require("../../assets/bg_quiz_1.png"),
    require("../../assets/bg_quiz_2.png"),
    require("../../assets/bg_quiz_3.png"),
  ];
  const [bgImage, setBgImage] = useState(backgrounds[0]);

  const current = questions[currentIndex];

  useEffect(() => {
    generateQuestions(settings).then(setQuestions);
    const randomImage = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBgImage(randomImage);

    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // Check if answer is correct or not and show next question
  const next = () => {
    setShowResult(false);
    setSelected(null);
    setUserInput("");
    setFeedback(null);

    if (currentIndex + 1 >= questions.length) {
      navigation.replace("Result", {
        score,
        total: questions.length,
        settings: {
          type: settings.type,
          inputMode: settings.inputMode ?? "multiple",
        },
      });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  // Handle swipe next question movement
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx < -50,
    onPanResponderRelease: () => {
      if (showResult) {
        Vibration.vibrate([0, 60, 40, 60]);
        setTimeout(next, 100);
      }
    },
  });

  // Check if answer is correct or not 
  const checkAnswer = (answer: string) => {
    const isCorrect = answer.trim() === current.correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setShowResult(true);
    setSelected(answer);
  };

  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#9da7ff" />
      </View>
    );
  }

  return (
    <ImageBackground source={bgImage} style={styles.background} imageStyle={{ opacity: 0.8 }}>
      <View style={styles.container} {...panResponder.panHandlers}>
        {/* ----------------- Icon close ----------------- */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.replace("Home")}
        >
          <MaterialIcons name="close" size={28} color="black" />
        </TouchableOpacity>

        {/* ----------------- Number of questions ----------------- */}
        <View style={styles.counterBar}>
          <Text style={styles.counterText}>
            Question {currentIndex + 1} / {questions.length}
          </Text>
        </View>

        <View style={{ marginTop: "15%" }}>
          {/* ----------------- Prompt box ----------------- */}
          <PromptBox settings={settings} currentQuestion={current} />

          {/* ----------------- Translation input: enter korean answer  ----------------- */}
          {settings.type === "translation" && settings.inputMode === "input" ? (
            <TextInput
              style={[styles.input, { backgroundColor: "#ccc" }]}
              placeholder="Votre réponse en coréen"
              value={userInput}
              onChangeText={setUserInput}
              editable={!showResult}
            />
          ) : (
            // ----------------- Comprehension: several choices box ----------------- 
            <View style={styles.choices}>
              {current.choices?.map((choice: string) => (
                <TouchableOpacity
                  key={choice}
                  style={[
                    styles.choice,
                    selected === choice && {
                      backgroundColor:
                        choice === current.correctAnswer ? "#c6f6d5" : "#feb2b2",
                    },
                  ]}
                  onPress={() => !showResult && checkAnswer(choice)}
                  disabled={!!selected}
                >
                  <Text>{choice}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ----------------- Feedback with icon and eventual correct answer ----------------- */}
        {showResult && (
          <Feedback
            feedback={feedback}
            correctAnswer={current.correctAnswer}
            phonetic={current.phonetic}
          />
        )}

        {/* ----------------- Quiz with unlimited time: terminate button ----------------- */}
        {settings.length === "unlimited" && !showResult && (
          <TouchableOpacity
            style={styles.quitButton}
            onPress={() => {
              navigation.replace("Result", {
                score,
                total: questions.length,
                settings: {
                  type: settings.type,
                  inputMode: settings.inputMode ?? "multiple",
                },
              });
            }}
          >
            <Text style={styles.quitText}>Terminer</Text>
          </TouchableOpacity>
        )}

        {/* ----------------- Bottom button next or check answer ----------------- */}
        {settings.type === "translation" && settings.inputMode === "input" ? (
          <TouchableOpacity
            style={[
              styles.nextButton,
              (!userInput && !showResult) && { opacity: 0.4 },
            ]}
            onPress={() => {
              if (showResult) {
                next();
              } else {
                checkAnswer(userInput);
              }
            }}
            disabled={!userInput && !showResult}
          >
            <Text style={styles.nextButtonText}>
              {showResult ? "Prochaine question »" : "Valider ma réponse"}
            </Text>
          </TouchableOpacity>
        ) : (
          showResult && (
            <TouchableOpacity style={styles.nextButton} onPress={next}>
              <Text style={styles.nextButtonText}>Prochaine question »</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  counterBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
  },
  counterText: { fontSize: 16, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
  },
  choices: { gap: 12 },
  choice: {
    padding: 16,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  nextButton: {
    position: "absolute",
    bottom: 70,
    alignSelf: "center",
    backgroundColor: "#7f8bff",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
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
  },
  background: { flex: 1, width: "100%", height: "100%" },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    left: 10,
    padding: 8,
    zIndex: 20,
  },
});