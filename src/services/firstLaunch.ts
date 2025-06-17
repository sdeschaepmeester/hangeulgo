import * as SecureStore from "expo-secure-store";

const KEY = "hasLaunched";

// This function checks if the app is being launched for the first time.
// It's used so that we can inject a preview lexicon only on the first launch.
export async function isFirstLaunch(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(KEY);
    if (value === null) {
        await SecureStore.setItemAsync(KEY, "true");
        return true;
    }
    return false;
}
