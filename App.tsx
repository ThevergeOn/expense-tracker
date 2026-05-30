import React, { useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  HomeScreen,
  TransactionScreen,
  AnalyticsScreen,
  AccountScreen,
  AddTransactionScreen,
  SelectCategoryScreen,
} from "./screens";
import { TabBar, TabName } from "./components";
import { colors } from "./theme";
import { Category } from "./types";

type ModalScreen = "none" | "addTransaction" | "selectCategory";

// Form state interface to preserve data across modal screens
interface TransactionFormState {
  amount: string;
  description: string;
  transactionType: "expense" | "income";
  selectedDate: Date;
}

const initialFormState: TransactionFormState = {
  amount: "",
  description: "",
  transactionType: "expense",
  selectedDate: new Date(),
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [modalScreen, setModalScreen] = useState<ModalScreen>("none");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formState, setFormState] = useState<TransactionFormState>(initialFormState);

  const handleTabPress = (tab: TabName) => {
    if (tab === "add") {
      // Reset form state when opening fresh
      setFormState(initialFormState);
      setSelectedCategory(null);
      setModalScreen("addTransaction");
      return;
    }
    setActiveTab(tab);
  };

  const handleCloseModal = () => {
    setModalScreen("none");
    setSelectedCategory(null);
    setFormState(initialFormState);
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setModalScreen("addTransaction");
  };

  const handleGoToSelectCategory = () => {
    // Form state is already preserved in App state
    setModalScreen("selectCategory");
  };

  const handleFormChange = (updates: Partial<TransactionFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onSeeAllPress={() => setActiveTab("transaction")} />;
      case "transaction":
        return <TransactionScreen />;
      case "analytics":
        return <AnalyticsScreen />;
      case "account":
        return <AccountScreen />;
      default:
        return <HomeScreen onSeeAllPress={() => setActiveTab("transaction")} />;
    }
  };

  const renderModalContent = () => {
    switch (modalScreen) {
      case "addTransaction":
        return (
          <AddTransactionScreen
            onClose={handleCloseModal}
            onSelectCategory={handleGoToSelectCategory}
            selectedCategory={selectedCategory}
            formState={formState}
            onFormChange={handleFormChange}
          />
        );
      case "selectCategory":
        return (
          <SelectCategoryScreen
            onClose={() => setModalScreen("addTransaction")}
            onSelect={handleSelectCategory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderScreen()}
        <TabBar activeTab={activeTab} onTabPress={handleTabPress} />

        {/* Single Modal with dynamic content */}
        <Modal
          visible={modalScreen !== "none"}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleCloseModal}
        >
          {renderModalContent()}
        </Modal>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
