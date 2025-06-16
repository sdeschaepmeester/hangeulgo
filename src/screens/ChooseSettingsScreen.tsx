import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import type { Difficulty } from "@/types/Difficulty";
import type { GameSettings, InputMode } from "@/types/GameSettings";
import { getAllUniqueTags } from "@/services/tags";
import { getSavedSettings, saveSettings, clearSettings } from "@/services/settings";
import StepStructure from "@/components/chooseSettings/StepStructure";
import StepDifficulty from "@/components/chooseSettings/StepDifficulty";
import StepDuration from "@/components/chooseSettings/StepDuration";
import StepThemes from "@/components/chooseSettings/StepThemes";
import SelectPill from "@/components/SelectPill";
import StepType from "@/components/chooseSettings/StepType";
import { getAvailableDifficultiesFromTags, getFilteredLexicon } from "@/services/lexicon";

const screenWidth = Dimensions.get("window").width;

const arcadeBg = require("../../assets/arcade.png");

const modes = [
  { label: "QCM", value: "multiple", color: "#9da7ff" },
  { label: "Saisie", value: "input", color: "#9da7ff" },
];

type Props = NativeStackScreenProps<RootStackParamList, "ChooseSettings">;

export default function ChooseSettingsScreen({ route, navigation }: Props) {
  const { type } = route.params;
  const [step, setStep] = useState(0);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [length, setLength] = useState<number>(10);
  const [inputMode, setInputMode] = useState<InputMode>("multiple");
  const [rememberSettings, setRememberSettings] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [disabledDifficulties, setDisabledDifficulties] = useState<Difficulty[]>([]);
  const steps = type === "translation"
    ? [
      () => <StepType inputMode={inputMode} onChange={setInputMode} />,
      () => <StepThemes selectedTags={selectedTags} onChange={setSelectedTags} allTags={allTags} preselectedTags={rememberSettings ? selectedTags : undefined} />,
      () => <StepDifficulty selected={selectedDifficulties} onChange={setSelectedDifficulties} disabledDifficultyList={disabledDifficulties} />,
      () => <StepDuration selected={length} onSelect={setLength} />
    ]
    : [
      () => <StepThemes selectedTags={selectedTags} onChange={setSelectedTags} allTags={allTags} preselectedTags={rememberSettings ? selectedTags : undefined} />,
      () => <StepDifficulty selected={selectedDifficulties} onChange={setSelectedDifficulties} disabledDifficultyList={disabledDifficulties} />,
      () => <StepDuration selected={length} onSelect={setLength} />
    ];
  const maxStep = steps.length - 1;
  const isLastStep = step === maxStep;
  const stepIsDifficulty = type === "translation" ? step === 2 : step === 1;
  const isDisabled = stepIsDifficulty && selectedDifficulties.length === 0;

  useEffect(() => {
    getAllUniqueTags().then(setAllTags);

    getSavedSettings().then((saved) => {
      if (!saved) return;

      setSelectedDifficulties(saved.difficulties);
      setLength(saved.length);
      if (saved.inputMode) setInputMode(saved.inputMode);
      if (saved.tags) setSelectedTags(saved.tags);

      // Put remmemberSettings to true AFTER loading saved settings
      setTimeout(() => setRememberSettings(true), 0);
    });
  }, []);

  // Get available difficulties based on selected tags
  useEffect(() => {
    const updateAvailableDifficulties = async () => {
      const available = await getAvailableDifficultiesFromTags(selectedTags);
      const allDifficulties: Difficulty[] = ["easy", "medium", "hard"];
      const disabled = allDifficulties.filter((d) => !available.includes(d));
      setDisabledDifficulties(disabled);
    };
    updateAvailableDifficulties();
  }, [selectedTags]);

  const startGame = () => {
    const settings: GameSettings = {
      type,
      difficulties: selectedDifficulties,
      length,
      ...(type === "translation" && { inputMode }),
      ...(selectedTags.length > 0 && { tags: selectedTags }),
    };
    if (rememberSettings) {
      saveSettings(selectedDifficulties, length, inputMode, selectedTags);
    }
    navigation.navigate("Quiz", { settings });
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const toggleRememberSettings = () => {
    const newValue = !rememberSettings;
    setRememberSettings(newValue);

    if (!newValue) {
      clearSettings();
    } else {
      saveSettings(selectedDifficulties, length, inputMode, selectedTags);
    }
  };

  const renderStep = () => (
    <StepStructure step={step}>
      {steps[step]()}
    </StepStructure>
  );

  return (
    <ImageBackground source={arcadeBg} style={styles.background} resizeMode="cover">
      {/* ----------------- Container quiz type and save settings ----------------- */}
      <View style={styles.topContainer}>
        <Text style={styles.quizType}>
          Quiz de {type === "translation" ? "traduction" : "compréhension"}
        </Text>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={toggleRememberSettings}
        >
          <View style={[styles.box, rememberSettings && styles.boxChecked]} />
          <Text style={styles.checkboxLabel}>Conserver les réglages</Text>
        </TouchableOpacity>
      </View>

      {/* ----------------- Step specific content ----------------- */}
      <View style={styles.middleContainer}>{renderStep()}</View>

      {/* ----------------- Buttons start and back ----------------- */}
      <View style={styles.bottomContainer}>
        {!isLastStep ? (
          <View style={styles.stepButtonsRow}>
            <TouchableOpacity
              onPress={step === 0 ? () => navigation.navigate("Home") : back}
              style={[styles.button, styles.leftButton]}
            >
              <Text style={styles.text}>
                {step === 0 ? "← Quitter" : "←"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={next}
              disabled={isDisabled}
              style={[styles.button, styles.rightButton, isDisabled && styles.disabled]}>
              <Text style={styles.text}>▶ NEXT</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.stepButtonsRow}>
            <TouchableOpacity onPress={back} style={[styles.button, styles.leftButton]}>
              <Text style={styles.text}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={startGame}
              disabled={isDisabled}
              style={[styles.button, styles.rightButton, isDisabled && styles.disabled]}>
              <Text style={styles.text}>▶ START</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  topContainer: {
    alignItems: "center",
    paddingTop: 16,
    gap: 8,
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
    marginTop: 12
  },
  middleContainer: {
    flex: 1,
    marginTop: "20%",
    marginBottom: "30%",
    paddingHorizontal: 24,
    justifyContent: "center",
    width: "100%",
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  navButton: {
    backgroundColor: "#8884ff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    backgroundColor: "#ff4770",
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 4,
  },
  playText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.5,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fff",
    marginRight: 8,
  },
  boxChecked: {
    backgroundColor: "#C60C30",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#C60C30",
  },
  stepButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    width: "100%",
  },
  container: {
    flexDirection: "row",
    width: "100%",
  },
  button: {
    width: screenWidth / 2.2,
    paddingVertical: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
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
  },
});