import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from './src/types';
import { initDB, addTransaction, getTransactions, deleteTransaction } from './src/db/database';
import { fetchCurrencyRates } from './src/services/currencyService';

import { HomeScreen } from './src/screens/HomeScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [rates, setRates] = useState({ TRY: 1, USD: 0.03, EUR: 0.028 });
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    (async () => {
      await initDB();
      await loadAllData();
      const fetchedRates = await fetchCurrencyRates();
      if (fetchedRates) {
        setRates(fetchedRates);
      }
    })();
  }, []);

  const loadAllData = useCallback(async () => {
    const all = await getTransactions({ search: '', type: 'all' });
    setAllTransactions(all);

    const filtered = await getTransactions({ search, type: filterType });
    setFilteredTransactions(filtered);
  }, [search, filterType]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleAddTransaction = async (tx) => {
    await addTransaction(tx);
    await loadAllData();
  };

  const handleDelete = (id) => {
    Alert.alert('Sil', 'Bu işlemi silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(id);
          await loadAllData();
        },
      },
    ]);
  };

  const convertToTRY = (amount, currency) => {
    if (!currency || currency === 'TRY') return amount;
    if (currency === 'USD' && rates.USD) return amount / rates.USD;
    if (currency === 'EUR' && rates.EUR) return amount / rates.EUR;
    return amount;
  };

  const totalIncome = allTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + convertToTRY(curr.amount, curr.currency), 0);

  const totalExpense = allTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + convertToTRY(curr.amount, curr.currency), 0);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgLight} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: COLORS.bgLight, elevation: 0, shadowOpacity: 0 },
          headerTitleStyle: { fontWeight: '800', color: COLORS.navy, fontSize: 20 },
          tabBarStyle: {
            backgroundColor: COLORS.cardBg,
            borderTopColor: COLORS.border,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: COLORS.navy,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarIcon: ({ color, size }) => {
            let iconName = 'wallet-outline';
            if (route.name === 'Home') iconName = 'wallet-outline';
            else if (route.name === 'Analiz') iconName = 'pie-chart-outline';
            else if (route.name === 'Ayarlar') iconName = 'settings-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          options={{
            headerTitle: 'Expense Tracker',
            tabBarLabel: 'Ana Sayfa',
          }}
        >
          {() => (
            <HomeScreen
              transactions={filteredTransactions}
              rates={rates}
              search={search}
              setSearch={setSearch}
              filterType={filterType}
              setFilterType={setFilterType}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDelete}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Analiz"
          options={{
            headerTitle: 'Harcama Analizi',
            tabBarLabel: 'Analiz',
          }}
        >
          {() => (
            <AnalyticsScreen
              transactions={allTransactions}
              convertToTRY={convertToTRY}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Ayarlar"
          options={{
            headerTitle: 'Ayarlar & Yedek',
            tabBarLabel: 'Ayarlar',
          }}
        >
          {() => <SettingsScreen rates={rates} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}