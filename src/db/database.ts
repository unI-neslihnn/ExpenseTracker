import * as SQLite from 'expo-sqlite';
import { Transaction } from '../types';

let db: SQLite.SQLiteDatabase;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync('expenses.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      currency TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);
};

export const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
  const result = await db.runAsync(
    `INSERT INTO transactions (title, amount, type, category, currency, date) VALUES (?, ?, ?, ?, ?, ?);`,
    [tx.title, tx.amount, tx.type, tx.category, tx.currency, tx.date]
  );
  return result.lastInsertRowId;
};

export const deleteTransaction = async (id: number) => {
  await db.runAsync(`DELETE FROM transactions WHERE id = ?;`, [id]);
};

export const getTransactions = async (filters?: {
  search?: string;
  type?: string;
  category?: string;
}): Promise<Transaction[]> => {
  let query = `SELECT * FROM transactions WHERE 1=1`;
  const params: any[] = [];

  if (filters?.search && filters.search.trim() !== '') {
    query += ` AND title LIKE ?`;
    params.push(`%${filters.search.trim()}%`);
  }
  if (filters?.type && filters.type !== 'all') {
    query += ` AND type = ?`;
    params.push(filters.type);
  }
  if (filters?.category && filters.category !== 'all') {
    query += ` AND category = ?`;
    params.push(filters.category);
  }

  query += ` ORDER BY date DESC, id DESC;`;
  return await db.getAllAsync<Transaction>(query, params);
};

export const getAllDataForBackup = async (): Promise<Transaction[]> => {
  return await db.getAllAsync<Transaction>(`SELECT * FROM transactions;`);
};

export const restoreData = async (data: Transaction[]) => {
  await db.execAsync(`DELETE FROM transactions;`);
  for (const item of data) {
    await db.runAsync(
      `INSERT INTO transactions (title, amount, type, category, currency, date) VALUES (?, ?, ?, ?, ?, ?);`,
      [item.title, item.amount, item.type, item.category, item.currency, item.date]
    );
  }
};