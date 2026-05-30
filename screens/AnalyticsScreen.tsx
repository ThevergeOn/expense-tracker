import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme";
import { formatCurrency } from "../utils/formatters";
import { MonthlyData } from "../types";
import { useAnalytics } from "../hooks";

interface BarChartProps {
  data: MonthlyData[];
  loading: boolean;
}

const BarChart = ({ data, loading }: BarChartProps) => {
  const maxValue = data.length > 0
    ? Math.max(...data.map((d) => Math.max(d.income, d.expense)))
    : 1000;

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <TouchableOpacity style={styles.monthSelector}>
          <Text style={styles.monthText}>Monthly</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.income }]} />
            <Text style={styles.legendText}>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
            <Text style={styles.legendText}>Expense</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.chartLoading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : data.length === 0 ? (
        <View style={styles.chartEmpty}>
          <Text style={styles.chartEmptyText}>No data available</Text>
        </View>
      ) : (
        <View style={styles.chart}>
          <View style={styles.yAxis}>
            <Text style={styles.yAxisLabel}>${maxValue}</Text>
            <Text style={styles.yAxisLabel}>${Math.round(maxValue * 0.66)}</Text>
            <Text style={styles.yAxisLabel}>${Math.round(maxValue * 0.33)}</Text>
            <Text style={styles.yAxisLabel}>$0</Text>
          </View>
          <View style={styles.bars}>
            {data.map((item, index) => (
              <View key={index} style={styles.barGroup}>
                <View style={styles.barPair}>
                  <View
                    style={[
                      styles.bar,
                      styles.incomeBar,
                      { height: Math.max((item.income / maxValue) * 120, 2) },
                    ]}
                  />
                  <View
                    style={[
                      styles.bar,
                      styles.expenseBar,
                      { height: Math.max((item.expense / maxValue) * 120, 2) },
                    ]}
                  />
                </View>
                <Text style={styles.xAxisLabel}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  loading: boolean;
}

const SummaryCards = ({ totalIncome, totalExpenses, loading }: SummaryCardsProps) => (
  <View style={styles.summaryContainer}>
    <View style={styles.summaryCard}>
      <View style={[styles.summaryIcon, { backgroundColor: "#DCFCE7" }]}>
        <Ionicons name="trending-up" size={20} color={colors.income} />
      </View>
      <View>
        {loading ? (
          <ActivityIndicator size="small" color={colors.income} />
        ) : (
          <Text style={styles.summaryAmount}>{formatCurrency(totalIncome)}</Text>
        )}
        <Text style={styles.summaryLabel}>Income</Text>
      </View>
    </View>
    <View style={styles.summaryCard}>
      <View style={[styles.summaryIcon, { backgroundColor: "#FEE2E2" }]}>
        <Ionicons name="trending-down" size={20} color={colors.expense} />
      </View>
      <View>
        {loading ? (
          <ActivityIndicator size="small" color={colors.expense} />
        ) : (
          <Text style={styles.summaryAmount}>{formatCurrency(totalExpenses)}</Text>
        )}
        <Text style={styles.summaryLabel}>Expenses</Text>
      </View>
    </View>
  </View>
);

interface HistorySectionProps {
  data: MonthlyData[];
  loading: boolean;
}

const HistorySection = ({ data, loading }: HistorySectionProps) => (
  <View style={styles.historyContainer}>
    <Text style={styles.historyTitle}>History</Text>
    {loading ? (
      <View style={styles.historyLoading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    ) : data.length === 0 ? (
      <View style={styles.historyEmpty}>
        <Text style={styles.historyEmptyText}>No history available</Text>
      </View>
    ) : (
      data.map((item, index) => (
        <View key={index} style={styles.historyItem}>
          <View>
            <Text style={styles.historyLabel}>Month</Text>
            <Text style={styles.historyDate}>{item.month}</Text>
          </View>
          <View style={styles.historyAmounts}>
            <Text style={styles.historyIncome}>+{formatCurrency(item.income)}</Text>
            <Text style={styles.historyExpense}>-{formatCurrency(item.expense)}</Text>
          </View>
        </View>
      ))
    )}
  </View>
);

export default function AnalyticsScreen() {
  const { monthlyData, totalIncome, totalExpenses, loading, error, refetch } = useAnalytics();

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
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
        </View>

        <BarChart data={monthlyData} loading={loading} />
        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          loading={loading}
        />
        <HistorySection data={monthlyData} loading={loading} />
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: "center",
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
  chartContainer: {
    backgroundColor: colors.cardBg,
    marginHorizontal: spacing.xl,
    borderRadius: 16,
    padding: spacing.lg,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs,
  },
  monthText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  legend: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  chartLoading: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  chartEmpty: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  chartEmptyText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  chart: {
    flexDirection: "row",
    height: 150,
  },
  yAxis: {
    justifyContent: "space-between",
    paddingRight: spacing.sm,
  },
  yAxisLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  bars: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  barGroup: {
    alignItems: "center",
  },
  barPair: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  bar: {
    width: 12,
    borderRadius: 4,
  },
  incomeBar: {
    backgroundColor: colors.income,
  },
  expenseBar: {
    backgroundColor: colors.expense,
  },
  xAxisLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryAmount: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  summaryLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  historyContainer: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    paddingBottom: 100,
  },
  historyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  historyLoading: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  historyEmpty: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  historyEmptyText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  historyItem: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  historyDate: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  historyAmounts: {
    alignItems: "flex-end",
  },
  historyIncome: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.income,
  },
  historyExpense: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.expense,
  },
});
