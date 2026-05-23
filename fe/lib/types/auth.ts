// ─── API Error ────────────────────────────────────────────────────────────────

export interface IApiErrorIssue {
  path: string;
  message: string;
}

export interface IApiErrorBody {
  code: string;
  message: string;
  issues?: IApiErrorIssue[];
}

export interface IApiError {
  error: IApiErrorBody;
}

// ─── User / Provider ──────────────────────────────────────────────────────────

export type UserRole = 'user' | 'user_provider';

export interface IUser {
  uuid: string;
  wallet_address: string;
  role: UserRole;
  display_name: string | null;
  logo_url: string | null;
  created_at: string;
}

// ─── POST /auth/user/login ────────────────────────────────────────────────────

export interface IWalletLoginRequest {
  wallet_address: string;
  signature: string;
  message: string;
  role?: UserRole;
  display_name?: string;
  logo_url?: string;
}

/** First-time wallet hit — wallet not yet registered */
export interface IWalletLoginNotRegistered {
  registered: false;
}

/** Successful login or first-time registration completion */
export interface IWalletLoginSuccess {
  registered: true;
  token: string;
  user: IUser;
}

export type IWalletLoginResponse = IWalletLoginNotRegistered | IWalletLoginSuccess;

// ─── Legacy provider types (kept for backward-compat until fully removed) ─────

/** @deprecated Use IUser instead */
export interface IProvider {
  uuid: string;
  wallet_address: string;
  display_name: string | null;
  logo_url: string | null;
  created_at: string;
}

/** @deprecated */
export interface IRegisterProviderRequest {
  wallet_address: string;
  signature: string;
  message: string;
  display_name: string;
  logo_url?: string;
}

/** @deprecated */
export interface IRegisterProviderResponse {
  registered: true;
  token: string;
  user: IUser;
}

/** @deprecated */
export interface ILoginProviderRequest {
  wallet_address: string;
  signature: string;
  message: string;
}

/** @deprecated */
export interface ILoginProviderResponse {
  token: string;
  provider: IProvider;
}
