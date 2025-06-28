import { Vibration } from "react-native";
import * as SecureStore from "expo-secure-store";

const SOUND_KEY = "soundEnabled";

export async function playFeedbackIfEnabled(type: "correct" | "wrong" = "correct") {
    const enabled = await isSoundEnabled();
    if (!enabled) return;

    if (type === "correct") {
        Vibration.vibrate(50); 
    } else if (type === "wrong") {
        Vibration.vibrate([0, 50, 50, 50]); 
    }
}

export async function setSoundEnabled(enabled: boolean) {
    await SecureStore.setItemAsync(SOUND_KEY, JSON.stringify(enabled));
}

export async function isSoundEnabled(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(SOUND_KEY);
    return value === null ? true : JSON.parse(value);
}
