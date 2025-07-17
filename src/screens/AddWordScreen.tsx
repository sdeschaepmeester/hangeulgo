import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "@/i18n";
import colors from "@/constants/colors";
import MainLayout from "@/layouts/MainLayout";
import ButtonRow from "@/components/buttons/ButtonRow";
import HeaderTitle from "@/components/header/HeaderTitle";
import StepBasicInputs from "@/components/addWord/StepBasicInputs";
import StepDifficulty from "@/components/addWord/StepDifficulty";
import StepThemes from "@/components/addWord/StepThemes";
import { FormData } from "@/types/FormData";
import { getAllUniqueTags } from "@/services/tags";
import { saveWord } from "@/services/lexicon";
import AlertCustom from "@/components/AlertCustom";

export default function AddWordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [formData, setFormData] = useState<FormData>({
    native: "",
    ko: "",
    phonetic: "",
    tags: [],
    difficulty: "easy",
  });

  const [step, setStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const lastStep = 2;

  const handleSubmit = async () => {
    const hasHangul = /[가-힣]/.test(formData.ko);
    if (
      formData.native.trim() === "" ||
      formData.ko.trim() === "" ||
      !hasHangul
    ) {
      return;
    }
    await saveWord({
      native: formData.native.trim(),
      ko: formData.ko.trim(),
      phonetic: formData.phonetic.trim(),
      difficulty: formData.difficulty,
      tags: formData.tags,
      edit: false,
    });
    setFormData({
      native: "",
      ko: "",
      phonetic: "",
      difficulty: "easy",
      tags: [],
    });
    setStep(0);
    await getAllUniqueTags();
    setShowSuccess(true);
  };

  const handleNextOrSubmit = () => {
    if (step < lastStep) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step === 0) {
      navigation.navigate("Home");
    } else {
      setStep(step - 1);
    }
  };

  const isNextDisabled = () => {
    const hasKoreanChar = /[가-힣]/.test(formData.ko);
    if (step === 0) {
      return (
        formData.native.trim() === "" ||
        formData.ko.trim() === "" ||
        !hasKoreanChar
      );
    }
    return false;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepBasicInputs data={formData} setData={setFormData} />;
      case 1:
        return <StepThemes data={formData} setData={setFormData} />;
      case 2:
        return <StepDifficulty data={formData} setData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <View style={styles.container}>
        {/* ----------- Top section title ----------- */}
        <HeaderTitle
          label={i18n.t("addWord.step", { step: step + 1 })}
          iconRight={
            <MaterialCommunityIcons
              name="help-circle"
              size={24}
              color={colors.primary.main}
            />
          }
        />

        {/* ----------- Step content ----------- */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderStep()}
        </ScrollView>

        {/* ----------- Bottom section actions buttons ----------- */}
        <ButtonRow
          onLeftPress={handleBack}
          onRightPress={handleNextOrSubmit}
          leftLabel={step === 0 ? i18n.t("actions.cancel") : i18n.t("actions.previous")}
          rightLabel={step === lastStep ? i18n.t("actions.add") : i18n.t("actions.next")}
          rightDisabled={isNextDisabled()}
        />

        {/* ----------- Success Modal ----------- */}
        <AlertCustom
          visible={showSuccess}
          icon={
            <MaterialCommunityIcons
              name="check-circle"
              size={30}
              color={colors.success.dark}
            />
          }
          iconColor={colors.success.dark}
          title={i18n.t("actions.added")}
          description={i18n.t("addWord.success")}
          onClose={() => setShowSuccess(false)}
        />
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
});