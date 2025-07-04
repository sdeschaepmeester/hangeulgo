import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, UIManager, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Difficulty } from "@/types/Difficulty";
import type { LexiconEntry } from "@/types/LexiconEntry";
import FilterBarToggle from "@/components/lexicon/FilterBarToggle";
import SortOptions from "@/components/lexicon/SortOptions";
import LexiconFilters from "@/components/lexicon/LexiconFilters";
import AlertCustom from "@/components/AlertCustom";
import { getFilteredLexicon, toggleLexiconActive, deleteLexiconEntry, updateFrenchDuplicateFormatting } from "@/services/lexicon";
import { getAllUniqueTags } from "@/services/tags";
import LexiconList from "@/components/lexicon/LexiconList";
import MainLayout from "@/layouts/MainLayout";
import i18n from "@/i18n";
import colors from "@/constants/colors";

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
    if (searchTerm.trim()) {
      setLexicon(rows.filter((entry) =>
        entry.native.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setLexicon(rows);
    }
  };

  useEffect(() => {
    getAllUniqueTags().then(setAllTags);
  }, []);

  useEffect(() => {
    fetchLexicon().catch(console.error);
  }, [selectedDifficulties, sortOrder, selectedTags, searchTerm]);

  const refreshTags = async () => {
    const tags = await getAllUniqueTags();
    setAllTags(tags);
  };

  const handleToggleActive = async (id: number, current: number) => {
    await toggleLexiconActive(id, current);
    fetchLexicon();
  };

  const resetFiltersAndFetchLexicon = () => {
    setSelectedDifficulties([]);
    setSelectedTags([]);
    setSortOrder("asc");
    setShowSortOptions(false);
    setShowFilterOptions(false);
    fetchLexicon();
  };

  const handleDeleteWord = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteId !== null) {
      await deleteLexiconEntry(confirmDeleteId);
      setConfirmDeleteId(null);
      fetchLexicon();
      refreshTags();
    }
  };

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
  };

  return (
    <MainLayout scrollable={false}>
      {/* ---------- Searchbar ---------- */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={i18n.t("lexicon.searchWord")}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor={colors.neutral.main}
        />
      </View>

      {/* ---------- Filters ---------- */}
      <View style={styles.fullWidth}>
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

      {/* ---------- Lexicon list ---------- */}
      <View style={styles.listSection}>
        <LexiconList
          data={lexicon}
          onToggle={handleToggleActive}
          onDelete={handleDeleteWord}
          onDeleteAll={() => setConfirmDeleteSeverals(true)}
          onUpdate={updateLexicon}
        />
      </View>

      {/* ---------- Alerts ---------- */}
      {confirmDeleteId !== null && (
        <AlertCustom
          visible={true}
          icon={<MaterialCommunityIcons name="delete" size={30} color={colors.danger.dark} />}
          iconColor={colors.danger.dark}
          title={i18n.t("modaleDelete.confirmDeletionWordTitle")}
          description={i18n.t("modaleDelete.confirmDeletionWordText")}
          onClose={() => setConfirmDeleteId(null)}
          onConfirm={handleConfirmDelete}
          confirmText={i18n.t("actions.delete")}
          cancelText={i18n.t("actions.cancel")}
        />
      )}
      {confirmDeleteSeverals && (
        <AlertCustom
          visible={true}
          icon={<MaterialCommunityIcons name="delete-alert" size={30} color={colors.danger.light} />}
          iconColor={colors.danger.lightest}
          title={i18n.t("actions.deleteAll")}
          description={i18n.t("modaleDelete.confirmDeletionAllWordText", {
            count: lexicon?.length ?? 0,
            managePlural:
              (lexicon?.length ?? 0) <= 1
                ? i18n.t("modaleDelete.singleSavedWord")
                : i18n.t("modaleDelete.pluralSavedWords"),
          })} onClose={() => setConfirmDeleteSeverals(false)}
          onConfirm={handleConfirmDeleteSeveral}
          confirmText={i18n.t("actions.deleteAll")}
          cancelText={i18n.t("actions.cancel")}
        />
      )}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    marginHorizontal: -18,
  },
  listSection: {
    flex: 1,
    marginTop: 8,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: colors.neutral.lightest,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 16,
  },
});
