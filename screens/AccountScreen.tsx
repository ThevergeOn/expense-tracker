import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme";
import { useAccount } from "../hooks";
import { useCurrency } from "../context";
import {
  SkeletonProfileCard,
  SkeletonStats,
  SkeletonMenuSection,
} from "../components";
import {
  ProfileCard,
  AccountStats,
  AccountMenuItem,
  ProfileModal,
  PaymentMethodsModal,
  CurrencyModal,
  LanguageModal,
  ChangePasswordModal,
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
  | "terms"
  | "privacy"
  | "about";

export default function AccountScreen() {
  const [activeModal, setActiveModal] = useState<ModalType>("none");

  const {
    profile,
    currencies,
    languages,
    paymentMethods,
    appInfo,
    selectedCurrency,
    selectedLanguage,
    totalIncome,
    totalExpenses,
    loading,
    updateProfile,
    updateCurrency,
    updateLanguage,
  } = useAccount();

  const { setSelectedCurrency: setGlobalCurrency } = useCurrency();

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

  const handleSaveProfile = async (data: typeof profile) => {
    await updateProfile(data);
  };

  const handleSelectCurrency = async (code: string) => {
    await updateCurrency(code);
    setGlobalCurrency(code); // Sync with global currency context
  };

  const handleSelectLanguage = async (code: string) => {
    await updateLanguage(code);
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case "profile":
        return (
          <ProfileModal
            key={`profile-${profile.name}-${profile.email}`}
            profile={profile}
            onSave={handleSaveProfile}
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
            key={`currency-${selectedCurrency}`}
            currencies={currencies}
            selectedCurrency={selectedCurrency}
            onSelect={handleSelectCurrency}
            onClose={() => setActiveModal("none")}
          />
        );
      case "language":
        return (
          <LanguageModal
            key={`language-${selectedLanguage}`}
            languages={languages}
            selectedLanguage={selectedLanguage}
            onSelect={handleSelectLanguage}
            onClose={() => setActiveModal("none")}
          />
        );
      case "password":
        return <ChangePasswordModal onClose={() => setActiveModal("none")} />;
      case "terms":
        return <TermsModal onClose={() => setActiveModal("none")} />;
      case "privacy":
        return <PrivacyModal onClose={() => setActiveModal("none")} />;
      case "about":
        return <AboutModal appInfo={appInfo} onClose={() => setActiveModal("none")} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Account</Text>
          </View>

          <SkeletonProfileCard />
          <SkeletonStats />
          <SkeletonMenuSection itemCount={4} />
          <SkeletonMenuSection itemCount={1} />
          <SkeletonMenuSection itemCount={3} />
        </ScrollView>
      </SafeAreaView>
    );
  }

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
            isLast
          />
        </View>

        {/* Support */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.menuContainer}>
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

        {appInfo && <Text style={styles.versionText}>Version {appInfo.version}</Text>}
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
