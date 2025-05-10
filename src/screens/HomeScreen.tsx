import React from "react";
import { View, Button, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>HangeulGo</Text>

            <Text style={{ fontSize: 18 }}>Lexique</Text>
            <Button title="Voir" onPress={() => navigation.navigate("Lexicon")} />
            <Button title="Ajouter" onPress={() => navigation.navigate("AddWord")} />

            <Text style={{ fontSize: 18, marginTop: 20 }}>Exercices</Text>
            <Button
                title="Compréhension"
                onPress={() => navigation.navigate("ChooseSettings", { type: "comprehension" })}
            />
            <Button
                title="Traduction"
                onPress={() => navigation.navigate("ChooseSettings", { type: "translation" })}
            />
        </View>
    );
}
