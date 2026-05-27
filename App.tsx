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

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [modalScreen, setModalScreen] = useState<ModalScreen>("none");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleTabPress = (tab: TabName) => {
    if (tab === "add") {
      setModalScreen("addTransaction");
      return;
    }
    setActiveTab(tab);
  };

  const handleCloseModal = () => {
    setModalScreen("none");
    setSelectedCategory(null);
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setModalScreen("addTransaction");
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "transaction":
        return <TransactionScreen />;
      case "analytics":
        return <AnalyticsScreen />;
      case "account":
        return <AccountScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const renderModalContent = () => {
    switch (modalScreen) {
      case "addTransaction":
        return (
          <AddTransactionScreen
            onClose={handleCloseModal}
            onSelectCategory={() => setModalScreen("selectCategory")}
            selectedCategory={selectedCategory}
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
