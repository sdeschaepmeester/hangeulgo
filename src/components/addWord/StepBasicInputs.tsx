import React, { useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, Keyboard } from "react-native";
import { checkIfKoreanWordExists } from "@/services/lexicon";
import i18n from "@/i18n";
import colors from "@/constants/colors";
import { useFocusEffect } from "@react-navigation/native";

type Props = {
    data: any;
    setData: React.Dispatch<React.SetStateAction<any>>;
};

export default function StepBasicInputs({ data, setData }: Props) {
    const [koreanExists, setKoreanExists] = useState(false);
    const [showWarningWrongKorean, setShowWarningWrongKorean] = useState(false);

    const frRef = useRef<TextInput>(null);
    const koRef = useRef<TextInput>(null);
    const phoneticRef = useRef<TextInput>(null);

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
                        }
                    }}
                    style={[styles.input, { backgroundColor: colors.neutral.white }]}
                    placeholder={i18n.t("addWord.egfrinput")}
                    placeholderTextColor={colors.neutral.main}
                    returnKeyType="next"
                    onSubmitEditing={() => koRef.current?.focus()}
                />
            </View>
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
    warningText: {
        color: colors.danger.main,
        marginTop: 4,
        fontSize: 13,
        fontStyle: "italic",
    },
});
