import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, UIManager, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Difficulty } from "@/types/Difficulty";
import type { LexiconEntry } from "@/types/LexiconEntry";
import NavBar from "@/components/NavBar";
import FilterBarToggle from "@/components/lexicon/FilterBarToggle";
import SortOptions from "@/components/lexicon/SortOptions";
import LexiconFilters from "@/components/lexicon/LexiconFilters";
import AlertCustom from "@/components/AlertCustom";
import { getFilteredLexicon, toggleLexiconActive, deleteLexiconEntry, updateFrenchDuplicateFormatting } from "@/services/lexicon";
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
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLexicon = async () => {
    const rows = await getFilteredLexicon(selectedDifficulties, selectedTags, sortOrder);
    // Search by french word
    if (searchTerm.trim()) {
      setLexicon(rows.filter((entry) =>
        entry.fr.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setLexicon(rows);
    }
  };


  // Fetch all unique tags for filters
  useEffect(() => {
    getAllUniqueTags().then(setAllTags);
  }, []);

  useEffect(() => {
    fetchLexicon().catch(console.error);
  }, [selectedDifficulties, sortOrder, selectedTags, searchTerm]);

  // Fetch all tags
  const refreshTags = async () => {
    const tags = await getAllUniqueTags();
    setAllTags(tags);
  };

  // Activate or deactivate a word
  const handleToggleActive = async (id: number, current: number) => {
    await toggleLexiconActive(id, current);
    fetchLexicon();
  };

  // After deletion of several words, reset filters and fetch lexicon
  const resetFiltersAndFetchLexicon = () => {
    setSelectedDifficulties([]);
    setSelectedTags([]);
    setSortOrder("asc");
    setShowSortOptions(false);
    setShowFilterOptions(false);
    fetchLexicon();
  };

  // Delete a single word 
  const handleDeleteWord = (id: number) => {
    setConfirmDeleteId(id);
  };

  // Confirm single deletion
  const handleConfirmDelete = async () => {
    if (confirmDeleteId !== null) {
      await deleteLexiconEntry(confirmDeleteId);
      setConfirmDeleteId(null);
      fetchLexicon();
      refreshTags();
    }
  };

  // Delete several words
  const handleConfirmDeleteSeveral = async () => {
    for (const entry of lexicon) {
      await deleteLexiconEntry(entry.id);
    }
    setConfirmDeleteSeverals(false);
    resetFiltersAndFetchLexicon();
    refreshTags();
  };

  const updateLexicon = async (id: number) => {
    await updateFrenchDuplicateFormatting(id);
    await fetchLexicon();
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* ----------------- Searchbar french word ----------------- */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Recherche par mot"
          value={searchTerm}
          onChangeText={(text) => {
            setSearchTerm(text);
          }}
          placeholderTextColor="#888"
        />
      </View>
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
          onUpdate={async (id) => {
            updateLexicon(id)
          }}
        />
      </View>

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
          description={`Cela va supprimer ${lexicon.length} mot${lexicon.length > 1 ? "s" : ""} du lexique. Continuer ?`}
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
    marginBottom: 24
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
  searchContainer: {
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInput: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 16,
  }
});