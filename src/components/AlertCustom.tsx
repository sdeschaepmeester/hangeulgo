import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, } from "react-native";
import type { ReactNode } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface AlertCustomProps {
    visible: boolean;
    icon: ReactNode;
    iconColor?: string;
    title: string;
    description: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function AlertCustom({ visible, icon, iconColor = "#333", title, description, onClose, onConfirm, confirmText = "Confirmer", cancelText = "Annuler", }: AlertCustomProps) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={styles.container}>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <MaterialCommunityIcons name="close" size={22} color="#999" />
                            </TouchableOpacity>

                            <View style={[styles.iconCircle, { borderColor: iconColor }]}>
                                {icon}
                            </View>

                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.description}>{description}</Text>

                            {onConfirm ? (
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        onPress={onClose}
                                        style={[styles.button, styles.cancel]}
                                    >
                                        <Text style={styles.buttonText}>{cancelText}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={onConfirm}
                                        style={[styles.button, styles.confirm]}
                                    >
                                        <Text style={styles.buttonText}>{confirmText}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity onPress={onClose} style={styles.okButton}>
                                    <Text style={styles.okText}>Ok</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

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
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        alignSelf: "stretch",
    },
    button: {
        flex: 1,
        borderRadius: 6,
        paddingVertical: 12,
        alignItems: "center",
    },
    cancel: {
        backgroundColor: colors.error,
    },
    confirm: {
        backgroundColor: "#ff9d9d",
    },
    buttonText: {
        fontWeight: "bold",
        color: "white",
    },
});