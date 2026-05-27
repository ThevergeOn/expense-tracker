import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../theme";

interface AccountMenuItemProps {
  icon: string;
  label: string;
  color: string;
  value?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  isLast?: boolean;
}

export default function AccountMenuItem({
  icon,
  label,
  color,
  value,
  hasToggle,
  toggleValue,
  onToggle,
  onPress,
  isLast,
}: AccountMenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.container, isLast && styles.containerLast]}
      onPress={onPress}
      disabled={hasToggle}
    >
      <View style={[styles.icon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <Text style={styles.label}>{label}</Text>
      {value && <Text style={styles.value}>{value}</Text>}
      {hasToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: "#E5E7EB", true: colors.primary + "60" }}
          thumbColor={toggleValue ? colors.primary : "#F3F4F6"}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  containerLast: {
    borderBottomWidth: 0,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  value: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
});
