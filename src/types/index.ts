export interface Transaction {
  id?: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  currency: string;
  date: string;
}

export type FilterType = 'all' | 'income' | 'expense';

export const COLORS = {
  navy: '#1F2A44',
  warmBeige: '#E8DCC8',
  softGold: '#C6A75E',
  bgLight: '#FAF7F2',
  cardBg: '#FFFFFF',
  textDark: '#1F2A44',
  textMuted: '#7A7265',
  incomeGreen: '#2D6A4F',
  expenseRed: '#BA181B',
  border: '#D9CEBD',
};

export const CATEGORIES = [
  'Maaş',
  'Market & Yemek',
  'Ulaşım',
  'Faturalar',
  'Eğlence & Hobi',
  'Kira',
  'Yatırım',
  'Diğer',
];