import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, ViewStyle } from "react-native";
import { colors } from "../theme";

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = "100%" as `${number}%`, height = 20, borderRadius = 8, style }: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Pre-built skeleton layouts
export function SkeletonProfileCard() {
  return (
    <View style={skeletonStyles.profileCard}>
      <Skeleton width={70} height={70} borderRadius={35} />
      <View style={skeletonStyles.profileInfo}>
        <Skeleton width={150} height={20} />
        <Skeleton width={200} height={16} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

export function SkeletonStats() {
  return (
    <View style={skeletonStyles.statsContainer}>
      <View style={skeletonStyles.statItem}>
        <Skeleton width={36} height={36} borderRadius={10} />
        <Skeleton width={50} height={12} style={{ marginTop: 8 }} />
        <Skeleton width={70} height={16} style={{ marginTop: 4 }} />
      </View>
      <View style={skeletonStyles.statDivider} />
      <View style={skeletonStyles.statItem}>
        <Skeleton width={36} height={36} borderRadius={10} />
        <Skeleton width={50} height={12} style={{ marginTop: 8 }} />
        <Skeleton width={70} height={16} style={{ marginTop: 4 }} />
      </View>
      <View style={skeletonStyles.statDivider} />
      <View style={skeletonStyles.statItem}>
        <Skeleton width={36} height={36} borderRadius={10} />
        <Skeleton width={50} height={12} style={{ marginTop: 8 }} />
        <Skeleton width={70} height={16} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
}

export function SkeletonMenuItem() {
  return (
    <View style={skeletonStyles.menuItem}>
      <Skeleton width={40} height={40} borderRadius={10} />
      <Skeleton width={120} height={18} style={{ marginLeft: 12 }} />
      <View style={{ flex: 1 }} />
      <Skeleton width={16} height={16} borderRadius={4} />
    </View>
  );
}

export function SkeletonMenuSection({ itemCount = 3 }: { itemCount?: number }) {
  return (
    <View style={skeletonStyles.menuSection}>
      <Skeleton width={80} height={14} style={{ marginBottom: 12, marginLeft: 4 }} />
      <View style={skeletonStyles.menuContainer}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <SkeletonMenuItem key={index} />
        ))}
      </View>
    </View>
  );
}

export function SkeletonTransactionItem() {
  return (
    <View style={skeletonStyles.transactionItem}>
      <Skeleton width={44} height={44} borderRadius={12} />
      <View style={skeletonStyles.transactionInfo}>
        <Skeleton width={120} height={16} />
        <Skeleton width={80} height={12} style={{ marginTop: 4 }} />
      </View>
      <Skeleton width={70} height={18} />
    </View>
  );
}

export function SkeletonTransactionList({ itemCount = 5 }: { itemCount?: number }) {
  return (
    <View>
      {Array.from({ length: itemCount }).map((_, index) => (
        <SkeletonTransactionItem key={index} />
      ))}
    </View>
  );
}

export function SkeletonHomeHeader() {
  return (
    <View style={skeletonStyles.homeHeader}>
      <Skeleton width={180} height={24} style={{ alignSelf: "center" }} />
      <View style={skeletonStyles.periodTabs}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} width={70} height={36} borderRadius={10} />
        ))}
      </View>
      <View style={skeletonStyles.spendingContainer}>
        <Skeleton width={140} height={14} style={{ alignSelf: "center" }} />
        <Skeleton width={200} height={48} style={{ alignSelf: "center", marginTop: 8 }} />
        <Skeleton width={120} height={16} style={{ alignSelf: "center", marginTop: 8 }} />
      </View>
    </View>
  );
}

export function SkeletonAnalyticsChart() {
  return (
    <View style={skeletonStyles.chartContainer}>
      <View style={skeletonStyles.chartHeader}>
        <Skeleton width={100} height={20} />
        <View style={skeletonStyles.chartLegend}>
          <Skeleton width={60} height={16} />
          <Skeleton width={60} height={16} />
        </View>
      </View>
      <View style={skeletonStyles.chartBars}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={skeletonStyles.chartBarGroup}>
            <Skeleton width={20} height={60 + Math.random() * 60} borderRadius={4} />
            <Skeleton width={20} height={40 + Math.random() * 40} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function SkeletonCategoryGrid({ itemCount = 8 }: { itemCount?: number }) {
  return (
    <View style={skeletonStyles.categoryGrid}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <View key={index} style={skeletonStyles.categoryItem}>
          <Skeleton width={56} height={56} borderRadius={16} />
          <Skeleton width={50} height={12} style={{ marginTop: 8 }} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.cardBg,
  },
});

const skeletonStyles = StyleSheet.create({
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.cardBg,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.background,
    marginVertical: 8,
  },
  menuSection: {
    marginTop: 24,
    marginHorizontal: 20,
  },
  menuContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  homeHeader: {
    padding: 16,
  },
  periodTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 8,
  },
  spendingContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartLegend: {
    flexDirection: "row",
    gap: 12,
  },
  chartBars: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 150,
  },
  chartBarGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },
  categoryItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: 16,
  },
});
