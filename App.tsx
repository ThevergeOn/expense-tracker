import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  HomeScreen,
  TransactionScreen,
  AnalyticsScreen,
  AccountScreen,
} from "./screens";
import { TabBar, TabName } from "./components";
import { colors } from "./theme";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>("home");

  const handleTabPress = (tab: TabName) => {
    if (tab === "add") {
      // TODO: Open add transaction modal
      console.log("Add transaction pressed");
      return;
    }
    setActiveTab(tab);
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

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderScreen()}
        <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
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
