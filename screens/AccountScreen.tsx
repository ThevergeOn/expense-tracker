import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme";
import {
  totalIncome,
  totalExpenses,
  currencies,
  languages,
  paymentMethods,
  defaultUserProfile,
  appInfo,
} from "../data";
import {
  ProfileCard,
  AccountStats,
  AccountMenuItem,
  ProfileModal,
  PaymentMethodsModal,
  CurrencyModal,
  LanguageModal,
  ChangePasswordModal,
  HelpSupportModal,
  TermsModal,
  PrivacyModal,
  AboutModal,
} from "../components/account";

type ModalType =
  | "none"
  | "profile"
  | "payment"
  | "currency"
  | "language"
  | "password"
  | "help"
  | "terms"
  | "privacy"
  | "about";

export default function AccountScreen() {
  const [activeModal, setActiveModal] = useState<ModalType>("none");
  const [profile, setProfile] = useState(defaultUserProfile);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [toggles, setToggles] = useState({
    biometric: true,
    notifications: true,
    darkMode: false,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => Alert.alert("Logged out") },
    ]);
  };

  const getCurrencyDisplay = () => {
    const currency = currencies.find((c) => c.code === selectedCurrency);
    return currency ? `${currency.code} (${currency.symbol})` : "USD ($)";
  };

  const getLanguageDisplay = () => {
    const language = languages.find((l) => l.code === selectedLanguage);
    return language ? language.name : "English";
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case "profile":
        return (
          <ProfileModal
            profile={profile}
            onSave={setProfile}
            onClose={() => setActiveModal("none")}
          />
        );
      case "payment":
        return (
          <PaymentMethodsModal
            paymentMethods={paymentMethods}
            onClose={() => setActiveModal("none")}
          />
        );
      case "currency":
        return (
          <CurrencyModal
            currencies={currencies}
            selectedCurrency={selectedCurrency}
            onSelect={setSelectedCurrency}
            onClose={() => setActiveModal("none")}
          />
        );
      case "language":
        return (
          <LanguageModal
            languages={languages}
            selectedLanguage={selectedLanguage}
            onSelect={setSelectedLanguage}
            onClose={() => setActiveModal("none")}
          />
        );
      case "password":
        return <ChangePasswordModal onClose={() => setActiveModal("none")} />;
      case "help":
        return <HelpSupportModal onClose={() => setActiveModal("none")} />;
      case "terms":
        return <TermsModal onClose={() => setActiveModal("none")} />;
      case "privacy":
        return <PrivacyModal onClose={() => setActiveModal("none")} />;
      case "about":
        return <AboutModal onClose={() => setActiveModal("none")} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
        </View>

        <ProfileCard
          name={profile.name}
          email={profile.email}
          onPress={() => setActiveModal("profile")}
        />

        <AccountStats totalIncome={totalIncome} totalExpenses={totalExpenses} />

        {/* General Settings */}
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.menuContainer}>
          <AccountMenuItem
            icon="person-outline"
            label="Profile"
            color={colors.primary}
            onPress={() => setActiveModal("profile")}
          />
          <AccountMenuItem
            icon="card-outline"
            label="Payment Methods"
            color={colors.blue}
            onPress={() => setActiveModal("payment")}
          />
          <AccountMenuItem
            icon="wallet-outline"
            label="Currency"
            color={colors.purple}
            value={getCurrencyDisplay()}
            onPress={() => setActiveModal("currency")}
          />
          <AccountMenuItem
            icon="language-outline"
            label="Language"
            color={colors.cyan}
            value={getLanguageDisplay()}
            onPress={() => setActiveModal("language")}
            isLast
          />
        </View>

        {/* Security Settings */}
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.menuContainer}>
          <AccountMenuItem
            icon="lock-closed-outline"
            label="Change Password"
            color={colors.green}
            onPress={() => setActiveModal("password")}
          />
          <AccountMenuItem
            icon="finger-print-outline"
            label="Biometric Login"
            color={colors.teal}
            hasToggle
            toggleValue={toggles.biometric}
            onToggle={() => handleToggle("biometric")}
            isLast
          />
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.menuContainer}>
          <AccountMenuItem
            icon="notifications-outline"
            label="Push Notifications"
            color={colors.orange}
            hasToggle
            toggleValue={toggles.notifications}
            onToggle={() => handleToggle("notifications")}
          />
          <AccountMenuItem
            icon="moon-outline"
            label="Dark Mode"
            color={colors.indigo}
            hasToggle
            toggleValue={toggles.darkMode}
            onToggle={() => handleToggle("darkMode")}
            isLast
          />
        </View>

        {/* Support */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.menuContainer}>
          <AccountMenuItem
            icon="help-circle-outline"
            label="Help & Support"
            color={colors.teal}
            onPress={() => setActiveModal("help")}
          />
          <AccountMenuItem
            icon="document-text-outline"
            label="Terms of Service"
            color={colors.blue}
            onPress={() => setActiveModal("terms")}
          />
          <AccountMenuItem
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            color={colors.green}
            onPress={() => setActiveModal("privacy")}
          />
          <AccountMenuItem
            icon="information-circle-outline"
            label="About"
            color={colors.indigo}
            onPress={() => setActiveModal("about")}
            isLast
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.expense} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version {appInfo.version}</Text>
      </ScrollView>

      <Modal
        visible={activeModal !== "none"}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal("none")}
      >
        {renderModalContent()}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
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
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuContainer: {
    backgroundColor: colors.cardBg,
    marginHorizontal: spacing.xl,
    borderRadius: 16,
    overflow: "hidden",
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
  versionText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});
