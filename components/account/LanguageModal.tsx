import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../theme";
import ModalHeader from "./ModalHeader";

interface Language {
  code: string;
  name: string;
}

interface LanguageModalProps {
  languages: Language[];
  selectedLanguage: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

export default function LanguageModal({
  languages,
  selectedLanguage,
  onSelect,
  onClose,
}: LanguageModalProps) {
  const handleSelect = (code: string) => {
    onSelect(code);
    onClose();
  };

  return (
    <View style={styles.container}>
      <ModalHeader title="Select Language" onClose={onClose} />
      <ScrollView style={styles.content}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.selectionItem,
              selectedLanguage === language.code && styles.selectionItemActive,
            ]}
            onPress={() => handleSelect(language.code)}
          >
            <View style={styles.languageIcon}>
              <Text style={styles.languageCode}>{language.code.toUpperCase()}</Text>
            </View>
            <Text style={styles.selectionTitle}>{language.name}</Text>
            {selectedLanguage === language.code && (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  selectionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  selectionItemActive: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  languageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  languageCode: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  selectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
});
