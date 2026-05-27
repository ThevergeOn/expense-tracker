import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

export type TabName = "home" | "transaction" | "add" | "analytics" | "account";

interface TabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

interface TabItemProps {
  name: TabName;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  isActive: boolean;
  onPress: () => void;
}

const TabItem = ({ icon, activeIcon, isActive, onPress }: TabItemProps) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress}>
    <Ionicons
      name={isActive ? activeIcon : icon}
      size={24}
      color={isActive ? colors.primary : colors.textMuted}
    />
  </TouchableOpacity>
);

const FABButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.fab} onPress={onPress}>
    <Ionicons name="add" size={28} color={colors.white} />
  </TouchableOpacity>
);

export default function TabBar({ activeTab, onTabPress }: TabBarProps) {
  const tabs: Array<{
    name: TabName;
    icon: keyof typeof Ionicons.glyphMap;
    activeIcon: keyof typeof Ionicons.glyphMap;
  }> = [
    { name: "home", icon: "home-outline", activeIcon: "home" },
    { name: "transaction", icon: "swap-horizontal-outline", activeIcon: "swap-horizontal" },
    { name: "add", icon: "add", activeIcon: "add" },
    { name: "analytics", icon: "stats-chart-outline", activeIcon: "stats-chart" },
    { name: "account", icon: "person-outline", activeIcon: "person" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) =>
          tab.name === "add" ? (
            <FABButton key={tab.name} onPress={() => onTabPress("add")} />
          ) : (
            <TabItem
              key={tab.name}
              name={tab.name}
              icon={tab.icon}
              activeIcon={tab.activeIcon}
              isActive={activeTab === tab.name}
              onPress={() => onTabPress(tab.name)}
            />
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingBottom: 30,
    paddingTop: 12,
    paddingHorizontal: 20,
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  tabItem: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
