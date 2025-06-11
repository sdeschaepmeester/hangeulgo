import { View, Text, StyleSheet } from "react-native";

type SectionCardGameProps = {
    title: string;
    children: React.ReactNode;
};

const SectionCardGame = ({ title, children }: SectionCardGameProps) => (
    <>
        <Text style={styles.section}>{title}</Text>
        <View style={styles.buttonRow}>{children}</View>
    </>
);

const styles = StyleSheet.create({
    section: {
        fontSize: 18,
        marginVertical: 10,
        fontWeight: "600",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
});

export default SectionCardGame;