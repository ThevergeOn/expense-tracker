import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme";

const menuItems = [
  { icon: "person-outline", label: "Profile", color: colors.primary },
  { icon: "card-outline", label: "Payment Methods", color: colors.blue },
  { icon: "notifications-outline", label: "Notifications", color: colors.orange },
  { icon: "lock-closed-outline", label: "Security", color: colors.green },
  { icon: "help-circle-outline", label: "Help & Support", color: colors.teal },
  { icon: "information-circle-outline", label: "About", color: colors.indigo },
];

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.white} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@email.com</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: item.color + "20" }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={22} color={colors.expense} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    borderRadius: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  profileName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  menuContainer: {
    backgroundColor: colors.cardBg,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    borderRadius: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBg,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: 16,
    gap: spacing.sm,
  },
  logoutText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.expense,
  },
});
