import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import FilterBar from "@/components/FilterBar";
import { dbPromise } from "@/db/database";
import { Difficulty } from "@/types/Difficulty";
import type { LexiconEntry } from "@/types/LexiconEntry";

export default function LexiconScreen() {
  const [lexicon, setLexicon] = useState<LexiconEntry[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);

  const fetchLexicon = async () => {
    const db = await dbPromise;

    let query = "SELECT * FROM lexicon";
    const conditions: string[] = [];
    const params: any[] = [];

    if (selectedDifficulties.length > 0) {
      conditions.push(
        `difficulty IN (${selectedDifficulties.map(() => "?").join(",")})`
      );
      params.push(...selectedDifficulties);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += ` ORDER BY fr COLLATE NOCASE ${sortOrder.toUpperCase()}`;

    const rows = await db.getAllAsync<LexiconEntry>(query, ...params);
    setLexicon(rows);
  };

  useEffect(() => {
    fetchLexicon().catch(console.error);
  }, [selectedDifficulties, sortOrder]);

  const toggleActive = async (id: number, current: number) => {
    const db = await dbPromise;
    await db.runAsync("UPDATE lexicon SET active = ? WHERE id = ?", current ? 0 : 1, id);
    fetchLexicon();
  };

  const deleteWord = async (id: number) => {
    Alert.alert("Supprimer", "Confirmer la suppression ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          const db = await dbPromise;
          await db.runAsync("DELETE FROM lexicon WHERE id = ?", id);
          fetchLexicon();
        },
      },
    ]);
  };

  const onToggleDifficulty = (diff: Difficulty) => {
    setSelectedDifficulties((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
    );
  };

  const onToggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
        <Text style={styles.toggleFilters}>
          {showFilters ? "Masquer les filtres ▲" : "Afficher les filtres ▼"}
        </Text>
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Tri par difficulté</Text>
          <FilterBar
            selectedDifficulties={selectedDifficulties}
            onToggleDifficulty={onToggleDifficulty}
            sortOrder={sortOrder}
            onToggleSortOrder={onToggleSortOrder}
          />
        </View>
      )}

      <Text style={styles.title}>Lexique</Text>

      <FlatList
        data={lexicon}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fr, { color: difficultyColor(item.difficulty) }]}>{item.fr}</Text>
              <Text style={styles.phonetic}>{item.phonetic}</Text>
              <Text style={styles.ko}>{item.ko}</Text>
            </View>
            <View style={styles.controlsRow}>
              <Switch
                value={item.active === 1}
                onValueChange={() => toggleActive(item.id, item.active)}
              />
              <Pressable onPress={() => deleteWord(item.id)}>
                <Text style={styles.delete}>🗑️</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

function difficultyColor(difficulty: string) {
  switch (difficulty) {
    case "easy":
      return "green";
    case "medium":
      return "orange";
    case "hard":
      return "red";
    default:
      return "black";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  toggleFilters: {
    textAlign: "right",
    color: "#007aff",
    marginBottom: 8,
    fontWeight: "500",
  },
  filtersContainer: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterLabel: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 100,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  fr: {
    fontSize: 16,
    fontWeight: "bold",
  },
  phonetic: {
    fontSize: 14,
    color: "#666",
  },
  ko: {
    fontSize: 16,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  delete: {
    fontSize: 20,
  },
});