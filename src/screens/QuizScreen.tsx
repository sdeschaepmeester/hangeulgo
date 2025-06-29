import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, ImageBackground, PanResponder, StyleSheet, ScrollView, } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import { generateQuestions } from "@/services/quizGenerator";
import type { Question } from "@/types/Question";
import PromptBox from "@/components/quiz/PromptBox";
import ListenPrompt from "@/components/quiz/ListenPrompt";
import QuizHeader from "@/components/quiz/game/QuizHeader";
import QuizContent from "@/components/quiz/game/QuizContent";
import QuizFooter from "@/components/quiz/game/QuizFooter";
import colors from "@/constants/colors";
import { playFeedbackIfEnabled } from "@/services/sound";
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
  const [bgImage, setBgImage] = useState(require("../../assets/quiz/bg_quiz_1.png"));

  const backgrounds = [
    require("../../assets/quiz/bg_quiz_1.png"),
    require("../../assets/quiz/bg_quiz_2.png"),
    require("../../assets/quiz/bg_quiz_3.png"),
    require("../../assets/quiz/bg_quiz_4.jpg"),
    require("../../assets/quiz/bg_quiz_5.jpg"),
    require("../../assets/quiz/bg_quiz_6.jpg"),
  ];

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    generateQuestions(settings).then(setQuestions);
    const randomImage =
      backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBgImage(randomImage);
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
        playFeedbackIfEnabled("correct");
        setTimeout(next, 100);
      }
    },
  });

  const checkAnswer = (answer: string) => {
    const expected = currentQuestion.correctAnswer.trim();
    const submitted =
      settings.inputMode === "order"
        ? answer.replace(/\s/g, "")
        : answer.trim();
    const isCorrect = submitted === expected;

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
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  const isPuzzle = settings.inputMode === "order";

  const hasRemainingPieces = () => {
    if (!isPuzzle) return false;
    const clean = currentQuestion.correctAnswer.trim();
    const pieces = clean.split("");
    const used = userInput.split(clean.length <= 4 ? "" : " ");
    return used.length < pieces.length;
  };

  const isDisabled =
    !showResult && (!userInput || (isPuzzle && hasRemainingPieces()));

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={bgImage}
        style={styles.background}
        imageStyle={{ opacity: 0.8 }}
      >
        <View style={styles.container}>
          {/* --------- Header with question number ---------*/}
          <View style={styles.top}>
            <QuizHeader
              current={currentIndex + 1}
              total={questions.length}
              onClose={() => navigation.replace("Home")}
            />
          </View>

          {/* --------- Feedback ---------*/}
          <View style={styles.feedbackContainer}>
            {showResult && <Feedback feedback={feedback} />}
          </View>

          {/* -------------- Question prompt and options --------------*/}
          <View style={styles.middle}>
            <ScrollView
              contentContainerStyle={styles.middleContent}
              keyboardShouldPersistTaps="handled"
              {...panResponder.panHandlers}
            >
              {settings.type === "ecoute" ? (
                <ListenPrompt
                  prompt={currentQuestion.prompt}
                  tags={currentQuestion.tags}
                />
              ) : (
                <PromptBox
                  currentQuestion={currentQuestion}
                  settings={settings}
                />
              )}

              <QuizContent
                question={currentQuestion}
                settings={settings}
                userInput={userInput}
                onChange={setUserInput}
                onSelectChoice={checkAnswer}
                selected={selected}
                disabled={showResult}
                currentIndex={currentIndex}
              />
            </ScrollView>
          </View>

          {/* -------------- Footer -------------- */}
          <View style={styles.bottom}>
            <QuizFooter
              showResult={showResult}
              isDisabled={isDisabled}
              onValidate={() => checkAnswer(userInput)}
              onNext={next}
              isLast={currentIndex + 1 >= questions.length}
              inputMode={settings.inputMode}
              correctAnswer={currentQuestion.correctAnswer}
              feedback={feedback}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  top: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  middle: {
    flex: 0.65,
  },
  middleContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  bottom: {
    flex: 0.25,
    justifyContent: "flex-end",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackContainer: {
    position: "absolute",
    alignSelf: "center",
    top: "40%",
    zIndex: 99,
  },
});
