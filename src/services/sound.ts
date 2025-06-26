import * as SecureStore from "expo-secure-store";
import { Audio } from "expo-av";

const SOUND_KEY = "soundEnabled";

export async function playSoundIfEnabled(file: number) {
    const enabled = await isSoundEnabled();
    if (!enabled) return;

    const { sound } = await Audio.Sound.createAsync(file);
    await sound.playAsync();
}


export async function setSoundEnabled(enabled: boolean) {
    await SecureStore.setItemAsync(SOUND_KEY, JSON.stringify(enabled));
}

export async function isSoundEnabled(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(SOUND_KEY);
    return value === null ? true : JSON.parse(value);
}
