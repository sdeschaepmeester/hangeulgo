import * as SecureStore from 'expo-secure-store';

/**
 * This function is to be REMOVED after the test are done. It's used for tester to save the app's installation date.
 */
export async function saveDateInstallation(): Promise<void> {
    const existing = await SecureStore.getItemAsync("installationDate");
    if (!existing) {
        await SecureStore.setItemAsync("installationDate", new Date().toISOString());
    }
}

/**
 * This function is to be REMOVED after the test are done. It's used for tester to show them how many days they've been testing the app.
 */
export const getDaysSinceInstall = async (): Promise<number | null> => {
    const iso = await SecureStore.getItemAsync("installationDate");
    if (!iso) return null;
    const installDate = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - installDate.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};
