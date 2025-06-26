import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import i18n from "@/i18n";
import { initDatabase } from "@/db/database";
import { isFirstLaunch } from "@/services/firstLaunch";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import { saveDateInstallation } from "@/services/tester";
import colors from "@/constants/colors";

export default function SplashScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const bootstrap = async () => {
            await initDatabase();
            const firstTime = await isFirstLaunch();
            const storedLang = await SecureStore.getItemAsync("userLang");
            // If first time launching the app or no language chosen, redirect.
            // Keep firsttime check, for future uses
            if (firstTime || !storedLang) {
                await saveDateInstallation(); //! To remove once the tests are done

                navigation.reset({
                    index: 0,
                    routes: [{ name: "ChooseLanguage" }],
                });
                return;
            }

            i18n.locale = storedLang;

            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
            });
        };

        bootstrap();
    }, []);


    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
    );
}