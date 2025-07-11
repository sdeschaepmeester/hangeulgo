import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SubTitle from "../SubTitle";
import { getLessonTranslation } from "@/services/lessons";

interface VowelGroup {
  name: string;
  description: string;
  vowels: string;
}

export default function VowelGroups() {
  const localLesson = getLessonTranslation("alphabet");
  if (!localLesson) {
    throw new Error("No translation found for alphabet lesson.");
  }

  const vowelGroups: VowelGroup[] = [
    {
      name: localLesson.chapters[1].basic ?? "",
      description: localLesson.chapters[1].basicSound ?? "",
      vowels: "ㅏ (a), ㅓ (eo), ㅗ (o), ㅜ (u), ㅡ (eu), ㅣ (i)",
    },
    {
      name: localLesson.chapters[1].complex ?? "",
      description: localLesson.chapters[1].complexSound ?? "",
      vowels: "ㅐ (ae), ㅔ (e), ㅚ (oe), ㅟ (wi), ㅢ (ui)",
    },
    {
      name: localLesson.chapters[1].double ?? "",
      description: localLesson.chapters[1].doubleSound ?? "",
      vowels: "ㅑ (ya), ㅕ (yeo), ㅛ (yo), ㅠ (yu)",
    },
  ];

  return (
    <View style={{ marginTop: 12 }}>
      <SubTitle label={localLesson.chapters[1].vowelGroupTitle ?? ''} />
      <Text>
        {localLesson.chapters[1].vowelGroupIntro}
      </Text>
      {vowelGroups.map((group) => (
        <Text key={group.name} style={{ marginTop: 8 }}>
          <Text style={styles.groupName}>{group.name} :</Text>{" "}
          {group.description} {localLesson.chapters[1].vowels} {group.vowels}.
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  groupName: {
    fontWeight: "bold",
  },
});
