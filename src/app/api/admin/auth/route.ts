import { NextResponse } from 'next/server';
import {
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  verifyAdminPassword,
  createAdminToken,
} from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local_client';

    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: `Demasiados intentos fallidos. Acceso bloqueado por seguridad durante ${rate.waitSeconds} segundos.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!verifyAdminPassword(password)) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Clave maestra inválida. Intento registrado.' },
        { status: 401 }
      );
    }

    clearFailedAttempts(ip);
    const token = createAdminToken();
    return NextResponse.json({ token, ok: true });
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }
}
