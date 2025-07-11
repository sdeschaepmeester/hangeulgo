import i18n from "@/i18n";

import frAlphabet from "@/i18n/lessons/alphabet/fr.json";
import enAlphabet from "@/i18n/lessons/alphabet/en.json";
import frSyllable from "@/i18n/lessons/syllable/fr.json";
import enSyllable from "@/i18n/lessons/syllable/en.json";

export const alphabetLesson =
    i18n.locale === "fr"
        ? frAlphabet.lessons.alphabet
        : enAlphabet.lessons.alphabet;

export const syllableLesson =
    i18n.locale === "fr"
        ? frSyllable.lessons.syllable
        : enSyllable.lessons.syllable;
