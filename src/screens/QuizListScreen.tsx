import React from "react";
import {
    FlatList,
    View,
    StyleSheet,
    Dimensions,
    ListRenderItem,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MainLayout from "@/layouts/MainLayout";
import SquareButton from "@/components/SquareButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import { useNavigation } from "@react-navigation/native";
import type { GameType } from "@/types/GameSettings";

const screenWidth = Dimensions.get("window").width;
const BUTTON_WIDTH = (screenWidth - 60) / 2;

import type { ComponentProps } from "react";
type QuizItem = {
    label: string;
    icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
    color: string;
    type: GameType;
};

const quizList: QuizItem[] = [
    {
        label: "Compréhension",
        icon: "eye",
        color: "#f6c6c6",
        type: "comprehension",
    },
    {
        label: "Écoute",
        icon: "ear-hearing",
        color: "#f6c6c6",
        type: "ecoute",
    },
    {
        label: "Arrangement",
        icon: "format-align-center",
        color: "#c6cbf6",
        type: "arrangement",
    },
    {
        label: "Écriture",
        icon: "pencil",
        color: "#c6cbf6",
        type: "ecriture",
    },

];

export default function QuizListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const renderItem: ListRenderItem<QuizItem> = ({ item, index }) => {
        return (
            <View
                style={[
                    styles.buttonContainer,
                    index % 2 === 0 ? { marginRight: 20 } : {},
                ]}
            >
                <SquareButton
                    icon={<MaterialCommunityIcons name={item.icon} style={styles.icon} />}
                    label={item.label}
                    bgColor={item.color}
                    onClick={() =>
                        navigation.navigate("ChooseSettings", {
                            type: item.type,
                        })
                    }
                />
            </View>
        );
    };

    return (
        <MainLayout>
            <FlatList
                data={quizList}
                keyExtractor={(item) => item.label}
                numColumns={2}
                renderItem={renderItem}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
            />
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingTop: 20,
        paddingBottom: 40,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    buttonContainer: {
        width: BUTTON_WIDTH,
    },
    icon: {
        fontSize: 22,
        color: "#595959",
    },
});
