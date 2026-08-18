import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@expense_currency_rates';
const API_URL = 'https://api.exchangerate-api.com/v4/latest/TRY';

export const fetchCurrencyRates = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Döviz kuru servisine ulaşılamadı');
    const data = await response.json();
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data.rates));
    return data.rates;
  } catch (error) {
    // Offline durumu: Önbelleğe kaydedilmiş oranları kullan
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    // Varsayılan kurlar
    return { TRY: 1, USD: 0.03, EUR: 0.028 };
  }
};