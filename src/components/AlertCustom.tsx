import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
} from "react-native";
import type { ReactNode } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface AlertCustomProps {
    visible: boolean;
    icon: ReactNode;
    iconColor?: string;
    title: string;
    description: string;
    onClose: () => void;
}

export default function AlertCustom({
    visible,
    icon,
    iconColor = "#333",
    title,
    description,
    onClose,
}: AlertCustomProps) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close" size={22} color="#999" />
                    </TouchableOpacity>

                    <View style={[styles.iconCircle, { borderColor: "#ccc" }]}>
                        {icon}
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>

                    <TouchableOpacity onPress={onClose} style={styles.okButton}>
                        <Text style={styles.okText}>Ok</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    container: {
        width: "100%",
        maxWidth: 400,
        borderRadius: 12,
        backgroundColor: "#fff",
        padding: 24,
        alignItems: "center",
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 1,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#fff",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: "#555",
        textAlign: "left",
        alignSelf: "stretch",
        marginBottom: 24,
    },
    okButton: {
        backgroundColor: "#9da7ff",
        borderRadius: 6,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: "stretch",
    },
    okText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
});