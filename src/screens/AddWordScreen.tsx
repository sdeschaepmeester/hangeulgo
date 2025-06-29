import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import AlertCustom from "@/components/AlertCustom";
import WordForm from "@/components/form/WordForm";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { isLexiconLimitReached } from "@/services/lexicon";
import WarningLimit from "@/components/WarningLimit";
import MainLayout from "@/layouts/MainLayout";
import i18n from "@/i18n";
import colors from "@/constants/colors";

export default function AddWordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const checkLimit = () => {
    isLexiconLimitReached().then(setIsLimitReached);
  };

  useEffect(() => {
    checkLimit();
  }, []);

  return (
    <MainLayout scrollable>
      {/* ---------- Header ---------- */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{i18n.t("addWord.title")}</Text>
      </View>

      {/* ---------- Alerte number max lexicon entry ---------- */}
      {isLimitReached && (
        <WarningLimit
          label={i18n.t("limits.limitWordsReached")}
          onClick={() => navigation.navigate("Lexicon")}
        />
      )}

      {/* ---------- Form add word ---------- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <WordForm
          edit={false}
          onSuccess={() => {
            setShowSuccess(true);
            checkLimit();
          }}
        />
      </KeyboardAvoidingView>


      {/* ---------- Modale success ---------- */}
      <AlertCustom
        visible={showSuccess}
        icon={<MaterialCommunityIcons name="check-circle" size={30} color={colors.success.dark} />}
        iconColor={colors.success.dark}
        title={i18n.t("actions.added")}
        description={i18n.t("addWord.success")}
        onClose={() => setShowSuccess(false)}
      />
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 18
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text.primary,
  },
});
