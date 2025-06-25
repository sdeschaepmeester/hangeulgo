import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import i18n from "@/i18n";
import { dbPromise, initDatabase } from "@/db/database";
import { isFirstLaunch } from "@/services/firstLaunch";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import { injectPreviewLexicon } from "@/data/injectPreviewLexicon";

export default function SplashScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const bootstrap = async () => {
//             const db = await dbPromise;//! TODO REMOVE AFTER DEBUG
//             await db.execAsync(`
//   DROP TABLE IF EXISTS lexicon_tags;
//   DROP TABLE IF EXISTS saved_quiz;
//   DROP TABLE IF EXISTS lexicon;
// `);//! TODO REMOVE AFTER DEBUG
            await initDatabase();//! KEEP
            //await injectPreviewLexicon(); //! TODO REMOVE AFTER DEBUG
            const firstTime = await isFirstLaunch();
            if (firstTime) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "ChooseLanguage" }],
                });
                return;
            }

            const storedLang = await SecureStore.getItemAsync("userLang");
            if (storedLang) {
                i18n.locale = storedLang;
            }

            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
            });
        };

        bootstrap();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#9da7ff" />
        </View>
    );
}