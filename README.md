# AEDVIX Website & Local Registration Prototype

Official landing page and student interest expression portal for **AEDVIX** (Education × Advice × Technology), built with React, TypeScript, Vite, Tailwind CSS, and a local Node.js + SQLite backend.

---

## Architecture Overview

- **Public Student Flow (`/`, `/about`, `/programs`, `/contact`, `/register`)**:
  - **Account-Free:** Anyone can open `/register` and submit an expression of interest without creating an account or password.
  - **Local Persistence:** Submissions are validated server-side and saved into a local SQLite database file (`data/aedvix.db`).
  - **Spam & Abuse Protection:** Submissions are rate-limited and protected by a honeypot field.
- **Local Owner / Administrator Portal (`/admin`)**:
  - Secure local prototype dashboard where the site owner logs in using a private prototype password configured in `.env`.
  - Authenticated via cryptographically signed `HttpOnly`, `SameSite=Lax` session cookies.
  - Displays a submissions table with date, student name, age, grade, plan, and status.
  - Clicking any student row opens a detailed view showing all fields submitted (mobile, email, location, startup goal, and consent checks).
  - Status can be updated inline to **New**, **Contacted**, or **Closed**.
  - All admin endpoints on the server reject requests without a verified owner session.

---

## 1. Quick Local Setup

### Step A: Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```

Open `.env` in any editor and set your local admin password and session signing secret:
```env
# Set your private prototype admin password for /admin
ADMIN_PASSWORD=your_secure_password_here

# Set a random secret string used to sign session cookies
ADMIN_SESSION_SECRET=your_random_secret_string_here

# Server port (default 4173)
PORT=4173
```

> **Security Note:** `.env` and `data/*.db` are excluded from Git in `.gitignore`. Never commit passwords or database files to version control.

### Step B: Start the Server

**Development Mode:**
```bash
npm run dev
```

**Production Build & Preview Server:**
```bash
npm run build
npm run preview
```

**Standalone Node Server:**
```bash
node server.js
```

---

## 2. Using the Prototype

- **Public Registration:** Open `http://localhost:4173/register` to test submitting expressions of interest.
- **Owner Review Portal:** Open `http://localhost:4173/admin`:
  - Enter your `ADMIN_PASSWORD` to sign in.
  - Review incoming student records, filter by status, search, and update review statuses.
  - Click **Sign Out** to clear your session cookie.

---

## 3. Database Location & Backup

- **Database File:** Stored at `data/aedvix.db` using Node.js's built-in SQLite engine (`node:sqlite`).
- **Data Persistence:** Submissions persist across server restarts.
- **Backing up your data:**
  To create a copy/backup of your local submissions database:
  ```bash
  cp data/aedvix.db data/aedvix.db.backup
  ```
- **Importing Legacy JSON Data:**
  If you have earlier submissions in `data/registrations.json`, you can import them into SQLite with:
  ```bash
  node scripts/import-json-to-sqlite.js
  ```

---

## 4. Local Prototype Note

This prototype is bound to localhost for local testing and demonstration. The SQLite database resides on the local filesystem (`data/aedvix.db`). It is not configured for ephemeral/serverless cloud hosts (e.g. Vercel/Netlify functions where local disk writes do not persist).
