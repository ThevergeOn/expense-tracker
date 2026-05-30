import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path, G, Circle } from "react-native-svg";
import { colors, spacing, typography } from "../theme";
import { useCategoryAnalytics } from "../hooks";
import { useCurrency } from "../context";
import { PeriodType, CategoryBreakdown } from "../services";
import { Skeleton } from "../components";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_SIZE = SCREEN_WIDTH - 80;
const CHART_RADIUS = CHART_SIZE / 2 - 20;
const CHART_CENTER = CHART_SIZE / 2;

// Generate pie chart path
const createPieSlice = (
  startAngle: number,
  endAngle: number,
  radius: number,
  centerX: number,
  centerY: number
): string => {
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);

  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
};

// Color palette for pie chart
const PIE_COLORS = [
  "#FF6B6B", // coral red
  "#4ECDC4", // teal
  "#45B7D1", // sky blue
  "#96CEB4", // sage green
  "#FFEAA7", // soft yellow
  "#DDA0DD", // plum
  "#98D8C8", // mint
  "#F7DC6F", // gold
  "#BB8FCE", // lavender
  "#85C1E9", // light blue
];

type ViewType = "expense" | "income";

interface PieChartProps {
  data: CategoryBreakdown[];
  loading: boolean;
  viewType: ViewType;
}

const PieChart = ({ data, loading, viewType }: PieChartProps) => {
  if (loading) {
    return (
      <View style={styles.chartContainer}>
        <View style={styles.skeletonChart}>
          <Skeleton width={CHART_SIZE - 40} height={CHART_SIZE - 40} borderRadius={(CHART_SIZE - 40) / 2} />
        </View>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.chartContainer}>
        <View style={styles.emptyChart}>
          <Ionicons
            name={viewType === "expense" ? "trending-down" : "trending-up"}
            size={48}
            color={colors.textMuted}
          />
          <Text style={styles.emptyText}>
            No {viewType} data for this period
          </Text>
        </View>
      </View>
    );
  }

  let currentAngle = 0;
  const slices = data.map((item, index) => {
    const sliceAngle = (item.percentage / 100) * 360;
    const path = createPieSlice(
      currentAngle,
      currentAngle + sliceAngle,
      CHART_RADIUS,
      CHART_CENTER,
      CHART_CENTER
    );
    currentAngle += sliceAngle;
    return {
      path,
      color: item.color || PIE_COLORS[index % PIE_COLORS.length],
      item,
    };
  });

  // Find the largest category for the label
  const largestCategory = data.reduce((prev, current) =>
    prev.percentage > current.percentage ? prev : current
  , data[0]);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartWrapper}>
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
          <G>
            {slices.map((slice, index) => (
              <Path
                key={index}
                d={slice.path}
                fill={slice.color}
                stroke={colors.background}
                strokeWidth={2}
              />
            ))}
            {/* Center circle for donut effect */}
            <Circle
              cx={CHART_CENTER}
              cy={CHART_CENTER}
              r={CHART_RADIUS * 0.55}
              fill={colors.background}
            />
          </G>
        </Svg>

        {/* Center label */}
        <View style={styles.chartCenterLabel}>
          <Text style={styles.chartCenterIcon}>{largestCategory.icon}</Text>
          <Text style={styles.chartCenterName}>{largestCategory.categoryName}</Text>
          <Text style={styles.chartCenterPercent}>{largestCategory.percentage.toFixed(1)}%</Text>
        </View>
      </View>
    </View>
  );
};

interface CategoryItemProps {
  item: CategoryBreakdown;
  index: number;
  formatAmount: (amount: number) => string;
}

const CategoryItem = ({ item, index, formatAmount }: CategoryItemProps) => {
  const color = item.color || PIE_COLORS[index % PIE_COLORS.length];

  return (
    <View style={styles.categoryItem}>
      <View style={[styles.percentageBadge, { backgroundColor: color }]}>
        <Text style={styles.percentageText}>{Math.round(item.percentage)}%</Text>
      </View>
      <View style={[styles.categoryIcon, { backgroundColor: item.bgColor || color + "20" }]}>
        <Ionicons name={item.icon as any || "ellipse"} size={20} color={color} />
      </View>
      <Text style={styles.categoryName}>{item.categoryName}</Text>
      <Text style={styles.categoryAmount}>{formatAmount(item.amount)}</Text>
    </View>
  );
};

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("monthly");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("expense");

  const {
    totalIncome,
    totalExpenses,
    incomeBreakdown,
    expenseBreakdown,
    loading,
    error,
    refetch
  } = useCategoryAnalytics(selectedPeriod, selectedDate);

  const { formatAmount } = useCurrency();

  const currentBreakdown = viewType === "expense" ? expenseBreakdown : incomeBreakdown;
  const currentTotal = viewType === "expense" ? totalExpenses : totalIncome;

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    const delta = direction === "next" ? 1 : -1;

    switch (selectedPeriod) {
      case "daily":
        newDate.setDate(newDate.getDate() + delta);
        break;
      case "weekly":
        newDate.setDate(newDate.getDate() + delta * 7);
        break;
      case "monthly":
        newDate.setMonth(newDate.getMonth() + delta);
        break;
      case "yearly":
        newDate.setFullYear(newDate.getFullYear() + delta);
        break;
    }
    setSelectedDate(newDate);
  };

  const formatDateLabel = () => {
    switch (selectedPeriod) {
      case "daily":
        return selectedDate.toLocaleDateString("en-US", {
          weekday: "short", month: "short", day: "numeric", year: "numeric"
        });
      case "weekly":
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
      case "monthly":
        return selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      case "yearly":
        return selectedDate.getFullYear().toString();
    }
  };

  const getPeriodLabel = (period: PeriodType) => {
    return period.charAt(0).toUpperCase();
  };

  const periods: PeriodType[] = ["daily", "weekly", "monthly", "yearly"];

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header with period selector */}
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
          <View style={styles.periodSelector}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive,
                  ]}
                >
                  {getPeriodLabel(period)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Navigation */}
        <View style={styles.dateNavigation}>
          <TouchableOpacity
            style={styles.dateNavButton}
            onPress={() => navigateDate("prev")}
          >
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.dateLabel}>{formatDateLabel()}</Text>
          <TouchableOpacity
            style={styles.dateNavButton}
            onPress={() => navigateDate("next")}
          >
            <Ionicons name="chevron-forward" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Income/Expense Toggle */}
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              viewType === "income" && styles.typeButtonActive,
            ]}
            onPress={() => setViewType("income")}
          >
            <Text style={[
              styles.typeButtonText,
              viewType === "income" && styles.typeButtonTextActive,
            ]}>
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              viewType === "expense" && styles.typeButtonActiveExpense,
            ]}
            onPress={() => setViewType("expense")}
          >
            <Text style={[
              styles.typeButtonText,
              viewType === "expense" && styles.typeButtonTextActive,
            ]}>
              Exp. {loading ? "" : formatAmount(totalExpenses)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Indicator line */}
        <View style={styles.indicatorContainer}>
          <View style={[
            styles.indicatorLine,
            viewType === "income" ? styles.indicatorIncome : styles.indicatorExpense,
            { marginLeft: viewType === "income" ? 0 : "50%" }
          ]} />
        </View>

        {/* Pie Chart */}
        <PieChart data={currentBreakdown} loading={loading} viewType={viewType} />

        {/* Category Breakdown List */}
        <View style={styles.categoryList}>
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <View key={index} style={styles.categoryItem}>
                <Skeleton width={50} height={24} borderRadius={12} />
                <Skeleton width={36} height={36} borderRadius={10} />
                <Skeleton width={100} height={16} />
                <View style={{ flex: 1 }} />
                <Skeleton width={70} height={16} />
              </View>
            ))
          ) : (
            currentBreakdown.map((item, index) => (
              <CategoryItem
                key={item.categoryId}
                item={item}
                index={index}
                formatAmount={formatAmount}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  periodButtonTextActive: {
    color: colors.white,
  },
  dateNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  dateNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  typeToggle: {
    flexDirection: "row",
    marginHorizontal: spacing.xl,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  typeButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.income,
  },
  typeButtonActiveExpense: {
    borderBottomWidth: 2,
    borderBottomColor: colors.expense,
  },
  typeButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  typeButtonTextActive: {
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
  },
  indicatorContainer: {
    height: 3,
    backgroundColor: colors.cardBg,
    marginHorizontal: spacing.xl,
  },
  indicatorLine: {
    width: "50%",
    height: 3,
  },
  indicatorIncome: {
    backgroundColor: colors.income,
  },
  indicatorExpense: {
    backgroundColor: colors.expense,
  },
  chartContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  chartWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  chartCenterLabel: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  chartCenterIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  chartCenterName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  chartCenterPercent: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  skeletonChart: {
    alignItems: "center",
    justifyContent: "center",
    height: CHART_SIZE,
  },
  emptyChart: {
    alignItems: "center",
    justifyContent: "center",
    height: CHART_SIZE - 80,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  categoryList: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  percentageBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    minWidth: 50,
    alignItems: "center",
  },
  percentageText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  categoryAmount: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.sizes.md,
    color: colors.expense,
    marginTop: spacing.md,
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
});
