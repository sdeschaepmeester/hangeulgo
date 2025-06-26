import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import i18n from "@/i18n";
import colors from "@/constants/colors";

export default function NavBar() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();
    const route = useRoute();
    const currentRoute = route.name;

    const hiddenRoutes = ["Quiz", "Result"];
    if (hiddenRoutes.includes(currentRoute)) return null;

    const height = 60 + insets.bottom;

    return (
        <View style={[styles.navbar, { height, paddingBottom: insets.bottom }]}>
            <NavItem
                route="Home"
                icon="home"
                label={i18n.t("navbar.home")}
                currentRoute={currentRoute}
                onPress={() => navigation.navigate("Home")}
            />
            <NavItem
                route="Lexicon"
                icon="book-open-page-variant"
                label={i18n.t("navbar.lexicon")}
                currentRoute={currentRoute}
                onPress={() => navigation.navigate("Lexicon")}
            />
            <NavItem
                route="AddWord"
                icon="plus-circle"
                label={i18n.t("navbar.addWord")}
                currentRoute={currentRoute}
                onPress={() => navigation.navigate("AddWord")}
            />
            <NavItem
                route="QuizList"
                icon="gamepad-variant"
                label={i18n.t("navbar.play")}
                currentRoute={currentRoute}
                onPress={() => navigation.navigate("QuizList")}
            />
        </View>
    );
}

type NavItemProps = {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    route: string;
    currentRoute: string;
    onPress: () => void;
};

const NavItem = ({ icon, label, route, currentRoute, onPress }: NavItemProps) => {
    const isActive = route === currentRoute;

    return (
        <TouchableOpacity style={styles.navItem} onPress={onPress}>
            <MaterialCommunityIcons
                name={icon}
                size={24}
                color={isActive ? colors.primary.dark : colors.neutral.main}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    navbar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        justifyContent: "space-around",
        alignItems: "center",
    },
    navItem: {
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        fontSize: 12,
        color: colors.neutral.main,
        marginTop: 2,
        fontWeight: "normal",
    },
    activeLabel: {
        color: colors.primary.dark,
        fontWeight: "bold",
    },
});
