import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <MaterialIcons name="close" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* ---------- Alerte number max lexicon entry ---------- */}
      {isLimitReached && (
        <WarningLimit
          label={i18n.t("limits.limitWordsReached")}
          onClick={() => navigation.navigate("Lexicon")}
        />
      )}

      {/* ---------- Form add word ---------- */}
      <WordForm
        edit={false}
        onSuccess={() => {
          setShowSuccess(true);
          checkLimit();
        }}
      />

      {/* ---------- Modale success ---------- */}
      <AlertCustom
        visible={showSuccess}
        icon={<MaterialCommunityIcons name="check-circle" size={30} color="#4caf50" />}
        iconColor="#4caf50"
        title={i18n.t("actions.added")}
        description={i18n.t("limits.success")}
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});
