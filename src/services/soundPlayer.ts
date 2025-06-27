import { useAudioPlayer } from "expo-audio";

export function playSound(file: any) {
    const player = useAudioPlayer(file);
    player.play();
}