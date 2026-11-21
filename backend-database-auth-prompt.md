# Antigravity Prompt: Local Student Registration Prototype

## Goal

Make the existing AEDVIX student registration flow work end to end for a local prototype. Students submit the current form without making an account. The submission is saved in a local database, and the AEDVIX owner can sign in to a small private page to view the submitted details.

**Do not use Supabase, Firebase, or another hosted database/auth service.** This is a prototype; avoid external project setup, cloud credentials, and launch steps. Use a local SQLite database file so data persists across local server restarts.

## Existing project

The project already uses React, TypeScript, Vite, and a Node server. It has `/register`, a `POST /api/register` endpoint, server-side validation, a honeypot/rate limit, and the registration form fields. At present, `src/server/storage.ts` saves rows to `data/registrations.json`; that is temporary file storage, not the database and review screen requested here. Keep the current AEDVIX site and form design intact.

## Student registration flow

- Keep `/register` open to visitors with no login, password, or student account creation.
- Keep the current fields: student name, age, class/grade, city, state, email, mobile, selected plan, optional startup idea/interest, parent/guardian consent when under 18, and required privacy consent.
- On submit, validate on the server and save one record to a local SQLite database. Use parameterized queries and store a server timestamp and a review status such as **New**.
- Show a success message only after the database confirms the save. Keep the page clear that this is an expression of interest, not a payment or confirmed enrolment.
- Do not add student authentication, passwords, payment, or automatic enrolment.

## Owner view of submissions

- Add a small owner-only `/admin` page where the site owner can sign in and view registration records.
- Use one local prototype admin password supplied through a private `.env` variable; never hardcode it or commit it. Add a secure server-side login/logout flow with an HttpOnly, SameSite cookie, session expiry, and a secret signing key from `.env`. Do not treat a hidden URL or client-side password check as authentication.
- If the password or session secret is missing, fail closed and show setup instructions rather than leaving the submissions page open.
- After login, show a simple table with submission date, student name, age, grade, plan, and status. Let the owner open a record to see all fields submitted on the form, and optionally mark it **New**, **Contacted**, or **Closed**.
- Protect every admin page and data endpoint on the server. Visitors and logged-out users must not be able to list, read, edit, or delete registrations.
- Do not email or log student details. The `/admin` inbox is the way the owner reviews them for this prototype.

## Local database and data handling

- Use SQLite stored in a local `data/` directory and add the database file to `.gitignore`. Keep real submissions out of source control, browser storage, and public/static folders.
- Use the SQLite library already available in the project if there is one. Otherwise, choose a small SQLite library compatible with the project’s installed Node version; do not change frameworks just for storage.
- Create the table/schema automatically or through a small migration that runs when the server starts. Add appropriate types, required fields, and indexes only where useful.
- Replace registration JSON-file writes with database inserts and reads. If `data/registrations.json` already contains submissions, preserve it and provide a safe one-time import option; never print its contents or delete it automatically.
- Keep current server-side checks, including valid plan selection and required guardian consent for under-18 students. Keep rate limiting and honeypot protection. Avoid logging request bodies or personal fields.
- Add `.env.example` with names such as `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`, but no actual values. Document how the owner creates a local `.env`, starts the app, opens `/admin`, and finds/backs up the local database file.
- Bind the prototype server to localhost for local use. Document clearly that this local database belongs to the machine running the server and that this prototype is not ready to accept public registrations on a production/serverless host.

## Scope limits

- Do not add a hosted service, cloud database, student accounts, OAuth, payment checkout, LMS, course access, public submissions API, or a large admin system.
- Leave the existing Contact form and its backend behavior outside this registration task.
- Do not add fields beyond the existing student registration form or invent extra privacy/legal claims.

## Completion criteria

- A student can submit the form while logged out; no student auth account is created.
- A successful submission is saved in the local SQLite database and remains after the local server restarts.
- The owner can sign in at `/admin` and see the submitted details; the same data endpoints deny access without a valid owner session.
- If local admin secrets or database setup are missing, the site reports the setup issue honestly instead of showing false success or exposing data.
- The existing public website pages keep their current AEDVIX design and navigation.
