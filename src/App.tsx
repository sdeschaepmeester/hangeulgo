import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import AddWordScreen from "./screens/AddWordScreen";
import LexiconScreen from "./screens/LexiconScreen";
import ChooseSettingsScreen from "./screens/ChooseSettingsScreen";
import QuizScreen from "./screens/QuizScreen";
import ResultScreen from "./screens/ResultScreen";

export type RootStackParamList = {
  Home: undefined;
  AddWord: undefined;
  Lexicon: undefined;
  ChooseSettings: { type: "translation" | "comprehension" };
  Quiz: { settings: any };
  Result: { score: number; total: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddWord" component={AddWordScreen} />
        <Stack.Screen name="Lexicon" component={LexiconScreen} />
        <Stack.Screen name="ChooseSettings" component={ChooseSettingsScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
