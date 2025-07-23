import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import TagSelector from "@/components/tags/TagSelector";
import { getAllUniqueTags, isTagsLimitReached } from "@/services/tags";
import i18n from "@/i18n";
import colors from "@/constants/colors";
import type { FormData } from "@/types/FormData";

type Props = {
    data: FormData;
    setData: React.Dispatch<React.SetStateAction<FormData>>;
};

export default function StepThemes({ data, setData }: Props) {
    const [allTags, setAllTags] = useState<string[]>([]);
    const [tagLimitReached, setTagLimitReached] = useState(false);

    useEffect(() => {
        getAllUniqueTags().then(setAllTags);
        isTagsLimitReached().then(setTagLimitReached);
    }, []);

    return (
        <View style={styles.container}>
            {tagLimitReached && (
                <Text style={styles.warningText}>
                    {i18n.t("addWord.cannotCreateTheme")}
                </Text>
            )}

            <TagSelector
                mode={tagLimitReached ? "select" : "edit"}
                allTags={allTags}
                selectedTags={data.tags}
                onChange={(newTags) => setData((prev) => ({ ...prev, tags: newTags }))}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    warningText: {
        color: colors.warning.lighter,
        fontSize: 13,
    },
});