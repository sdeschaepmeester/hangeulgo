import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  PanResponder,
  Vibration,
  Platform,
  UIManager,
  StyleSheet,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
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

  const next = () => {
    setShowResult(false);
    setSelected(null);
    setUserInput("");

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

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx < -50,
    onPanResponderRelease: () => {
      if (showResult) {
        Vibration.vibrate([0, 60, 40, 60]);
        setTimeout(next, 100); // plus stable
      }
    },
  });

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
    setTimeout(() => setFeedback(null), 1000);
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
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.replace("Home")}
        >
          <MaterialIcons name="close" size={28} color="black" />
        </TouchableOpacity>
        <View style={styles.counterBar}>
          <Text style={styles.counterText}>
            Question {currentIndex + 1} / {questions.length}
          </Text>
        </View>

        <View style={styles.promptWrapper}>
          <View style={styles.promptBox}>
            <Text style={styles.prompt}>
              {settings.type === "translation" ? current.fr : current.ko}
            </Text>
          </View>
        </View>

        {settings.type === "translation" && settings.inputMode === "input" ? (
          <TextInput
            style={[styles.input, { backgroundColor: "#ccc" }]}
            placeholder="Votre réponse en coréen"
            value={userInput}
            onChangeText={setUserInput}
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

        {showResult && selected !== current.correctAnswer && (
          <View style={styles.correctAnswerWrapper}>
            <Text style={styles.correctAnswer}>
              Bonne réponse : {current.correctAnswer}
              {settings.type === "translation" && current.phonetic
                ? ` (${current.phonetic})`
                : ""}
            </Text>
          </View>
        )}

        {feedback && (
          <Animated.View
            entering={FadeInUp.duration(500)}
            style={styles.feedbackIcon}
          >
            <MaterialIcons
              name={feedback === "correct" ? "emoji-events" : "cancel"}
              size={100}
              color={feedback === "correct" ? "gold" : "#ff5e5e"}
            />
          </Animated.View>
        )}

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
  counterBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
  },
  counterText: {
    fontSize: 16,
    fontWeight: "600",
  },
  promptWrapper: {
    borderRadius: 12,
    marginTop: 60,
    marginBottom: 20,
  },
  promptBox: {
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 16,
    borderRadius: 12,
  },
  prompt: {
    fontSize: 24,
    fontWeight: "bold",
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
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  correctAnswerWrapper: {
    alignItems: "center",
    marginTop: 16,
  },
  correctAnswer: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  feedbackIcon: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    zIndex: 10,
  },
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
