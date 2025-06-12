import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, UIManager, TouchableOpacity, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Difficulty } from "@/types/Difficulty";
import type { LexiconEntry } from "@/types/LexiconEntry";
import NavBar from "@/components/NavBar";
import FilterBarToggle from "@/components/lexicon/FilterBarToggle";
import SortOptions from "@/components/lexicon/SortOptions";
import LexiconFilters from "@/components/lexicon/LexiconFilters";
import AlertCustom from "@/components/AlertCustom";
import { getFilteredLexicon, toggleLexiconActive, deleteLexiconEntry, resetLexicon, } from "@/services/lexicon";
import { getAllUniqueTags } from "@/services/tags";
import LexiconList from "@/components/lexicon/LexiconList";

// Activate animation layout auto on Android without having to use Reanimated
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
  const [confirmDeleteSeverals, setConfirmDeleteSeverals] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fetchLexicon = async () => {
    const rows = await getFilteredLexicon(selectedDifficulties, selectedTags, sortOrder);
    setLexicon(rows);
  };

  // Fetch all unique tags for filters
  useEffect(() => {
    getAllUniqueTags().then(setAllTags);
  }, []);

  useEffect(() => {
    fetchLexicon().catch(console.error);
  }, [selectedDifficulties, sortOrder, selectedTags]);

  // Activate or deactivate a word
  const handleToggleActive = async (id: number, current: number) => {
    await toggleLexiconActive(id, current);
    fetchLexicon();
  };

  // Delete a single word 
  const handleDeleteWord = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteId !== null) {
      await deleteLexiconEntry(confirmDeleteId);
      setConfirmDeleteId(null);
      fetchLexicon();
    }
  };

  // Delete several words
  const handleConfirmDeleteSeveral = async () => {
    for (const entry of lexicon) {
      await deleteLexiconEntry(entry.id);
    }
    setConfirmDeleteSeverals(false);
    fetchLexicon();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ----------------- Filters section ----------------- */}
      <View style={styles.filtersSection}>
        <FilterBarToggle
          onToggleSort={() => {
            setShowSortOptions((prev) => !prev);
            setShowFilterOptions(false);
          }}
          onToggleFilter={() => {
            setShowFilterOptions((prev) => !prev);
            setShowSortOptions(false);
          }}
          isSortOpen={showSortOptions}
          isFilterOpen={showFilterOptions}
        />
        {showSortOptions && (
          <SortOptions currentOrder={sortOrder} onChange={setSortOrder} />
        )}
        {showFilterOptions && (
          <LexiconFilters
            selectedDifficulties={selectedDifficulties}
            onToggleDifficulty={(d) =>
              setSelectedDifficulties((prev) =>
                prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
              )
            }
            sortOrder={sortOrder}
            onToggleSortOrder={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            allTags={allTags}
            selectedTags={selectedTags}
            onToggleTag={(tag) =>
              setSelectedTags((prev) =>
                prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
              )
            }
          />
        )}
      </View>

      {/* ----------------- Content section: List of lexicon words ----------------- */}
      <View style={styles.listSection}>
        <LexiconList
          data={lexicon}
          onToggle={handleToggleActive}
          onDelete={handleDeleteWord}
          onDeleteAll={() => setConfirmDeleteSeverals(true)}
          onUpdate={fetchLexicon}
        />
      </View>

      {/* ----------------- Navbar ----------------- */}
      <NavBar />

      {/* ----------------- Modales deletion single word ----------------- */}
      {confirmDeleteId !== null && (
        <AlertCustom
          visible={true}
          icon={<MaterialCommunityIcons name="delete" size={30} color="#e53935" />}
          iconColor="#e53935"
          title="Supprimer"
          description="Confirmer la suppression de ce mot du lexique ?"
          onClose={() => setConfirmDeleteId(null)}
          onConfirm={handleConfirmDelete}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      )}

      {/* ----------------- Modales deletion whole lexicon ----------------- */}
      {confirmDeleteSeverals && (
        <AlertCustom
          visible={true}
          icon={<MaterialCommunityIcons name="delete-alert" size={30} color="#e53935" />}
          iconColor="#e53935"
          title="Tout supprimer"
          description={`Cela va supprimer ${lexicon.length} mots du lexique. Continuer ?`}
          onClose={() => setConfirmDeleteSeverals(false)}
          onConfirm={handleConfirmDeleteSeveral}
          confirmText="Supprimer tout"
          cancelText="Annuler"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filtersSection: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listSection: {
    flex: 1,
    padding: 12,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});