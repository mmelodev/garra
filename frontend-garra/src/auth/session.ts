const STORAGE_KEY = 'authToken';

export interface AuthSession {
  token: string;
  login: string;
  role: 'ADMIN' | 'USER';
  exp: number;
}

function base64UrlToJson(segment: string): Record<string, unknown> | null {
  try {
    const b64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Decodifica payload JWT (sem verificar assinatura — o backend valida). */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  return base64UrlToJson(parts[1]);
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Persiste o token após validar formato, expiração e presença de `sub`.
 * Claim `role` é opcional para compatibilidade; sem ela assume USER na UI.
 */
export function persistAuthToken(token: string): boolean {
  const payload = decodeJwtPayload(token);
  const exp = typeof payload?.exp === 'number' ? payload.exp : NaN;
  if (!payload || !payload.sub || !Number.isFinite(exp)) return false;
  if (exp * 1000 <= Date.now()) return false;
  localStorage.setItem(STORAGE_KEY, token);
  return true;
}

export function readSession(): AuthSession | null {
  const token = localStorage.getItem(STORAGE_KEY);
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  const exp = typeof payload?.exp === 'number' ? payload.exp : NaN;
  if (!payload?.sub || !Number.isFinite(exp)) {
    clearSession();
    return null;
  }
  if (exp * 1000 <= Date.now()) {
    clearSession();
    return null;
  }
  const rawRole = payload.role;
  const role: 'ADMIN' | 'USER' = rawRole === 'ADMIN' ? 'ADMIN' : 'USER';
  return {
    token,
    login: String(payload.sub),
    role,
    exp,
  };
}

export function isAdminSession(session: AuthSession | null): boolean {
  return session?.role === 'ADMIN';
}
