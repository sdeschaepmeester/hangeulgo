import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import fr from "./fr.json";
import en from "./en.json";

const i18n = new I18n({
    fr,
    en,
});

// First prefered language of user
const deviceLang = Localization.getLocales()[0]?.languageCode ?? "en";

i18n.defaultLocale = "en";
i18n.enableFallback = true;
//i18n.locale = deviceLang; //! TODO REMOVE AFTER DEV
i18n.locale = "en"; //! TODO REMOVE AFTER DEV

export default i18n;
