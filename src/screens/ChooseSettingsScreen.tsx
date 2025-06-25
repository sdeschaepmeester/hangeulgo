import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import type { Difficulty } from "@/types/Difficulty";
import type { GameSettings, GameSubType, InputMode } from "@/types/GameSettings";
import { getAllUniqueTags, getFilteredTagsForPuzzle } from "@/services/tags";
import { getAvailableDifficultiesFromTags } from "@/services/lexicon";
import StepStructure from "@/components/chooseSettings/StepStructure";
import StepDifficulty from "@/components/chooseSettings/StepDifficulty";
import StepDuration from "@/components/chooseSettings/StepDuration";
import StepThemes from "@/components/chooseSettings/StepThemes";
import StepType from "@/components/chooseSettings/StepType";
import StepSaveQuiz from "@/components/chooseSettings/StepSaveQuiz";
import { saveCustomQuiz } from "@/services/quiz";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SavedQuizEntry } from "@/types/SavedQuizEntry";
import i18n from "@/i18n";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const arcadeBg = require("../../assets/arcade.png");

type Props = NativeStackScreenProps<RootStackParamList, "ChooseSettings">;

const fixedConfigByType: Record<"arrangement" | "ecriture", { subType: GameSubType; inputMode: InputMode }> = {
  arrangement: { subType: "order", inputMode: "order" },
  ecriture: { subType: "nativeToKo", inputMode: "input" },
};

const multipleSubTypes: Record<"comprehension" | "ecoute", GameSubType[]> = {
  comprehension: ["nativeToKo", "koToNative"],
  ecoute: ["koToKo", "koToNative"],
};

export default function ChooseSettingsScreen({ route, navigation }: Props) {
  const { type } = route.params;

  const [subType, setSubType] = useState<GameSubType | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("multiple");
  const [step, setStep] = useState(0);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [length, setLength] = useState<number>(10);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [disabledDifficulties, setDisabledDifficulties] = useState<Difficulty[]>([]);

  const [shouldSave, setShouldSave] = useState(false);
  const [saveName, setSaveName] = useState("");

  const shouldAskSubType = type === "comprehension" || type === "ecoute";

  useEffect(() => {
    if (type === "comprehension" || type === "ecoute") {
      setInputMode("multiple");
    } else {
      const config = fixedConfigByType[type];
      setSubType(config.subType);
      setInputMode(config.inputMode);
    }
  }, [type]);

  useEffect(() => {
    const loadTags = async () => {
      if (type === "arrangement") {
        const validTags = await getFilteredTagsForPuzzle();
        setAllTags(validTags);
      } else {
        const all = await getAllUniqueTags();
        setAllTags(all);
      }
    };
    loadTags();
  }, []);


  useEffect(() => {
    const updateAvailableDifficulties = async () => {
      const available = await getAvailableDifficultiesFromTags(selectedTags, type === "arrangement");
      const allDifficulties: Difficulty[] = ["easy", "medium", "hard"];
      const disabled = allDifficulties.filter((d) => !available.includes(d));
      setDisabledDifficulties(disabled);
    };
    updateAvailableDifficulties();
  }, [selectedTags]);

  const steps = [
    ...(shouldAskSubType
      ? [() => <StepType available={multipleSubTypes[type]} selected={subType} onChange={setSubType} />]
      : []),
    () => <StepThemes selectedTags={selectedTags} onChange={setSelectedTags} allTags={allTags} />,
    () => <StepDifficulty selected={selectedDifficulties} onChange={setSelectedDifficulties} disabledDifficultyList={disabledDifficulties} />,
    () => <StepDuration selected={length} onSelect={setLength} />,
    () => (
      <StepSaveQuiz
        saveEnabled={shouldSave}
        saveName={saveName}
        onToggleSave={() => setShouldSave((prev) => !prev)}
        onChangeName={setSaveName}
      />
    ),
  ];

  const maxStep = steps.length - 1;
  const isLastStep = step === maxStep;
  const stepIsDifficulty = step === (shouldAskSubType ? 2 : 1);
  const isDisabled = stepIsDifficulty && selectedDifficulties.length === 0;

  const startGame = async () => {
    if (!subType) return;

    const settings: GameSettings = {
      type,
      subType,
      inputMode,
      difficulties: selectedDifficulties,
      length,
      ...(selectedTags.length > 0 && { tags: selectedTags }),
    };

    if (shouldSave && saveName.trim()) {
      await saveCustomQuiz(saveName.trim(), settings);
    }

    navigation.navigate("Quiz", { settings });
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const renderStep = () => <StepStructure step={step}>{steps[step]()}</StepStructure>;

  const getQuizTypeLabel = (type: SavedQuizEntry["type"]) => {
    switch (type) {
      case "comprehension": return i18n.t("quizTypes.quizComprehension");
      case "ecoute": return i18n.t("quizTypes.quizListening");
      case "arrangement": return i18n.t("quizTypes.quizPuzzle");
      case "ecriture": return i18n.t("quizTypes.quizWriting");
      default: return i18n.t("quizTypes.quiz");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={arcadeBg} style={styles.background} resizeMode="cover">
        <View style={styles.top}>
          <Text style={styles.quizType}>{getQuizTypeLabel(type)}</Text>
        </View>

        <View style={styles.middle}>{renderStep()}</View>

        <View style={styles.bottom}>
          {!isLastStep ? (
            <View style={styles.stepButtonsRow}>
              <TouchableOpacity
                onPress={step === 0 ? () => navigation.navigate("QuizList") : back}
                style={[styles.button, styles.leftButton]}
              >
                <Text style={styles.text}>
                  <MaterialCommunityIcons name="chevron-left" size={18} color="white" style={{ marginRight: 4 }} />
                  {step === 0 && i18n.t("actions.quit")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={next}
                disabled={isDisabled}
                style={[styles.button, styles.rightButton, isDisabled && styles.disabled]}
              >
                <MaterialCommunityIcons name="chevron-right" size={18} color="white" style={{ marginRight: 4 }} />
                <Text style={styles.text}>{i18n.t("actions.next")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.stepButtonsRow}>
              <TouchableOpacity onPress={back} style={[styles.button, styles.leftButton]}>
                <Text style={styles.text}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={startGame}
                disabled={isDisabled || !subType}
                style={[styles.button, styles.rightButton, (isDisabled || !subType) && styles.disabled]}
              >
                <MaterialCommunityIcons name="gamepad-variant" size={18} color="white" style={{ marginRight: 4 }} />
                <Text style={styles.text}>{i18n.t("actions.start")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { width: "100%", height: "100%" },
  top: {
    height: windowHeight * 0.15,
    alignItems: "center",
    justifyContent: "center",
  },
  middle: {
    height: windowHeight * 0.60,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  bottom: {
    height: windowHeight * 0.25,
    alignItems: "center",
  },
  stepButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "15%",
  },
  quizType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#003478",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 12,
  },
  button: {
    width: windowWidth / 2.2,
    paddingVertical: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
  },
  leftButton: {
    backgroundColor: "#003478",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightButton: {
    backgroundColor: "#C60C30",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});