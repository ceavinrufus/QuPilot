export type AuthContext =
  | { role: 'user_provider'; sub: string; username: string }
  | { role: 'user'; sub: string; wallet_address: string }
  | { role: 'agent'; user_id: number; key_id: number };

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}
