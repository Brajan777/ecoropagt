import crypto from 'crypto';

// Contraseña maestra del panel administrativo (configurable en Vercel con ADMIN_SECRET_KEY)
const ADMIN_MASTER_PASSWORD = process.env.ADMIN_SECRET_KEY || 'EcoRopaGT#2026!';
const TOKEN_SECRET =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'ecoropagt_internal_hmac_secret_2026';

// Control en memoria contra ataques de fuerza bruta por IP
const failedAttempts = new Map<string, { count: number; lockUntil: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = failedAttempts.get(ip);
  if (record && record.lockUntil > now) {
    return {
      allowed: false,
      waitSeconds: Math.ceil((record.lockUntil - now) / 1000),
    };
  }
  return { allowed: true };
}

export function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const current = failedAttempts.get(ip) || { count: 0, lockUntil: 0 };
  const nextCount = current.count + 1;
  // Bloquear por 5 minutos después de 5 intentos fallidos
  const lockUntil = nextCount >= 5 ? now + 5 * 60 * 1000 : 0;
  failedAttempts.set(ip, { count: nextCount, lockUntil });
}

export function clearFailedAttempts(ip: string) {
  failedAttempts.delete(ip);
}

export function verifyAdminPassword(inputPassword: string): boolean {
  const a = Buffer.from(inputPassword.trim());
  const b = Buffer.from(ADMIN_MASTER_PASSWORD);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createAdminToken(): string {
  const exp = Date.now() + 12 * 60 * 60 * 1000; // 12 horas de validez
  const payload = `admin:${exp}`;
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
  return `${payload}:${sig}`;
}

export function isValidAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const parts = token.split(':');
  if (parts.length !== 3) return false;
  const [role, expStr, sig] = parts;
  if (role !== 'admin') return false;
  const exp = Number(expStr);
  if (!exp || Date.now() > exp) return false;
  const expectedSig = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(`${role}:${expStr}`)
    .digest('hex');
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function sanitizeString(str: unknown, maxLength = 500): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .slice(0, maxLength);
}
