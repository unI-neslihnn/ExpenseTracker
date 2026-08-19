import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../types';

export const SummaryCard = ({ income, expense, usdRate, eurRate }) => {
  const balance = income - expense;

  return (
    <View style={styles.card}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Toplam Bakiye</Text>
        <Text style={styles.balanceValue}>{balance.toLocaleString('tr-TR')} ₺</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Gelir</Text>
          <Text style={[styles.statValue, { color: COLORS.incomeGreen }]}>
            +{income.toLocaleString('tr-TR')} ₺
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Gider</Text>
          <Text style={[styles.statValue, { color: COLORS.expenseRed }]}>
            -{expense.toLocaleString('tr-TR')} ₺
          </Text>
        </View>
      </View>

      <View style={styles.ratesContainer}>
        <Text style={styles.rateTitle}>Canlı Kurlar (TL Karşılığı):</Text>
        <Text style={styles.rateText}>
          USD: <Text style={styles.rateHighlight}>{usdRate ? (1 / usdRate).toFixed(2) : '-'} ₺</Text>
          {'   •   '}
          EUR: <Text style={styles.rateHighlight}>{eurRate ? (1 / eurRate).toFixed(2) : '-'} ₺</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.navy,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    color: COLORS.warmBeige,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(232, 220, 200, 0.2)',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.warmBeige,
    fontSize: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  ratesContainer: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(232, 220, 200, 0.15)',
    alignItems: 'center',
  },
  rateTitle: {
    color: COLORS.warmBeige,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rateText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
  },
  rateHighlight: {
    color: COLORS.softGold,
    fontWeight: '700',
  },
});