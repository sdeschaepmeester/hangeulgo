import { View, Text, StyleSheet } from 'react-native';

interface ExampleBoxProps {
    text: string;
    label?: string;
    centered?: boolean;
}

export const ExampleBox: React.FC<ExampleBoxProps> = ({ text, label, centered }) => (
    <View style={[styles.exampleContainer, centered && styles.centered]}>
        <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>{text}</Text>
        </View>
        {label && <Text style={[styles.exampleLabel, centered && styles.labelCentered]}>{label}</Text>}
    </View>
);

const styles = StyleSheet.create({
    exampleContainer: {
        alignItems: 'flex-start',
        marginRight: 8,
    },
    centered: {
        alignItems: 'center',
    },
    exampleBox: {
        width: 48,
        height: 48,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 4,
    },
    exampleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    exampleLabel: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#555',
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    labelCentered: {
        alignSelf: 'center',
    },
});
