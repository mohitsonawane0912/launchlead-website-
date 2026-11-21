import crypto from 'crypto';
import type { IncomingMessage, ServerResponse } from 'http';

const COOKIE_NAME = 'aedvix_admin_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD &&
    process.env.ADMIN_SESSION_SECRET &&
    process.env.ADMIN_PASSWORD.trim().length > 0 &&
    process.env.ADMIN_SESSION_SECRET.trim().length > 0
  );
}

export function verifyAdminPassword(password: string): boolean {
  if (!isAuthConfigured()) {
    return false;
  }

  const expectedPassword = process.env.ADMIN_PASSWORD || '';
  const expectedBuffer = Buffer.from(expectedPassword);
  const providedBuffer = Buffer.from(password);

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

export function createSessionToken(): string {
  if (!isAuthConfigured()) {
    throw new Error('Admin authentication is not configured in .env');
  }

  const secret = process.env.ADMIN_SESSION_SECRET || '';
  const payload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + SESSION_DURATION_MS,
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadStr)
    .digest('base64url');

  return `${payloadStr}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  if (!token || !isAuthConfigured()) {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return false;
  }

  const [payloadStr, signature] = parts;
  const secret = process.env.ADMIN_SESSION_SECRET || '';

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payloadStr)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedSigBuffer.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    if (payload.role !== 'admin' || Date.now() > payload.exp) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getSessionFromRequest(req: IncomingMessage): boolean {
  const cookieHeader = req.headers['cookie'] || '';
  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies[COOKIE_NAME];

  if (!sessionToken) {
    return false;
  }

  return verifySessionToken(sessionToken);
}

export function setSessionCookie(res: ServerResponse, token: string): void {
  const maxAge = Math.floor(SESSION_DURATION_MS / 1000);
  const cookieValue = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
  res.setHeader('Set-Cookie', cookieValue);
}

export function clearSessionCookie(res: ServerResponse): void {
  const cookieValue = `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
  res.setHeader('Set-Cookie', cookieValue);
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts.shift()?.trim();
    if (name) {
      list[name] = decodeURIComponent(parts.join('='));
    }
  });

  return list;
}
