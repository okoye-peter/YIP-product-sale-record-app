import * as SQLite from 'expo-sqlite';
import { Product } from '../store/slices/productSlice';

const DATABASE_NAME = 'products.db';

export const getDBConnection = async () => {
  return await SQLite.openDatabaseAsync(DATABASE_NAME);
};

export const initDatabase = async () => {
  const db = await getDBConnection();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      quantityToWarn INTEGER NOT NULL,
      image TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY NOT NULL,
      productId TEXT NOT NULL,
      customerName TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (productId) REFERENCES products (id)
    );
  `);
};

export const saveSale = async (sale: { id: string; productId: string; customerName: string; quantity: number; createdAt: number }) => {
  const db = await getDBConnection();
  await db.runAsync(
    'INSERT INTO sales (id, productId, customerName, quantity, createdAt) VALUES (?, ?, ?, ?, ?)',
    [sale.id, sale.productId, sale.customerName, sale.quantity, sale.createdAt]
  );
};

export const saveProduct = async (product: Product) => {
  const db = await getDBConnection();
  await db.runAsync(
    'INSERT INTO products (id, name, price, quantity, quantityToWarn, image, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [product.id, product.name, product.price, product.quantity, product.quantityToWarn, product.image, product.createdAt]
  );
};

export const deleteProduct = async (id: string) => {
  const db = await getDBConnection();
  await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
};

export const updateProductQuantity = async (id: string, newQuantity: number) => {
  const db = await getDBConnection();
  await db.runAsync('UPDATE products SET quantity = ? WHERE id = ?', [newQuantity, id]);
};

export const getAllProducts = async (): Promise<Product[]> => {
  const db = await getDBConnection();
  const allRows = await db.getAllAsync<Product>('SELECT * FROM products ORDER BY createdAt DESC');
  return allRows;
};

export const getAllSales = async () => {
  const db = await getDBConnection();
  const allRows = await db.getAllAsync<any>(`
    SELECT sales.*, products.name as productName, products.image as productImage 
    FROM sales 
    JOIN products ON sales.productId = products.id 
    ORDER BY sales.createdAt DESC
  `);
  return allRows;
};

export const getProductSales = async (productId: string) => {
  const db = await getDBConnection();
  const allRows = await db.getAllAsync<any>(
    'SELECT * FROM sales WHERE productId = ? ORDER BY createdAt DESC',
    [productId]
  );
  return allRows;
};
