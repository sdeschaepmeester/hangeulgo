import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, TextInput, ImageBackground, PanResponder, Vibration, Platform, UIManager, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import { generateQuestions } from "@/services/quizGenerator";
import Feedback from "@/components/quiz/Feedback";
import { Question } from "@/types/Question";
import ListenPrompt from "@/components/quiz/ListenPrompt";
import PromptBox from "@/components/quiz/PromptBox";
import OrderInput from "@/components/quiz/OrderInput";

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
    require("../../assets/quiz/bg_quiz_1.png"),
    require("../../assets/quiz/bg_quiz_2.png"),
    require("../../assets/quiz/bg_quiz_3.png"),
    require("../../assets/quiz/bg_quiz_4.jpg"),
    require("../../assets/quiz/bg_quiz_5.jpg"),
    require("../../assets/quiz/bg_quiz_6.jpg"),
  ];
  const [bgImage, setBgImage] = useState(backgrounds[0]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    generateQuestions(settings).then(setQuestions);
    const randomImage = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBgImage(randomImage);

    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

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
          subType: settings.subType ?? undefined,
        },
      });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx < -50,
    onPanResponderRelease: () => {
      if (showResult) {
        Vibration.vibrate([0, 60, 40, 60]);
        setTimeout(next, 100);
      }
    },
  });

  const checkAnswer = (answer: string) => {
    const isCorrect = answer.trim() === currentQuestion.correctAnswer;
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

  const isPuzzle = settings.inputMode === "order";
  const correctLength = currentQuestion.correctAnswer.trim().length;
  const isDisabled =
    !showResult &&
    (
      !userInput ||
      (isPuzzle && userInput.trim().length !== correctLength)
    );

  return (
    <ImageBackground source={bgImage} style={styles.background} imageStyle={{ opacity: 0.8 }}>
      <SafeAreaView style={styles.safeContainer} edges={["bottom"]}>
        {/* ----------- Header ----------- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.replace("Home")} style={styles.closeButton}>
            <MaterialIcons name="close" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.counterText}>
            Question {currentIndex + 1} / {questions.length}
          </Text>
        </View>

        {/* ----------- Scrollable Middle Section ----------- */}
        <ScrollView
          contentContainerStyle={styles.middle}
          keyboardShouldPersistTaps="handled"
          {...panResponder.panHandlers}
        >
          {settings.type === "ecoute" ? (
            <ListenPrompt prompt={currentQuestion.prompt} tags={currentQuestion.tags} />
          ) : (
            <PromptBox currentQuestion={currentQuestion} settings={settings} />
          )}

          {settings.inputMode === "input" && (
            <TextInput
              style={[styles.input, { backgroundColor: "#ccc" }]}
              placeholder="Votre réponse en coréen"
              value={userInput}
              onChangeText={setUserInput}
              editable={!showResult}
            />
          )}

          {settings.inputMode === "multiple" && (
            <View style={styles.choices}>
              {currentQuestion.choices?.map((choice, index) => (
                <TouchableOpacity
                  key={`${choice}-${index}`}
                  style={[
                    styles.choice,
                    selected === choice && {
                      backgroundColor:
                        choice === currentQuestion.correctAnswer ? "#c6f6d5" : "#feb2b2",
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

          {isPuzzle && (
            <OrderInput
              correctAnswer={currentQuestion.correctAnswer}
              onChange={setUserInput}
              disabled={showResult}
              questionKey={currentIndex}
            />
          )}
        </ScrollView>

        {/* ----------- Bottom Section ----------- */}
        <View style={styles.footer}>
          {showResult && (
            <Feedback feedback={feedback} correctAnswer={currentQuestion.correctAnswer} />
          )}
          {(settings.inputMode === "input" || settings.inputMode === "order") ? (
            <TouchableOpacity
              style={[styles.nextButton, isDisabled && { opacity: 0.4 }]}
              onPress={() => {
                if (showResult) {
                  next();
                } else {
                  checkAnswer(userInput);
                }
              }}
              disabled={isDisabled}
            >
              <Text style={styles.nextButtonText}>
                {showResult
                  ? currentIndex + 1 >= questions.length
                    ? "Voir les résultats"
                    : "Prochaine question »"
                  : "Valider ma réponse"}
              </Text>
            </TouchableOpacity>
          ) : (
            showResult && (
              <TouchableOpacity style={styles.nextButton} onPress={next}>
                <Text style={styles.nextButtonText}>
                  {currentIndex + 1 >= questions.length
                    ? "Voir les résultats"
                    : "Prochaine question »"}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeContainer: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  closeButton: {
    padding: 8,
  },
  counterText: {
    fontSize: 16,
    fontWeight: "600",
  },
  middle: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  nextButton: {
    marginTop: 16,
    backgroundColor: "#7f8bff",
    paddingVertical: 14,
    borderRadius: 8,
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  choices: {
    gap: 12,
    marginTop: 20,
  },
  choice: {
    padding: 16,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
