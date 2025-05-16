import React from "react";
import { useEffect } from "react";
import { initDatabase } from "@/db/database";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import AddWordScreen from "./screens/AddWordScreen";
import LexiconScreen from "./screens/LexiconScreen";
import ChooseSettingsScreen from "./screens/ChooseSettingsScreen";
import QuizScreen from "./screens/QuizScreen";
import ResultScreen from "./screens/ResultScreen";
import ScoreScreen from "./screens/ScoreScreen";
import { GameSettings } from "./types/GameSettings";

export type RootStackParamList = {
  Home: undefined;
  AddWord: undefined;
  Lexicon: undefined;
  ChooseSettings: { type: "translation" | "comprehension" };
  Quiz: { settings: GameSettings };
  Result: {
    score: number;
    total: number;
    settings: Pick<GameSettings, "type" | "inputMode">;
  };
  Score: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddWord" component={AddWordScreen} />
        <Stack.Screen name="Lexicon" component={LexiconScreen} />
        <Stack.Screen name="ChooseSettings" component={ChooseSettingsScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Score" component={ScoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}