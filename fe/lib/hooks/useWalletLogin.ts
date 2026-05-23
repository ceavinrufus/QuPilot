import { useMutation } from '@tanstack/react-query';
import { walletLogin } from '@/lib/api/auth';
import type { IWalletLoginRequest, IWalletLoginResponse } from '@/lib/types/auth';

/**
 * Mutation hook for POST /auth/user/login
 *
 * Works for both regular users and providers — the `role` field in the request
 * determines which account type is being created / logged in.
 */
export function useWalletLogin() {
  return useMutation<IWalletLoginResponse, Error, IWalletLoginRequest>({
    mutationFn: walletLogin,
  });
}
