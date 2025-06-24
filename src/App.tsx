import React, { useEffect } from "react";
import { TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import AddWordScreen from "./screens/AddWordScreen";
import LexiconScreen from "./screens/LexiconScreen";
import ChooseSettingsScreen from "./screens/ChooseSettingsScreen";
import QuizScreen from "./screens/QuizScreen";
import ResultScreen from "./screens/ResultScreen";
import ScoreScreen from "./screens/ScoreScreen";
import QuizListScreen from "./screens/QuizListScreen";
import SavedQuizScreen from "./screens/SavedQuizScreen";

import { GameSettings, GameType } from "./types/GameSettings";
import { injectPreviewLexicon } from "@/data/injectPreviewLexicon";
import { isFirstLaunch } from "./services/firstLaunch";
import { initDatabase } from "@/db/database";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export type RootStackParamList = {
  Home: undefined;
  AddWord: undefined;
  Lexicon: undefined;
  ChooseSettings: { type: GameType };
  Quiz: { settings: GameSettings };
  Result: {
    score: number;
    total: number;
    settings: Pick<GameSettings, "type" | "inputMode" | "subType">;
  };
  Score: undefined;
  QuizList: undefined;
  SavedQuiz: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    initDatabase().catch(console.error);
    isFirstLaunch().then((firstTime) => {
      if (firstTime) {
        injectPreviewLexicon();
      }
    });
  }, []);

  const goHomeButton = (navigation: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Home")}
      style={{ marginLeft: 10 }}
    >
      <MaterialCommunityIcons
        name="home-circle"
        size={32}
        color="#fff"
      />
    </TouchableOpacity>
  );

  const screens: {
    name: keyof RootStackParamList;
    component: React.ComponentType<any>;
    title: string;
  }[] = [
      { name: "AddWord", component: AddWordScreen, title: "Ajouter un mot" },
      { name: "Lexicon", component: LexiconScreen, title: "Réviser" },
      { name: "ChooseSettings", component: ChooseSettingsScreen, title: "Paramètres du jeu" },
      { name: "Score", component: ScoreScreen, title: "Mes scores" },
      { name: "QuizList", component: QuizListScreen, title: "Types de quiz" },
      { name: "SavedQuiz", component: SavedQuizScreen, title: "Quiz enregistrés" },
    ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: "#9da7ff" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "",
              headerLeft: () => null,
              headerRight: () => null,
              headerTitle: () => null,
            }}
          />
          {screens.map(({ name, component, title }) => (
            <Stack.Screen
              key={name}
              name={name}
              component={component}
              options={({ navigation }) => ({
                title,
                headerLeft: () => goHomeButton(navigation),
                headerTitle: () => (
                  <TouchableOpacity onPress={() => navigation.navigate("Home")} style={{ marginLeft: 10 }}>
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
                      {title}
                    </Text>
                  </TouchableOpacity>
                ),
              })}
            />
          ))}
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
            options={{
              headerTitle: "",
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{
              headerTitle: "",
              headerLeft: () => null,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}