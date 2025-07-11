'use client';

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import VowelGroups from './VowelGroups';
import SubTitle from '../SubTitle';
import { getLessonTranslation } from '@/services/lessons';
import LetterItem from './LetterItem';

interface Props {}

interface Vowel {
  symbol: string;
  name: string;
}

const vowelsData: Vowel[] = [
  { symbol: 'ㅏ', name: 'A' },
  { symbol: 'ㅑ', name: 'Ya' },
  { symbol: 'ㅓ', name: 'Eo' },
  { symbol: 'ㅕ', name: 'Yeo' },
  { symbol: 'ㅗ', name: 'O' },
  { symbol: 'ㅛ', name: 'Yo' },
  { symbol: 'ㅜ', name: 'U' },
  { symbol: 'ㅠ', name: 'Yu' },
  { symbol: 'ㅡ', name: 'Eu' },
  { symbol: 'ㅣ', name: 'I' },
  { symbol: 'ㅐ', name: 'Ae' },
  { symbol: 'ㅔ', name: 'E' },
];

export const VowelsComponent: React.FC<Props> = () => {
  const localLesson = getLessonTranslation("alphabet");
  if (!localLesson) {
    throw new Error("No translation found for alphabet lesson.");
  }

  return (
    <View style={styles.container}>
      {/* ------------------------ What you learn ------------------------ */}
      <Text style={{ fontStyle: "italic", marginBottom: 8 }}>
        {localLesson.chapters[1].description}
      </Text>

      {/* ------------------------ Vowels groups ------------------------ */}
      <VowelGroups />

      {/* ------------------------ Vowels list ------------------------ */}
      <View style={{ marginTop: 12 }}>
        <SubTitle label={localLesson.chapters[1].vowelTitle ?? ''} />
        <Text>
          {localLesson.chapters[1].vowelIntro}
        </Text>
        <View style={styles.list}>
          {vowelsData.map((v) => (
            <LetterItem
              key={v.symbol}
              symbol={v.symbol}
              name={v.name}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 12,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
