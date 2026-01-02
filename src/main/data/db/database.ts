import Database from 'better-sqlite3'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { SCHEMA_SQL } from './schema'

const DB_FILE = path.join(app.getPath('userData'), 'app.db')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (db) return db

  // Ensure userData directory exists
  const dir = path.dirname(DB_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const isNew = !fs.existsSync(DB_FILE) || fs.statSync(DB_FILE).size === 0

  db = new Database(DB_FILE)
  // Enable foreign keys for this connection
  db.pragma('foreign_keys = ON')

  if (isNew) {
    db.exec(SCHEMA_SQL)
  }

  return db
}
