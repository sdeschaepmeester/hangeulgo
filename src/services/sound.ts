import { useAudioPlayer } from "expo-audio";
import * as SecureStore from "expo-secure-store";

const SOUND_KEY = "soundEnabled";

export function playSoundIfEnabled(file: any) {
    const player = useAudioPlayer(file);
    SecureStore.getItemAsync(SOUND_KEY).then(value => {
        const enabled = value === null ? true : JSON.parse(value);
        if (enabled) player.play();
    });
}

export async function setSoundEnabled(enabled: boolean) {
    await SecureStore.setItemAsync(SOUND_KEY, JSON.stringify(enabled));
}