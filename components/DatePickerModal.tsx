import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec",
];

interface DatePickerModalProps {
  visible: boolean;
  selectedDate: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
}

export default function DatePickerModal({
  visible,
  selectedDate,
  onClose,
  onSelect,
}: DatePickerModalProps) {
  const [displayYear, setDisplayYear] = useState(selectedDate.getFullYear());
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(displayYear, monthIndex, 1);
    onSelect(newDate);
    onClose();
  };

  const handleThisMonth = () => {
    const now = new Date();
    setDisplayYear(now.getFullYear());
    onSelect(new Date(now.getFullYear(), now.getMonth(), 1));
    onClose();
  };

  const handlePrevYear = () => {
    setDisplayYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    if (displayYear < currentYear) {
      setDisplayYear((prev) => prev + 1);
    }
  };

  const isMonthDisabled = (monthIndex: number) => {
    // Disable future months
    if (displayYear > currentYear) return true;
    if (displayYear === currentYear && monthIndex > currentMonth) return true;
    return false;
  };

  const isMonthSelected = (monthIndex: number) => {
    return displayYear === selectedYear && monthIndex === selectedMonth;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Date</Text>
            <TouchableOpacity onPress={handleThisMonth}>
              <Text style={styles.thisMonthText}>This month</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Year Navigation */}
          <View style={styles.yearNav}>
            <TouchableOpacity onPress={handlePrevYear} style={styles.yearNavButton}>
              <Ionicons name="chevron-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.yearText}>{displayYear}</Text>
            <TouchableOpacity
              onPress={handleNextYear}
              style={[
                styles.yearNavButton,
                displayYear >= currentYear && styles.yearNavButtonDisabled,
              ]}
              disabled={displayYear >= currentYear}
            >
              <Ionicons
                name="chevron-forward"
                size={24}
                color={displayYear >= currentYear ? colors.textMuted : colors.white}
              />
            </TouchableOpacity>
          </View>

          {/* Months Grid */}
          <View style={styles.monthsGrid}>
            {MONTHS.map((month, index) => {
              const disabled = isMonthDisabled(index);
              const selected = isMonthSelected(index);

              return (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthButton,
                    selected && styles.monthButtonSelected,
                  ]}
                  onPress={() => handleMonthSelect(index)}
                  disabled={disabled}
                >
                  <Text
                    style={[
                      styles.monthText,
                      selected && styles.monthTextSelected,
                      disabled && styles.monthTextDisabled,
                    ]}
                  >
                    {month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  container: {
    width: "100%",
    backgroundColor: "#374151",
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: "#4B5563",
  },
  headerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.white,
  },
  thisMonthText: {
    fontSize: typography.sizes.md,
    color: colors.white,
  },
  closeButton: {
    padding: spacing.xs,
  },
  yearNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#4B5563",
  },
  yearNavButton: {
    padding: spacing.sm,
  },
  yearNavButtonDisabled: {
    opacity: 0.5,
  },
  yearText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: spacing.md,
  },
  monthButton: {
    width: "25%",
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  monthButtonSelected: {
    // No background, just text color change
  },
  monthText: {
    fontSize: typography.sizes.md,
    color: colors.white,
  },
  monthTextSelected: {
    color: "#F87171",
    fontWeight: typography.weights.semibold,
  },
  monthTextDisabled: {
    color: "#6B7280",
  },
});
