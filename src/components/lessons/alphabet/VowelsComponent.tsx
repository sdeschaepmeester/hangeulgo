import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import VowelGroups from './VowelGroups';
import SubTitle from '../SubTitle';
import LetterItem from './LetterItem';
import { alphabetLesson } from '@/services/lessons';

interface Props { }

interface Vowel {
  symbol: string;
  name: string;
  type: 'horizontal' | 'vertical';
}

const vowelsData: Vowel[] = [
  { symbol: 'ㅗ', name: 'O', type: 'horizontal' },
  { symbol: 'ㅛ', name: 'Yo', type: 'horizontal' },
  { symbol: 'ㅜ', name: 'U', type: 'horizontal' },
  { symbol: 'ㅠ', name: 'Yu', type: 'horizontal' },
  { symbol: 'ㅡ', name: 'Eu', type: 'horizontal' },

  { symbol: 'ㅏ', name: 'A', type: 'vertical' },
  { symbol: 'ㅑ', name: 'Ya', type: 'vertical' },
  { symbol: 'ㅓ', name: 'Eo', type: 'vertical' },
  { symbol: 'ㅕ', name: 'Yeo', type: 'vertical' },
  { symbol: 'ㅣ', name: 'I', type: 'vertical' },
  { symbol: 'ㅐ', name: 'Ae', type: 'vertical' },
  { symbol: 'ㅔ', name: 'E', type: 'vertical' },
];

export const VowelsComponent: React.FC<Props> = () => {
  const horizontalVowels = vowelsData.filter((v) => v.type === 'horizontal');
  const verticalVowels = vowelsData.filter((v) => v.type === 'vertical');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ------------------------ What you learn ------------------------ */}
      <Text style={{ fontStyle: 'italic', marginBottom: 8 }}>
        {alphabetLesson.chapters[1].description}
      </Text>

      {/* ------------------------ Vowels groups ------------------------ */}
      <VowelGroups />

      {/* ------------------------ Vowels list ------------------------ */}
      <View style={{ marginTop: 12 }}>
        <SubTitle label={alphabetLesson.chapters[1].vowelTitle ?? ''} />
        <Text>{alphabetLesson.chapters[1].vowelIntro}</Text>

        {/* -------- Horizontal -------- */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>{alphabetLesson.chapters[1].horizontalTitle}</Text>
          <Text>{alphabetLesson.chapters[1].horizontalDescription}</Text>
          <View style={styles.list}>
            {horizontalVowels.map((v) => (
              <LetterItem key={v.symbol} symbol={v.symbol} name={v.name} />
            ))}
          </View>
        </View>

        {/* -------- Vertical -------- */}
        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionTitle}>{alphabetLesson.chapters[1].verticalTitle}</Text>
          <Text>{alphabetLesson.chapters[1].verticalDescription}</Text>
          <View style={styles.list}>
            {verticalVowels.map((v) => (
              <LetterItem key={v.symbol} symbol={v.symbol} name={v.name} />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
});
