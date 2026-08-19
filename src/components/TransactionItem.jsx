import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../types';

export const TransactionItem = ({ item, onDelete }) => {
  const isIncome = item.type === 'income';

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: isIncome ? '#E6F4EA' : '#FCE8E6' }]}>
        <Ionicons
          name={isIncome ? 'arrow-down-outline' : 'arrow-up-outline'}
          size={20}
          color={isIncome ? COLORS.incomeGreen : COLORS.expenseRed}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>
          {item.category} • {item.date}
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: isIncome ? COLORS.incomeGreen : COLORS.expenseRed }]}>
          {isIncome ? '+' : '-'}
          {item.amount.toLocaleString('tr-TR')} {item.currency}
        </Text>
        <TouchableOpacity onPress={() => item.id && onDelete(item.id)} hitSlop={8}>
          <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} style={styles.trash} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFE9DF',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  meta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
  trash: {
    marginTop: 4,
  },
});