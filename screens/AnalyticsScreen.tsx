import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme";
import { monthlyData, totalIncome, totalExpenses, historyData } from "../data";
import { formatCurrency } from "../utils/formatters";

const BarChart = () => {
  const maxValue = Math.max(...monthlyData.map((d) => Math.max(d.income, d.expense)));

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

      <View style={styles.chart}>
        <View style={styles.yAxis}>
          <Text style={styles.yAxisLabel}>${maxValue}</Text>
          <Text style={styles.yAxisLabel}>${Math.round(maxValue * 0.66)}</Text>
          <Text style={styles.yAxisLabel}>${Math.round(maxValue * 0.33)}</Text>
          <Text style={styles.yAxisLabel}>$0</Text>
        </View>
        <View style={styles.bars}>
          {monthlyData.map((data, index) => (
            <View key={index} style={styles.barGroup}>
              <View style={styles.barPair}>
                <View
                  style={[
                    styles.bar,
                    styles.incomeBar,
                    { height: (data.income / maxValue) * 120 },
                  ]}
                />
                <View
                  style={[
                    styles.bar,
                    styles.expenseBar,
                    { height: (data.expense / maxValue) * 120 },
                  ]}
                />
              </View>
              <Text style={styles.xAxisLabel}>{data.month}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const SummaryCards = () => (
  <View style={styles.summaryContainer}>
    <View style={styles.summaryCard}>
      <View style={[styles.summaryIcon, { backgroundColor: "#FEE2E2" }]}>
        <Text style={{ fontSize: 20 }}>🐷</Text>
      </View>
      <View>
        <Text style={styles.summaryAmount}>{formatCurrency(totalIncome)}</Text>
        <Text style={styles.summaryLabel}>Income</Text>
      </View>
    </View>
    <View style={styles.summaryCard}>
      <View style={[styles.summaryIcon, { backgroundColor: "#DCFCE7" }]}>
        <Text style={{ fontSize: 20 }}>💵</Text>
      </View>
      <View>
        <Text style={styles.summaryAmount}>{formatCurrency(totalExpenses)}</Text>
        <Text style={styles.summaryLabel}>Expenses</Text>
      </View>
    </View>
  </View>
);

const HistorySection = () => (
  <View style={styles.historyContainer}>
    <Text style={styles.historyTitle}>History</Text>
    {historyData.map((item, index) => (
      <View key={index} style={styles.historyItem}>
        <View>
          <Text style={styles.historyLabel}>Date</Text>
          <Text style={styles.historyDate}>{item.date}</Text>
        </View>
        <View style={styles.historyAmounts}>
          <Text style={styles.historyIncome}>- ${item.income.toLocaleString()}</Text>
          <Text style={styles.historyExpense}>- ${item.expense.toLocaleString()}</Text>
        </View>
      </View>
    ))}
  </View>
);

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
        </View>

        <BarChart />
        <SummaryCards />
        <HistorySection />
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
