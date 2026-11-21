import type { IncomingMessage, ServerResponse } from 'http';
import { validateContactEnquiry, validateStudentRegistration } from './validation';
import {
  saveEnquiry,
  saveRegistration,
  checkRateLimit,
  getAdminRegistrations,
  getAdminEnquiries,
  updateRegistrationStatus,
  updateEnquiryStatus,
} from './storage';
import {
  isAuthConfigured,
  verifyAdminPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSessionFromRequest,
} from './auth';

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer | string) => {
      body += chunk.toString();
      // 1MB body limit protection
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', (err: Error) => reject(err));
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export function createApiMiddleware() {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const fullUrl = req.url || '';
    const [path] = fullUrl.split('?');

    // ------------------------------------------------------------------------
    // Public Endpoints
    // ------------------------------------------------------------------------

    // Public Contact API
    if (path === '/api/contact') {
      if (req.method !== 'POST') {
        return sendJson(res, 405, { success: false, message: 'Method Not Allowed' });
      }

      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
      if (!checkRateLimit(clientIp)) {
        return sendJson(res, 429, {
          success: false,
          message: 'Too many requests. Please wait a moment and try again.',
        });
      }

      try {
        const body = await parseJsonBody(req);
        const validation = validateContactEnquiry(body);

        if (!validation.isValid || !validation.data) {
          return sendJson(res, 400, {
            success: false,
            message: 'Validation failed.',
            errors: validation.errors,
          });
        }

        await saveEnquiry(validation.data);

        return sendJson(res, 200, {
          success: true,
          message: 'Your enquiry has been received. Thank you for reaching out!',
        });
      } catch (error: any) {
        return sendJson(res, 500, {
          success: false,
          message: error?.message || 'Unable to save enquiry at this time.',
        });
      }
    }

    // Public Student Registration API
    if (path === '/api/register') {
      if (req.method !== 'POST') {
        return sendJson(res, 405, { success: false, message: 'Method Not Allowed' });
      }

      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
      if (!checkRateLimit(clientIp)) {
        return sendJson(res, 429, {
          success: false,
          message: 'Too many requests. Please wait a moment and try again.',
        });
      }

      try {
        const body = await parseJsonBody(req);
        const validation = validateStudentRegistration(body, ['basic', 'premium']);

        if (!validation.isValid || !validation.data) {
          return sendJson(res, 400, {
            success: false,
            message: 'Validation failed.',
            errors: validation.errors,
          });
        }

        await saveRegistration(validation.data);

        return sendJson(res, 200, {
          success: true,
          message:
            'Your registration expression of interest has been successfully recorded in the local database.',
        });
      } catch (error: any) {
        return sendJson(res, 500, {
          success: false,
          message:
            error?.message || 'Unable to record registration at this time.',
        });
      }
    }

    // ------------------------------------------------------------------------
    // Owner / Admin Prototype Endpoints
    // ------------------------------------------------------------------------

    // Check Configuration and Authentication Status
    if (path === '/api/admin/status' && req.method === 'GET') {
      const configured = isAuthConfigured();
      const authenticated = configured ? getSessionFromRequest(req) : false;
      return sendJson(res, 200, {
        isConfigured: configured,
        isAuthenticated: authenticated,
      });
    }

    // Owner Login
    if (path === '/api/admin/login' && req.method === 'POST') {
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
      if (!checkRateLimit(clientIp)) {
        return sendJson(res, 429, {
          success: false,
          message: 'Too many attempts. Please wait a moment and try again.',
        });
      }

      if (!isAuthConfigured()) {
        return sendJson(res, 503, {
          success: false,
          message:
            'Admin authentication is not configured. Please set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in your .env file.',
        });
      }

      try {
        const body = await parseJsonBody(req);
        const password = String(body.password || '');

        if (!password) {
          return sendJson(res, 400, {
            success: false,
            message: 'Password is required.',
          });
        }

        if (!verifyAdminPassword(password)) {
          return sendJson(res, 401, {
            success: false,
            message: 'Invalid administrator password.',
          });
        }

        const token = createSessionToken();
        setSessionCookie(res, token);

        return sendJson(res, 200, {
          success: true,
          message: 'Authenticated successfully.',
        });
      } catch (err: any) {
        return sendJson(res, 500, {
          success: false,
          message: err?.message || 'Authentication error.',
        });
      }
    }

    // Owner Logout
    if (path === '/api/admin/logout' && req.method === 'POST') {
      clearSessionCookie(res);
      return sendJson(res, 200, {
        success: true,
        message: 'Logged out successfully.',
      });
    }

    // Fetch Registrations (Protected)
    if (path === '/api/admin/submissions' && req.method === 'GET') {
      if (!getSessionFromRequest(req)) {
        return sendJson(res, 401, {
          success: false,
          message: 'Unauthorized. Please sign in as administrator.',
        });
      }

      try {
        const urlObj = new URL(fullUrl, 'http://localhost');
        const filterStatus = urlObj.searchParams.get('status') || undefined;

        const registrations = await getAdminRegistrations(filterStatus);
        return sendJson(res, 200, {
          success: true,
          registrations,
        });
      } catch (err: any) {
        return sendJson(res, 500, {
          success: false,
          message: err?.message || 'Failed to retrieve registrations from local database.',
        });
      }
    }

    // Fetch Enquiries (Protected)
    if (path === '/api/admin/enquiries' && req.method === 'GET') {
      if (!getSessionFromRequest(req)) {
        return sendJson(res, 401, {
          success: false,
          message: 'Unauthorized. Please sign in as administrator.',
        });
      }

      try {
        const urlObj = new URL(fullUrl, 'http://localhost');
        const filterStatus = urlObj.searchParams.get('status') || undefined;

        const enquiries = await getAdminEnquiries(filterStatus);
        return sendJson(res, 200, {
          success: true,
          enquiries,
        });
      } catch (err: any) {
        return sendJson(res, 500, {
          success: false,
          message: err?.message || 'Failed to retrieve enquiries from local database.',
        });
      }
    }

    // Update Registration Status (Protected)
    if (path === '/api/admin/registrations/status' && req.method === 'PATCH') {
      if (!getSessionFromRequest(req)) {
        return sendJson(res, 401, {
          success: false,
          message: 'Unauthorized. Please sign in as administrator.',
        });
      }

      try {
        const body = await parseJsonBody(req);
        const { id, status } = body;

        if (!id || !['New', 'Contacted', 'Closed'].includes(status)) {
          return sendJson(res, 400, {
            success: false,
            message: 'Invalid registration ID or status.',
          });
        }

        const updated = await updateRegistrationStatus(id, status);
        return sendJson(res, 200, {
          success: true,
          registration: updated,
        });
      } catch (err: any) {
        return sendJson(res, 500, {
          success: false,
          message: err?.message || 'Failed to update registration status.',
        });
      }
    }

    // Update Enquiry Status (Protected)
    if (path === '/api/admin/enquiries/status' && req.method === 'PATCH') {
      if (!getSessionFromRequest(req)) {
        return sendJson(res, 401, {
          success: false,
          message: 'Unauthorized. Please sign in as administrator.',
        });
      }

      try {
        const body = await parseJsonBody(req);
        const { id, status } = body;

        if (!id || !['New', 'Contacted', 'Closed'].includes(status)) {
          return sendJson(res, 400, {
            success: false,
            message: 'Invalid enquiry ID or status.',
          });
        }

        const updated = await updateEnquiryStatus(id, status);
        return sendJson(res, 200, {
          success: true,
          enquiry: updated,
        });
      } catch (err: any) {
        return sendJson(res, 500, {
          success: false,
          message: err?.message || 'Failed to update enquiry status.',
        });
      }
    }

    // Pass through to next middleware
    next();
  };
}
