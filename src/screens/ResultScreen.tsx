import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { saveScore } from "@/services/score";

const { width } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

export default function ResultScreen({ route, navigation }: Props) {
  const { score, total, settings } = route.params;
  const percent = Math.round((score / total) * 100);

  useEffect(() => {
    saveScore({
      score,
      total,
      type: settings.type,
      inputMode: settings.inputMode ?? "multiple",
    });
  }, []);

  let medal = require("../../assets/bronze_medal.png");
  let message = "Continue comme ça !";
  let glowColor = "#cd7f32";

  if (percent === 0) {
    medal = require("../../assets/terrible.png");
    message = "Non là tu le fais exprès ?";
  }
  if (percent >= 80) {
    medal = require("../../assets/gold_medal.png");
    message = "Super !";
    glowColor = "#ffd700";
  } else if (percent >= 60) {
    medal = require("../../assets/silver_medal.png");
    message = "Bien !";
    glowColor = "#c0c0c0";
  }

  const glow = useSharedValue(0);
  glow.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);

  const glowStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      glow.value,
      [0, 1],
      ["#ffffff00", glowColor + "66"]
    );
    return {
      backgroundColor,
    };
  });

  return (
    <ImageBackground
      source={require("../../assets/bg_pattern.png")}
      resizeMode="repeat"
      style={styles.container}
    >
      <View style={styles.medalWrapper}>
        <Animated.View style={[styles.glow, glowStyle]} />
        <Image source={medal} style={styles.medal} resizeMode="contain" />
      </View>

      <Text style={styles.message}>{message}</Text>

      <View style={styles.bubble}>
        <Text style={styles.score}>
          {score} / {total}
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={[styles.button, styles.retry]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Rejouer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.quit]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Quitter</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  medalWrapper: {
    marginTop: 40,
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
  },
  medal: {
    width: 250,
    height: 250,
    zIndex: 1,
  },
  message: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
  },
  bubble: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    marginTop: 20,
  },
  score: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
    marginTop: 50,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  retry: {
    backgroundColor: "#9da7ff",
  },
  quit: {
    backgroundColor: "#ff9d9d",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
