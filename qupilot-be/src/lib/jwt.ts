import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export type ProviderJwtPayload = {
  role: 'user_provider';
  sub: string;
  username: string;
};

export type UserJwtPayload = {
  role: 'user';
  sub: string;
  wallet_address: string;
};

export type JwtPayload = ProviderJwtPayload | UserJwtPayload;

const signOptions: SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
};

export const signProviderJwt = (payload: Omit<ProviderJwtPayload, 'role'>): string =>
  jwt.sign({ ...payload, role: 'user_provider' }, env.JWT_SECRET, signOptions);

export const signUserJwt = (payload: Omit<UserJwtPayload, 'role'>): string =>
  jwt.sign({ ...payload, role: 'user' }, env.JWT_SECRET, signOptions);

export const verifyJwt = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded !== 'object' || decoded === null) {
    throw new jwt.JsonWebTokenError('Invalid token payload');
  }
  const payload = decoded as Record<string, unknown>;
  if (payload.role === 'user_provider' && typeof payload.sub === 'string' && typeof payload.username === 'string') {
    return { role: 'user_provider', sub: payload.sub, username: payload.username };
  }
  if (payload.role === 'user' && typeof payload.sub === 'string' && typeof payload.wallet_address === 'string') {
    return { role: 'user', sub: payload.sub, wallet_address: payload.wallet_address };
  }
  throw new jwt.JsonWebTokenError('Unrecognized token shape');
};