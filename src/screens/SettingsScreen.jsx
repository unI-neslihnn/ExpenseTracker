import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../types';
import { exportBackup } from '../services/backupService';

export const SettingsScreen = ({ rates }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Veri Yönetimi</Text>
        <TouchableOpacity style={styles.rowBtn} onPress={exportBackup}>
          <View style={styles.rowLeft}>
            <Ionicons name="cloud-download-outline" size={22} color={COLORS.navy} />
            <Text style={styles.rowText}>Verileri Yedekle (JSON)</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Anlık Kurlar (TL Bazlı)</Text>
        <View style={styles.rateRow}>
          <Text style={styles.rateLabel}>USD / TRY</Text>
          <Text style={styles.rateValue}>{rates.USD ? (1 / rates.USD).toFixed(2) : '-'} ₺</Text>
        </View>
        <View style={styles.rateRow}>
          <Text style={styles.rateLabel}>EUR / TRY</Text>
          <Text style={styles.rateValue}>{rates.EUR ? (1 / rates.EUR).toFixed(2) : '-'} ₺</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
    padding: 16,
  },
  sectionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFE9DF',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE1',
  },
  rateLabel: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  rateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.navy,
  },
});