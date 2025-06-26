import React from "react";
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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SplashScreen from "./screens/SplashScreen";
import ChooseLanguageScreen from "./screens/ChooseLanguageScreen";
import TesterDaysNumberCard from "./components/test/TesterDaysNumberCard";
import ParametersScreen from "./screens/ParametersScreen";
import i18n from "./i18n";

export type RootStackParamList = {
  Home: undefined;
  Splash: undefined;
  ChooseLanguage: undefined;
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
  Parameters: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

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

  const goSettingsButton = (navigation: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Parameters")}
      style={{ marginRight: 10 }}
    >
      <MaterialCommunityIcons name="cog" size={26} color="#fff" />
    </TouchableOpacity>
  );

  const screens: {
    name: keyof RootStackParamList;
    component: React.ComponentType<any>;
    titleKey: string;
  }[] = [
      { name: "AddWord", component: AddWordScreen, titleKey: "screens.addWord" },
      { name: "Lexicon", component: LexiconScreen, titleKey: "screens.lexicon" },
      { name: "ChooseSettings", component: ChooseSettingsScreen, titleKey: "screens.chooseSettings" },
      { name: "Score", component: ScoreScreen, titleKey: "screens.scores" },
      { name: "QuizList", component: QuizListScreen, titleKey: "screens.quizTypes" },
      { name: "SavedQuiz", component: SavedQuizScreen, titleKey: "screens.savedQuiz" },
    ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerStyle: { backgroundColor: "#9da7ff" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              headerLeft: () => (
                <TesterDaysNumberCard /> //! To remove once tests are done
              ),
              title: "",
              headerRight: () => goSettingsButton(navigation),
            })}
          />
          <Stack.Screen name="ChooseLanguage" component={ChooseLanguageScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Parameters" component={ParametersScreen}
            options={({ navigation }) => ({
              headerLeft: () => goHomeButton(navigation),
              headerRight: () => null,
              headerTitle: () => (
                <TouchableOpacity onPress={() => navigation.navigate("Home")} style={{ marginLeft: 10 }}>
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
                    Paramètres
                  </Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ headerTitle: "", headerLeft: () => null, }} />
          <Stack.Screen name="Result" component={ResultScreen} options={{ headerTitle: "", headerLeft: () => null, }} />
          {screens.map(({ name, component, titleKey }) => (
            <Stack.Screen
              key={name}
              name={name}
              component={component}
              options={({ navigation }) => ({
                headerLeft: () => goHomeButton(navigation),
                headerRight: () => goSettingsButton(navigation),
                headerTitle: () => (
                  <TouchableOpacity onPress={() => navigation.navigate("Home")} style={{ marginLeft: 10 }}>
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
                      {i18n.t(titleKey)}
                    </Text>
                  </TouchableOpacity>
                ),
              })}
            />
          ))}

        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}