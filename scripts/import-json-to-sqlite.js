/**
 * AEDVIX Safe Local JSON to SQLite Import Script
 * 
 * Safely imports existing submissions from data/registrations.json and data/enquiries.json
 * into the local SQLite database (data/aedvix.db).
 * 
 * Usage:
 *   node scripts/import-json-to-sqlite.js
 * 
 * Privacy & Security Notice:
 *   Does NOT print personal data (names, emails, phones, ideas) to logs.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../data');
const dbPath = process.env.SQLITE_DB_PATH || path.join(dataDir, 'aedvix.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

// Ensure tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    grade TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    plan TEXT NOT NULL,
    startup_idea TEXT,
    guardian_consent INTEGER NOT NULL DEFAULT 0,
    privacy_consent INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Closed'))
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Closed'))
  );
`);

function importRegistrations() {
  const filePath = path.join(dataDir, 'registrations.json');
  if (!fs.existsSync(filePath)) {
    console.log('No data/registrations.json file found. Skipping.');
    return 0;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let records = [];
  try {
    records = JSON.parse(raw);
  } catch {
    console.error('Error parsing data/registrations.json.');
    return 0;
  }

  if (!Array.isArray(records) || records.length === 0) {
    console.log('data/registrations.json contains no records.');
    return 0;
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO registrations (
      id, created_at, full_name, age, grade, city, state, email, mobile, plan, startup_idea, guardian_consent, privacy_consent, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let count = 0;
  for (const r of records) {
    stmt.run(
      r.id || crypto.randomUUID(),
      r.submittedAt || r.created_at || new Date().toISOString(),
      r.fullName || r.full_name || '',
      parseInt(String(r.age), 10) || 0,
      r.grade || '',
      r.city || '',
      r.state || '',
      r.email || '',
      r.mobile || '',
      r.plan || '',
      r.startupIdea || r.startup_idea || null,
      r.guardianConsent ? 1 : 0,
      r.privacyConsent ? 1 : 0,
      r.status || 'New'
    );
    count++;
  }

  return count;
}

function importEnquiries() {
  const filePath = path.join(dataDir, 'enquiries.json');
  if (!fs.existsSync(filePath)) {
    console.log('No data/enquiries.json file found. Skipping.');
    return 0;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let records = [];
  try {
    records = JSON.parse(raw);
  } catch {
    console.error('Error parsing data/enquiries.json.');
    return 0;
  }

  if (!Array.isArray(records) || records.length === 0) {
    return 0;
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO enquiries (id, created_at, name, email, message, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  let count = 0;
  for (const e of records) {
    stmt.run(
      e.id || crypto.randomUUID(),
      e.submittedAt || e.created_at || new Date().toISOString(),
      e.name || '',
      e.email || '',
      e.message || '',
      e.status || 'New'
    );
    count++;
  }

  return count;
}

console.log('Importing records into local SQLite database...');
const regImported = importRegistrations();
const enqImported = importEnquiries();
console.log(`Import complete:`);
console.log(`- Registrations: ${regImported}`);
console.log(`- Enquiries: ${enqImported}`);
console.log(`Database saved at: ${dbPath}`);
