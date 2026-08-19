import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-gifted-charts';

import { COLORS } from './src/types';
import { initDB, addTransaction, getTransactions, deleteTransaction } from './src/db/database';
import { fetchCurrencyRates } from './src/services/currencyService';
import { exportBackup } from './src/services/backupService';

import { SummaryCard } from './src/components/SummaryCard';
import { TransactionItem } from './src/components/TransactionItem';
import { AddModal } from './src/components/AddModal';

const CHART_COLORS = ['#1F2A44', '#C6A75E', '#8B5D33', '#4A6B6C', '#813405', '#526E48'];

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [rates, setRates] = useState({});
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      await initDB();
      await loadTransactions();
      const fetchedRates = await fetchCurrencyRates();
      setRates(fetchedRates);
    })();
  }, []);

  const loadTransactions = async () => {
    const list = await getTransactions({ search, type: filterType });
    setTransactions(list);
  };

  useEffect(() => {
    loadTransactions();
  }, [search, filterType]);

  const handleAddTransaction = async (tx) => {
    await addTransaction(tx);
    await loadTransactions();
  };

  const handleDelete = (id) => {
    Alert.alert('Sil', 'Bu işlemi silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(id);
          await loadTransactions();
        },
      },
    ]);
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenseChartData = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.text === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({
          value: curr.amount,
          text: curr.category,
          color: CHART_COLORS[acc.length % CHART_COLORS.length],
        });
      }
      return acc;
    }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgLight} />

      {/* Üst Başlık ve Yedekleme Butonu */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>Expense Tracker</Text>
          <Text style={styles.appSubtitle}>Kişisel Finans Takibi</Text>
        </View>
        <TouchableOpacity style={styles.headerIconBtn} onPress={exportBackup} activeOpacity={0.7}>
          <Ionicons name="cloud-download-outline" size={20} color={COLORS.navy} />
          <Text style={styles.backupBtnText}>Yedekle</Text>
        </TouchableOpacity>
      </View>

      {/* Kart ve Finansal Özet */}
      <SummaryCard
        income={totalIncome}
        expense={totalExpense}
        usdRate={rates.USD}
        eurRate={rates.EUR}
      />

      {/* Arama ve Filtreleme */}
      <View style={styles.filterSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            placeholder="İşlem ara..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          {search !== '' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.chipsRow}>
          {['all', 'income', 'expense'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.filterChip, filterType === type && styles.filterChipActive]}
              onPress={() => setFilterType(type)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterType === type && styles.filterChipTextActive,
                ]}
              >
                {type === 'all' ? 'Tümü' : type === 'income' ? 'Gelirler' : 'Giderler'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Gider Grafiği */}
      {expenseChartData.length > 0 && filterType !== 'income' && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Kategori Bazlı Gider Dağılımı</Text>
          <View style={styles.chartContent}>
            <PieChart
              data={expenseChartData}
              donut
              radius={38}
              innerRadius={22}
              innerCircleColor={COLORS.cardBg}
            />
            <View style={styles.legendContainer}>
              {expenseChartData.slice(0, 3).map((item, index) => (
                <View key={index} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText} numberOfLines={1}>
                    {item.text}: <Text style={{ fontWeight: '700' }}>{item.value.toLocaleString('tr-TR')} ₺</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Liste */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={44} color={COLORS.border} />
            <Text style={styles.emptyText}>Henüz bir işlem kaydı yok.</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={32} color={COLORS.warmBeige} />
      </TouchableOpacity>

      {/* Ekleme Modalı */}
      <AddModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddTransaction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.navy,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  headerIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warmBeige,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  backupBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textDark,
  },
  chipsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  filterChipText: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: COLORS.warmBeige,
    fontWeight: '700',
  },
  chartCard: {
    backgroundColor: COLORS.cardBg,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFE9DF',
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 10,
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
    marginLeft: 16,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
  listContent: {
    paddingBottom: 110,
    paddingTop: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
});