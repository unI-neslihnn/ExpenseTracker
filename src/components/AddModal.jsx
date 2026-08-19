import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS, CATEGORIES } from '../types';

export const AddModal = ({ visible, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [currency, setCurrency] = useState('TRY');

  const handleSubmit = async () => {
    if (!title.trim() || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Geçersiz Bilgi', 'Lütfen geçerli bir başlık ve pozitif bir tutar girin.');
      return;
    }

    await onSave({
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category,
      currency,
      date: new Date().toISOString().split('T')[0],
    });

    setTitle('');
    setAmount('');
    setType('expense');
    setCategory(CATEGORIES[0]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>Yeni İşlem Ekle</Text>

          {/* Tür Seçimi (Gelir / Gider) */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, type === 'expense' && styles.activeTabExpense]}
              onPress={() => setType('expense')}
            >
              <Text style={[styles.tabText, type === 'expense' && styles.activeTabText]}>Gider</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, type === 'income' && styles.activeTabIncome]}
              onPress={() => setType('income')}
            >
              <Text style={[styles.tabText, type === 'income' && styles.activeTabText]}>Gelir</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Başlık (Örn: Market, Kahve, Maaş)"
            placeholderTextColor={COLORS.textMuted}
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Tutar"
            placeholderTextColor={COLORS.textMuted}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Para Birimi */}
          <View style={styles.currencyRow}>
            {['TRY', 'USD', 'EUR'].map((cur) => (
              <TouchableOpacity
                key={cur}
                style={[styles.currencyBtn, currency === cur && styles.currencyBtnActive]}
                onPress={() => setCurrency(cur)}
              >
                <Text style={currency === cur ? styles.currencyTextActive : styles.currencyText}>
                  {cur}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Kategori Listesi */}
          <Text style={styles.categoryLabel}>Kategori Seçin</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catBadge, category === cat && styles.catBadgeActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={category === cat ? styles.catTextActive : styles.catText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* İşlem Butonları */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
              <Text style={styles.saveText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 42, 68, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgLight,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabExpense: {
    backgroundColor: COLORS.expenseRed,
  },
  activeTabIncome: {
    backgroundColor: COLORS.incomeGreen,
  },
  tabText: {
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    color: COLORS.textDark,
    backgroundColor: '#FAF7F2',
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  currencyBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FAF7F2',
  },
  currencyBtnActive: {
    backgroundColor: COLORS.softGold,
    borderColor: COLORS.softGold,
  },
  currencyText: {
    color: COLORS.textDark,
    fontWeight: '600',
  },
  currencyTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.navy,
    marginBottom: 8,
  },
  catScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  catBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.bgLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  catBadgeActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  catText: {
    fontSize: 13,
    color: COLORS.textDark,
  },
  catTextActive: {
    fontSize: 13,
    color: COLORS.warmBeige,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  cancelText: {
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: COLORS.navy,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  saveText: {
    color: COLORS.warmBeige,
    fontWeight: '700',
  },
});