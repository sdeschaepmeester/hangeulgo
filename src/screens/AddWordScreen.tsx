import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import AlertCustom from "@/components/AlertCustom";
import WordForm from "@/components/form/WordForm";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import NavBar from "@/components/NavBar";
import { isLexiconLimitReached } from "@/services/lexicon";
import WarningLimit from "@/components/WarningLimit";

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Ajouter du vocabulaire</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <MaterialIcons name="close" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* ----------------- Warning if number max of words reached ----------------- */}
        {isLimitReached && (
          <WarningLimit
            label="La limite de mots du lexique est atteinte, supprimez-en pour en ajouter d'autres."
            onClick={() => navigation.navigate("Lexicon")}
          />
        )}

        {/* ----------------- Add word form ----------------- */}
        <WordForm
          edit={false}
          onSuccess={() => {
            setShowSuccess(true);
            checkLimit();
          }}
        />

        <NavBar />

        {/* ----------------- Modale success add word ----------------- */}
        <AlertCustom
          visible={showSuccess}
          icon={<MaterialCommunityIcons name="check-circle" size={30} color="#4caf50" />}
          iconColor="#4caf50"
          title="Ajouté !"
          description="Le mot a été ajouté au lexique."
          onClose={() => setShowSuccess(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 18,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});