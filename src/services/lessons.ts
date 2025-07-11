import frAlphabet from "@/i18n/lessons/alphabet/fr.json";
import enAlphabet from "@/i18n/lessons/alphabet/en.json";
import i18n from "@/i18n";

const translations = {
    alphabet: {
        fr: frAlphabet.lessons.alphabet,
        en: enAlphabet.lessons.alphabet,
    },
};

export function getLessonTranslation(lessonId: keyof typeof translations) {
    const locale = i18n.locale;
    const lessonTranslations = translations[lessonId];

    if (!lessonTranslations) {
        return null;
    }

    const supportedLocales = ['fr', 'en'] as const;
    type SupportedLocale = typeof supportedLocales[number];
    const currentLocale = supportedLocales.includes(locale as SupportedLocale) ? (locale as SupportedLocale) : 'fr';
    return lessonTranslations[currentLocale];
}
