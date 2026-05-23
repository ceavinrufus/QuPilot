import type { IUser } from '@/lib/types/auth';

const TOKEN_KEY = 'qupilot_auth_token';
const USER_DATA_KEY = 'qupilot_user_data';

// ─── Token ────────────────────────────────────────────────────────────────────

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// ─── User data ────────────────────────────────────────────────────────────────

export function setUserData(user: IUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }
}

export function getUserData(): IUser | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(USER_DATA_KEY);
    if (data) {
      try {
        return JSON.parse(data) as IUser;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function removeUserData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_DATA_KEY);
  }
}

// ─── Convenience ──────────────────────────────────────────────────────────────

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function isProvider(): boolean {
  const user = getUserData();
  return user?.role === 'user_provider';
}

// ─── Legacy shims (keep provider-specific keys working until full migration) ──

/** @deprecated Use setUserData */
export function setProviderData(provider: IUser): void {
  setUserData(provider);
}

/** @deprecated Use getUserData */
export function getProviderData(): IUser | null {
  return getUserData();
}
