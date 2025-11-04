import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const db = new sqlite3.Database('./sweet_shop.db');

// Promisify database methods with correct signatures
export const dbRun = (sql: string, params?: any[]): Promise<{ lastID: number; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params || [], function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = <T = any>(sql: string, params?: any[]): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params || [], (err, row) => {
      if (err) reject(err);
      else resolve(row as T);
    });
  });
};

export const dbAll = <T = any>(sql: string, params?: any[]): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params || [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
};

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT,
          phone TEXT,
          role TEXT NOT NULL DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Add name and phone columns if they don't exist (migration)
        db.all("PRAGMA table_info(users)", [], (pragmaErr, rows: any) => {
          if (pragmaErr) {
            reject(pragmaErr);
            return;
          }
          
          const hasName = Array.isArray(rows) && rows.some((row: any) => row.name === 'name');
          const hasPhone = Array.isArray(rows) && rows.some((row: any) => row.name === 'phone');
          
          if (!hasName) {
            db.run(`ALTER TABLE users ADD COLUMN name TEXT`, () => {});
          }
          if (!hasPhone) {
            db.run(`ALTER TABLE users ADD COLUMN phone TEXT`, () => {});
          }
        });
      });

      // Sweets table
      db.run(`
        CREATE TABLE IF NOT EXISTS sweets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          category TEXT NOT NULL,
          price REAL NOT NULL,
          price_per_kilo REAL,
          quantity REAL NOT NULL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Check if price_per_kilo column exists, if not add it (migration)
        db.all("PRAGMA table_info(sweets)", [], (pragmaErr, rows: any) => {
          if (pragmaErr) {
            reject(pragmaErr);
            return;
          }
          
          const hasPricePerKilo = Array.isArray(rows) && rows.some((row: any) => row.name === 'price_per_kilo');
          
          if (!hasPricePerKilo) {
            db.run(`
              ALTER TABLE sweets ADD COLUMN price_per_kilo REAL
            `, (alterErr) => {
              if (alterErr) {
                // Column might already exist, ignore error
                console.log('Note: price_per_kilo column may already exist');
              }
            });
          }
        });
      });

      // Purchases table (for tracking user purchases)
      db.run(`
        CREATE TABLE IF NOT EXISTS purchases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          sweet_id INTEGER NOT NULL,
          quantity REAL NOT NULL,
          price_per_kg REAL NOT NULL,
          total_price REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (sweet_id) REFERENCES sweets(id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};

export default db;

