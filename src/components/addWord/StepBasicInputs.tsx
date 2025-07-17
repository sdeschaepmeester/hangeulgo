import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { checkIfKoreanWordExists } from "@/services/lexicon";
import { suggestKoreanTranslation } from "@/services/translator";
import i18n from "@/i18n";
import colors from "@/constants/colors";
import { useFocusEffect } from "@react-navigation/native";

type Props = {
    data: any;
    setData: React.Dispatch<React.SetStateAction<any>>;
};

const MIN_DELAY = 10000;

export default function StepBasicInputs({ data, setData }: Props) {
    const [isConnected, setIsConnected] = useState(false);
    const [koSuggested, setKoSuggested] = useState<string | null>(null);
    const [loadingSuggestion, setLoadingSuggestion] = useState(false);
    const [noSuggestionFound, setNoSuggestionFound] = useState(false);
    const [lastSuggestionTime, setLastSuggestionTime] = useState<number | null>(null);
    const [koreanExists, setKoreanExists] = useState(false);
    const [showWarningWrongKorean, setShowWarningWrongKorean] = useState(false);

    const frRef = useRef<TextInput>(null);
    const koRef = useRef<TextInput>(null);
    const phoneticRef = useRef<TextInput>(null);

    const cooldownActive =
        lastSuggestionTime !== null && Date.now() - lastSuggestionTime < MIN_DELAY;

    useEffect(() => {
        NetInfo.fetch().then((state) => {
            setIsConnected(state.isConnected === true);
        });
    }, []);

    useEffect(() => {
        if (cooldownActive) {
            const timeout = setTimeout(() => {
                setLastSuggestionTime(null);
            }, MIN_DELAY - (Date.now() - (lastSuggestionTime ?? 0)));
            return () => clearTimeout(timeout);
        }
    }, [cooldownActive, lastSuggestionTime]);

    useFocusEffect(
        React.useCallback(() => {
            if (!data.native.trim()) {
                const timeout = setTimeout(() => {
                    frRef.current?.focus();
                }, 300);
                return () => clearTimeout(timeout);
            }
        }, [data.native])
    );

    const handleKoreanSuggestion = async () => {
        if (!data.native.trim() || !isConnected || cooldownActive) return;

        setLastSuggestionTime(Date.now());
        setLoadingSuggestion(true);
        setNoSuggestionFound(false);

        const suggestion = await suggestKoreanTranslation(data.native.trim());
        setLoadingSuggestion(false);

        if (suggestion) {
            setKoSuggested(suggestion);
        } else {
            setNoSuggestionFound(true);
        }
    };

    const handleKoBlur = async () => {
        const trimmed = data.ko.trim();
        if (!trimmed) {
            setKoreanExists(false);
            return;
        }

        const exists = await checkIfKoreanWordExists(trimmed);
        setKoreanExists(exists);

        const hasHangul = /[가-힣]/.test(trimmed);
        setShowWarningWrongKorean(!hasHangul);
    };

    return (
        <View style={styles.form}>
            {/* ----------------- Native input ----------------- */}
            <View style={styles.field}>
                <Text style={styles.label}>{i18n.t("flag")} {i18n.t("nativeLang")}</Text>
                <TextInput
                    ref={frRef}
                    value={data.native}
                    onChangeText={(text) => {
                        if (text.length <= 50) {
                            setData((prev: any) => ({ ...prev, native: text }));
                            setKoSuggested(null);
                        }
                    }}
                    style={[styles.input, { backgroundColor: colors.neutral.white }]}
                    placeholder={i18n.t("addWord.egfrinput")}
                    placeholderTextColor={colors.neutral.main}
                    returnKeyType="next"
                    onSubmitEditing={() => koRef.current?.focus()}
                />
            </View>

            {/* ----------------- Azure suggestion ----------------- */}
            {isConnected && data.native.trim().length > 0 && (
                <>
                    {!koSuggested && !noSuggestionFound && (
                        <TouchableOpacity
                            style={[
                                styles.suggestionButton,
                                (loadingSuggestion || cooldownActive) && { opacity: 0.5 },
                            ]}
                            onPress={handleKoreanSuggestion}
                            disabled={loadingSuggestion || cooldownActive}
                        >
                            <Text style={styles.suggestionText}>
                                {loadingSuggestion
                                    ? i18n.t("addWord.searching")
                                    : cooldownActive
                                        ? i18n.t("addWord.waitBeforeAction")
                                        : i18n.t("addWord.suggestion")}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {noSuggestionFound && !loadingSuggestion && (
                        <Text style={styles.warningText}>❌ {i18n.t("addWord.noSuggestionFound")}</Text>
                    )}
                    {koSuggested && !loadingSuggestion && (
                        <TouchableOpacity
                            onPress={async () => {
                                setData((prev: any) => ({ ...prev, ko: koSuggested }));
                                setKoSuggested(null);
                                const exists = await checkIfKoreanWordExists(koSuggested);
                                setKoreanExists(exists);
                            }}
                        >
                            <Text style={styles.suggestionBox}>
                                👉 {i18n.t("addWord.tapToFill")} {koSuggested}
                            </Text>
                        </TouchableOpacity>
                    )}
                </>
            )}

            {/* ----------------- Korean input ----------------- */}
            <View style={styles.field}>
                <Text style={styles.label}>🇰🇷 {i18n.t("addWord.koinput")}</Text>
                <TextInput
                    ref={koRef}
                    value={data.ko}
                    onChangeText={(text) => {
                        if (text.length <= 50) {
                            setData((prev: any) => ({ ...prev, ko: text }));
                            setKoreanExists(false);
                        }
                    }}
                    onBlur={handleKoBlur}
                    style={[styles.input, { backgroundColor: colors.neutral.white }]}
                    placeholder={i18n.t("addWord.egkorean")}
                    placeholderTextColor={colors.neutral.main}
                    returnKeyType="next"
                    onSubmitEditing={() => phoneticRef.current?.focus()}
                />
                {koreanExists && (
                    <Text style={styles.warningText}>
                        {i18n.t("addWord.wordExists")}
                    </Text>
                )}
                {showWarningWrongKorean && (
                    <Text style={styles.warningText}>
                        {i18n.t("addWord.mustContainKorean")}
                    </Text>
                )}
            </View>

            {/* ----------------- Phonetic input ----------------- */}
            <View style={styles.field}>
                <Text style={styles.label}>{i18n.t("addWord.phonetic")}</Text>
                <TextInput
                    ref={phoneticRef}
                    value={data.phonetic}
                    onChangeText={(text) => {
                        if (text.length <= 50) {
                            setData((prev: any) => ({ ...prev, phonetic: text }));
                        }
                    }}
                    style={[styles.input, { backgroundColor: colors.neutral.white }]}
                    placeholder={i18n.t("addWord.phoneticPlaceholder")}
                    placeholderTextColor={colors.neutral.main}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    form: { gap: 16 },
    field: { gap: 6 },
    label: { fontWeight: "bold", fontSize: 14 },
    input: {
        borderWidth: 1,
        borderColor: colors.neutral.light,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
    },
    suggestionButton: {
        alignSelf: "flex-start",
        backgroundColor: colors.neutral.light,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        marginTop: -10,
        marginBottom: 6,
    },
    suggestionText: {
        color: colors.neutral.darker,
        fontSize: 14,
    },
    suggestionBox: {
        backgroundColor: colors.neutral.lighter,
        padding: 8,
        borderRadius: 6,
        marginBottom: 8,
        fontStyle: "italic",
    },
    warningText: {
        color: colors.danger.main,
        marginTop: 4,
        fontSize: 13,
        fontStyle: "italic",
    },
});
