import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import AlertCustom from "@/components/AlertCustom";
import WordForm from "@/components/form/WordForm";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import NavBar from "@/components/NavBar";

export default function AddWordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Ajouter du vocabulaire</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <MaterialIcons name="close" size={28} color="#999" />
          </TouchableOpacity>
        </View>

        {/* ----------------- Add word form ----------------- */}
        <WordForm
          edit={false}
          onSuccess={() => setShowSuccess(true)}
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
    paddingTop: 50,
    gap: 12,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "bold" },
});