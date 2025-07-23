import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SubTitle from "../SubTitle";
import { alphabetLesson } from "@/services/lessons";

interface VowelGroup {
  name: string;
  description: string;
  vowels: string;
}

export default function VowelGroups() {
  const vowelGroups: VowelGroup[] = [
    {
      name: alphabetLesson.chapters[1].basic ?? "",
      description: alphabetLesson.chapters[1].basicSound ?? "",
      vowels: "ㅏ (a), ㅓ (eo), ㅗ (o), ㅜ (u), ㅡ (eu), ㅣ (i)",
    },
    {
      name: alphabetLesson.chapters[1].complex ?? "",
      description: alphabetLesson.chapters[1].complexSound ?? "",
      vowels: "ㅐ (ae), ㅔ (e), ㅚ (oe), ㅟ (wi), ㅢ (ui)",
    },
    {
      name: alphabetLesson.chapters[1].double ?? "",
      description: alphabetLesson.chapters[1].doubleSound ?? "",
      vowels: "ㅑ (ya), ㅕ (yeo), ㅛ (yo), ㅠ (yu)",
    },
  ];

  return (
    <View style={{ marginTop: 12 }}>
      <SubTitle label={alphabetLesson.chapters[1].vowelGroupTitle ?? ''} />
      <Text>
        {alphabetLesson.chapters[1].vowelGroupIntro}
      </Text>
      {vowelGroups.map((group) => (
        <Text key={group.name} style={{ marginTop: 8 }}>
          <Text style={styles.groupName}>{group.name} :</Text>{" "}
          {group.description} {alphabetLesson.chapters[1].vowels} {group.vowels}.
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
