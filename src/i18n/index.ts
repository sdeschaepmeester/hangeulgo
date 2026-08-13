import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import fr from "./fr.json";
import en from "./en.json";

const i18n = new I18n({
    fr,
    en,
});

i18n.defaultLocale = "en";
i18n.enableFallback = true;

// Check if user has already set the language
export async function initI18n(): Promise<void> {
    const storedLang = await SecureStore.getItemAsync("userLang");

    if (storedLang === "fr" || storedLang === "en") {
        i18n.locale = storedLang;
        return;
    }

    // Check locale phone language. If not implemented, choose english.
    const deviceLang = Localization.getLocales()[0]?.languageCode;
    if (deviceLang === "fr" || deviceLang === "en") {
        i18n.locale = deviceLang;
    } else {
        i18n.locale = "en";
    }
}

// Change language
export async function setAppLanguage(lang: "fr" | "en"): Promise<void> {
    i18n.locale = lang;
    await SecureStore.setItemAsync("userLang", lang);
}

export default i18n;