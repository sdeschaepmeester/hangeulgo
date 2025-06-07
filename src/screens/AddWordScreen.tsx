import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import AlertCustom from "@/components/AlertCustom";
import WordForm from "@/components/form/WordForm";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export default function AddWordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <View style={styles.container}>
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

      <Image
        source={require("../../assets/dictionary.png")}
        style={styles.dictionary}
      />

      {/* ----------------- Modale success add word ----------------- */}
      <AlertCustom
        visible={showSuccess}
        icon={<MaterialCommunityIcons name="check-circle" size={30} color="#4caf50" />}
        iconColor="#4caf50"
        title="Ajouté !"
        description="Le mot a été ajouté au lexique."
        onClose={() => setShowSuccess(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, gap: 12, paddingTop: 50 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  dictionary: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginTop: 24,
    opacity: 0.9,
  },
});