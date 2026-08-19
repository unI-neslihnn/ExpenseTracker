import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { COLORS } from '../types';

const INCOME_CHART_COLORS = ['#1F2A44', '#4A6B6C', '#607D8B', '#8395A7', '#C6A75E', '#D9CEBD'];
const EXPENSE_CHART_COLORS = ['#8B5D33', '#C6A75E', '#A0522D', '#D2691E', '#1F2A44', '#7A7265'];

export const AnalyticsScreen = ({ transactions, convertToTRY }) => {
  const incomeChartData = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => {
      const tryAmount = convertToTRY(curr.amount, curr.currency);
      const existing = acc.find((item) => item.text === curr.category);
      if (existing) {
        existing.value += tryAmount;
      } else {
        acc.push({
          value: tryAmount,
          text: curr.category,
          color: INCOME_CHART_COLORS[acc.length % INCOME_CHART_COLORS.length],
        });
      }
      return acc;
    }, []);

  const expenseChartData = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => {
      const tryAmount = convertToTRY(curr.amount, curr.currency);
      const existing = acc.find((item) => item.text === curr.category);
      if (existing) {
        existing.value += tryAmount;
      } else {
        acc.push({
          value: tryAmount,
          text: curr.category,
          color: EXPENSE_CHART_COLORS[acc.length % EXPENSE_CHART_COLORS.length],
        });
      }
      return acc;
    }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Gelir Grafiği */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Kategori Bazlı Gelir Dağılımı (₺)</Text>
        {incomeChartData.length > 0 ? (
          <View style={styles.chartContent}>
            <PieChart
              data={incomeChartData}
              donut
              radius={46}
              innerRadius={28}
              innerCircleColor={COLORS.cardBg}
            />
            <View style={styles.legendContainer}>
              {incomeChartData.map((item, index) => (
                <View key={index} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText} numberOfLines={1}>
                    {item.text}: <Text style={styles.bold}>{Math.round(item.value).toLocaleString('tr-TR')} ₺</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>Henüz kayıtlı bir gelir bulunmuyor.</Text>
        )}
      </View>

      {/* Gider Grafiği */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Kategori Bazlı Gider Dağılımı (₺)</Text>
        {expenseChartData.length > 0 ? (
          <View style={styles.chartContent}>
            <PieChart
              data={expenseChartData}
              donut
              radius={46}
              innerRadius={28}
              innerCircleColor={COLORS.cardBg}
            />
            <View style={styles.legendContainer}>
              {expenseChartData.map((item, index) => (
                <View key={index} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText} numberOfLines={1}>
                    {item.text}: <Text style={styles.bold}>{Math.round(item.value).toLocaleString('tr-TR')} ₺</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>Henüz kayıtlı bir gider bulunmuyor.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  chartCard: {
    backgroundColor: COLORS.cardBg,
    marginBottom: 16,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFE9DF',
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  legendContainer: {
    flex: 1,
    marginLeft: 18,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textDark,
  },
  bold: {
    fontWeight: '700',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 14,
  },
});