import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Switch,
  Pressable,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
} from "react-native";
import FilterBar from "@/components/FilterBar";
import { dbPromise } from "@/db/database";
import { Difficulty } from "@/types/Difficulty";
import type { LexiconEntry } from "@/types/LexiconEntry";
import AlertCustom from "@/components/AlertCustom";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NavBar from "@/components/NavBar";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function LexiconScreen() {
  const [lexicon, setLexicon] = useState<LexiconEntry[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [keywordFilter, setKeywordFilter] = useState("");
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const fetchLexicon = async () => {
    const db = await dbPromise;

    const whereClauses: string[] = [];
    const params: any[] = [];

    if (selectedDifficulties.length > 0) {
      whereClauses.push(`l.difficulty IN (${selectedDifficulties.map(() => "?").join(",")})`);
      params.push(...selectedDifficulties);
    }

    if (keywordFilter.trim()) {
      whereClauses.push(`t.tag LIKE ?`);
      params.push(`%${keywordFilter.trim()}%`);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const rows = await db.getAllAsync<(LexiconEntry & { tags: string | null })>(
      `
    SELECT l.*, GROUP_CONCAT(t.tag, ', ') AS tags
    FROM lexicon l
    LEFT JOIN lexicon_tags t ON l.id = t.lexicon_id
    ${whereSQL}
    GROUP BY l.id
    ORDER BY l.fr COLLATE NOCASE ${sortOrder.toUpperCase()}
    `,
      ...params
    );

    setLexicon(rows);
  };

  useEffect(() => {
    fetchLexicon().catch(console.error);
  }, [selectedDifficulties, sortOrder, keywordFilter]);

  const toggleActive = async (id: number, current: number) => {
    const db = await dbPromise;
    await db.runAsync("UPDATE lexicon SET active = ? WHERE id = ?", current ? 0 : 1, id);
    fetchLexicon();
  };

  const deleteWord = (id: number) => {
    setConfirmDeleteId(id);
  };

  const onToggleDifficulty = (diff: Difficulty) => {
    setSelectedDifficulties((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
    );
  };

  const onToggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const toggleSortSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowSortOptions((prev) => !prev);
    if (showFilterOptions) setShowFilterOptions(false);
  };

  const toggleFilterSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilterOptions((prev) => !prev);
    if (showSortOptions) setShowSortOptions(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topFilterRow}>
        <TouchableOpacity style={styles.topFilterBox} onPress={toggleSortSection}>
          <Text style={styles.topFilterText}>Trier</Text>
        </TouchableOpacity>
        <View style={styles.verticalDivider} />
        <TouchableOpacity style={styles.topFilterBox} onPress={toggleFilterSection}>
          <Text style={styles.topFilterText}>Filtrer</Text>
        </TouchableOpacity>
      </View>

      {showSortOptions && (
        <View style={styles.sortOptionsContainer}>
          <TouchableOpacity onPress={() => setSortOrder("asc")}>
            <Text style={styles.optionText}>A → Z</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortOrder("desc")}>
            <Text style={styles.optionText}>Z → A</Text>
          </TouchableOpacity>
        </View>
      )}

      {showFilterOptions && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Tri par difficulté</Text>
          <FilterBar
            selectedDifficulties={selectedDifficulties}
            onToggleDifficulty={onToggleDifficulty}
            sortOrder={sortOrder}
            onToggleSortOrder={onToggleSortOrder}
          />
          <Text style={{ fontWeight: "bold", marginTop: 12 }}>Mots-clés</Text>
          <TextInput
            value={keywordFilter}
            onChangeText={setKeywordFilter}
            placeholder="Ex : nourriture"
            style={{
              marginTop: 6,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 6,
              padding: 8,
              fontSize: 14,
            }}
          />
        </View>
      )}

      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text style={styles.title}>Lexique</Text>
          <TouchableOpacity onPress={() => setConfirmDeleteAll(true)}>
            <MaterialCommunityIcons name="delete-empty" size={24} color="#e53935" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={lexicon}
          contentContainerStyle={[styles.listContent, { paddingBottom: 220 }]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.texts}>
                  <Text style={[styles.fr, { color: difficultyColor(item.difficulty) }]}>
                    🇫🇷 {item.fr}
                  </Text>
                  <Text style={styles.ko}>
                    🇰🇷 {item.ko}
                    {item.phonetic ? (
                      <Text style={styles.phoneticInline}> ({item.phonetic})</Text>
                    ) : null}
                  </Text>
                  {item.tags && (
                    <View style={styles.tagsContainer}>
                      <Text style={styles.tagsLabel}>Mots-clés :</Text>
                      <View style={styles.tagsRow}>
                        {item.tags.split(",").map((tag) => (
                          <View key={tag.trim()} style={styles.tag}>
                            <Text style={styles.tagText}>{tag.trim()}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
                <View style={styles.actions}>
                  <Switch
                    value={item.active === 1}
                    onValueChange={() => toggleActive(item.id, item.active)}
                  />
                  <Pressable onPress={() => deleteWord(item.id)}>
                    <Text style={styles.delete}>🗑️</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      </View>
      {confirmDeleteId !== null && (
        <AlertCustom
          visible={true}
          icon={<MaterialCommunityIcons name="delete" size={30} color="#e53935" />}
          iconColor="#e53935"
          title="Supprimer"
          description="Confirmer la suppression de ce mot du lexique ?"
          onClose={() => setConfirmDeleteId(null)}
          onConfirm={async () => {
            const db = await dbPromise;
            await db.runAsync("DELETE FROM lexicon WHERE id = ?", confirmDeleteId);
            setConfirmDeleteId(null);
            fetchLexicon();
          }}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      )}
      {confirmDeleteAll && (
        <AlertCustom
          visible={true}
          icon={<MaterialCommunityIcons name="delete-alert" size={30} color="#e53935" />}
          iconColor="#e53935"
          title="Tout supprimer"
          description="Cela va supprimer tous les mots du lexique. Continuer ?"
          onClose={() => setConfirmDeleteAll(false)}
          onConfirm={async () => {
            const db = await dbPromise;
            await db.runAsync("DELETE FROM lexicon");
            await db.runAsync("DELETE FROM lexicon_tags");
            setConfirmDeleteAll(false);
            fetchLexicon();
          }}
          confirmText="Supprimer tout"
          cancelText="Annuler"
        />
      )}
      <NavBar />
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
  },
  topFilterRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  topFilterBox: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  topFilterText: {
    fontWeight: "500",
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#ccc",
  },
  sortOptionsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  optionText: {
    paddingVertical: 4,
    fontSize: 16,
  },
  filtersContainer: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
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
    paddingBottom: 200,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#bdbdbd",
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  texts: {
    flex: 1,
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tags: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  phoneticInline: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
  },
  tagsContainer: {
    marginTop: 6,
  },
  tagsLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 4,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "#e0e0ff",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#333",
  }
});
