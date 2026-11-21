import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StoredEnquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  created_at: string;
}

export interface StoredRegistration {
  id: string;
  full_name: string;
  age: number;
  grade: string;
  city: string;
  state: string;
  email: string;
  mobile: string;
  plan: string;
  startup_idea?: string | null;
  guardian_consent: boolean;
  privacy_consent: boolean;
  status: 'New' | 'Contacted' | 'Closed';
  created_at: string;
}

// In-memory rate limiter: IP -> timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 6;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  const dataDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = process.env.SQLITE_DB_PATH || path.join(dataDir, 'aedvix.db');
  dbInstance = new DatabaseSync(dbPath);

  // Initialize Schema
  initSchema(dbInstance);

  return dbInstance;
}

function initSchema(db: DatabaseSync): void {
  // 1. Registrations table
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
    CREATE INDEX IF NOT EXISTS idx_reg_created ON registrations (created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_reg_status ON registrations (status);

    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Closed'))
    );
    CREATE INDEX IF NOT EXISTS idx_enq_created ON enquiries (created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_enq_status ON enquiries (status);
  `);

  // Optional automatic one-time seed from legacy JSON if table is empty
  autoSeedFromLegacyJson(db);
}

function autoSeedFromLegacyJson(db: DatabaseSync): void {
  try {
    const regCount = (db.prepare('SELECT count(*) as count FROM registrations').get() as any)?.count || 0;
    const regJsonPath = path.resolve(process.cwd(), 'data/registrations.json');

    if (regCount === 0 && fs.existsSync(regJsonPath)) {
      const raw = fs.readFileSync(regJsonPath, 'utf-8');
      const records = JSON.parse(raw);
      if (Array.isArray(records)) {
        const stmt = db.prepare(`
          INSERT OR IGNORE INTO registrations (
            id, created_at, full_name, age, grade, city, state, email, mobile, plan, startup_idea, guardian_consent, privacy_consent, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
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
        }
      }
    }

    const enqCount = (db.prepare('SELECT count(*) as count FROM enquiries').get() as any)?.count || 0;
    const enqJsonPath = path.resolve(process.cwd(), 'data/enquiries.json');

    if (enqCount === 0 && fs.existsSync(enqJsonPath)) {
      const raw = fs.readFileSync(enqJsonPath, 'utf-8');
      const records = JSON.parse(raw);
      if (Array.isArray(records)) {
        const stmt = db.prepare(`
          INSERT OR IGNORE INTO enquiries (id, created_at, name, email, message, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        for (const e of records) {
          stmt.run(
            e.id || crypto.randomUUID(),
            e.submittedAt || e.created_at || new Date().toISOString(),
            e.name || '',
            e.email || '',
            e.message || '',
            e.status || 'New'
          );
        }
      }
    }
  } catch {
    // Legacy seed silent pass
  }
}

// ----------------------------------------------------------------------------
// Public Student Registration Save
// ----------------------------------------------------------------------------

export async function saveRegistration(input: {
  fullName: string;
  age: number;
  grade: string;
  city: string;
  state: string;
  email: string;
  mobile: string;
  plan: string;
  startupIdea?: string;
  guardianConsent: boolean;
  privacyConsent: boolean;
}): Promise<StoredRegistration> {
  const db = getDatabase();

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const status: 'New' = 'New';

  const stmt = db.prepare(`
    INSERT INTO registrations (
      id, created_at, full_name, age, grade, city, state, email, mobile, plan, startup_idea, guardian_consent, privacy_consent, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    createdAt,
    input.fullName,
    input.age,
    input.grade,
    input.city,
    input.state,
    input.email,
    input.mobile,
    input.plan,
    input.startupIdea || null,
    input.guardianConsent ? 1 : 0,
    input.privacyConsent ? 1 : 0,
    status
  );

  return {
    id,
    created_at: createdAt,
    full_name: input.fullName,
    age: input.age,
    grade: input.grade,
    city: input.city,
    state: input.state,
    email: input.email,
    mobile: input.mobile,
    plan: input.plan,
    startup_idea: input.startupIdea || null,
    guardian_consent: input.guardianConsent,
    privacy_consent: input.privacyConsent,
    status,
  };
}

export async function saveEnquiry(input: {
  name: string;
  email: string;
  message: string;
}): Promise<StoredEnquiry> {
  const db = getDatabase();

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const status: 'New' = 'New';

  const stmt = db.prepare(`
    INSERT INTO enquiries (id, created_at, name, email, message, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, createdAt, input.name, input.email, input.message, status);

  return {
    id,
    created_at: createdAt,
    name: input.name,
    email: input.email,
    message: input.message,
    status,
  };
}

// ----------------------------------------------------------------------------
// Owner / Admin SQLite Queries
// ----------------------------------------------------------------------------

export async function getAdminRegistrations(filterStatus?: string): Promise<StoredRegistration[]> {
  const db = getDatabase();

  let query = 'SELECT * FROM registrations';
  const params: string[] = [];

  if (filterStatus && filterStatus !== 'All') {
    query += ' WHERE status = ?';
    params.push(filterStatus);
  }

  query += ' ORDER BY created_at DESC';

  const rows = db.prepare(query).all(...params) as any[];

  return rows.map((r) => ({
    id: r.id,
    created_at: r.created_at,
    full_name: r.full_name,
    age: Number(r.age),
    grade: r.grade,
    city: r.city,
    state: r.state,
    email: r.email,
    mobile: r.mobile,
    plan: r.plan,
    startup_idea: r.startup_idea,
    guardian_consent: Boolean(r.guardian_consent),
    privacy_consent: Boolean(r.privacy_consent),
    status: r.status as 'New' | 'Contacted' | 'Closed',
  }));
}

export async function getAdminEnquiries(filterStatus?: string): Promise<StoredEnquiry[]> {
  const db = getDatabase();

  let query = 'SELECT * FROM enquiries';
  const params: string[] = [];

  if (filterStatus && filterStatus !== 'All') {
    query += ' WHERE status = ?';
    params.push(filterStatus);
  }

  query += ' ORDER BY created_at DESC';

  const rows = db.prepare(query).all(...params) as any[];

  return rows.map((e) => ({
    id: e.id,
    created_at: e.created_at,
    name: e.name,
    email: e.email,
    message: e.message,
    status: e.status as 'New' | 'Contacted' | 'Closed',
  }));
}

export async function updateRegistrationStatus(
  id: string,
  status: 'New' | 'Contacted' | 'Closed'
): Promise<StoredRegistration> {
  const db = getDatabase();

  const stmt = db.prepare('UPDATE registrations SET status = ? WHERE id = ?');
  stmt.run(status, id);

  const updated = db.prepare('SELECT * FROM registrations WHERE id = ?').get(id) as any;
  if (!updated) {
    throw new Error('Registration record not found.');
  }

  return {
    id: updated.id,
    created_at: updated.created_at,
    full_name: updated.full_name,
    age: Number(updated.age),
    grade: updated.grade,
    city: updated.city,
    state: updated.state,
    email: updated.email,
    mobile: updated.mobile,
    plan: updated.plan,
    startup_idea: updated.startup_idea,
    guardian_consent: Boolean(updated.guardian_consent),
    privacy_consent: Boolean(updated.privacy_consent),
    status: updated.status as 'New' | 'Contacted' | 'Closed',
  };
}

export async function updateEnquiryStatus(
  id: string,
  status: 'New' | 'Contacted' | 'Closed'
): Promise<StoredEnquiry> {
  const db = getDatabase();

  const stmt = db.prepare('UPDATE enquiries SET status = ? WHERE id = ?');
  stmt.run(status, id);

  const updated = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id) as any;
  if (!updated) {
    throw new Error('Enquiry record not found.');
  }

  return {
    id: updated.id,
    created_at: updated.created_at,
    name: updated.name,
    email: updated.email,
    message: updated.message,
    status: updated.status as 'New' | 'Contacted' | 'Closed',
  };
}
