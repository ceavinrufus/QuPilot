import { apiClient } from './client';
import type {
  IWalletLoginRequest,
  IWalletLoginResponse,
} from '@/lib/types/auth';

/**
 * POST /auth/user/login
 *
 * Unified endpoint for both regular users and providers.
 * - First call (wallet not registered): returns { registered: false }
 * - Subsequent call (or first call with role): returns { registered: true, token, user }
 */
export async function walletLogin(
  data: IWalletLoginRequest
): Promise<IWalletLoginResponse> {
  const response = await apiClient.post<IWalletLoginResponse>(
    '/auth/user/login',
    data
  );
  return response.data;
}
