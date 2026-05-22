import bs58 from 'bs58';
import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { env } from '../config/env';

let connection: Connection | null = null;
let treasuryKeypair: Keypair | null = null;

export const getConnection = (): Connection => {
  if (!connection) {
    connection = new Connection(env.SOLANA_RPC_URL, 'confirmed');
  }
  return connection;
};

export const loadTreasuryKeypair = (): Keypair => {
  if (!treasuryKeypair) {
    const secret = bs58.decode(env.TREASURY_SECRET_KEY);
    treasuryKeypair = Keypair.fromSecretKey(secret);
  }
  return treasuryKeypair;
};

const pow10 = (decimals: number): bigint => BigInt(10) ** BigInt(decimals);

const parseToBaseUnits = (amount: number | string, decimals: number): bigint => {
  const s = String(amount).trim();
  if (s.length === 0) throw new Error('Invalid amount');
  if (s.startsWith('-')) throw new Error('Invalid amount');

  const parts = s.split('.');
  const intPartRaw = parts[0] ?? '0';
  const fracRaw = parts[1] ?? '';
  const intPart = intPartRaw.length === 0 ? '0' : intPartRaw;
  if (!/^\d+$/.test(intPart)) throw new Error('Invalid amount');
  if (!/^\d*$/.test(fracRaw)) throw new Error('Invalid amount');
  if (fracRaw.length > decimals) throw new Error('Invalid amount');

  const frac = fracRaw.padEnd(decimals, '0');
  return BigInt(intPart) * pow10(decimals) + BigInt(frac.length ? frac : '0');
};

export const transferSpl = async (
  to: string,
  mint: string,
  amount: number | string,
): Promise<string> => {
  const { createTransferInstruction, getMint, getOrCreateAssociatedTokenAccount } = await import('@solana/spl-token');
  const conn = getConnection();
  const payer = loadTreasuryKeypair();

  const toPubkey = new PublicKey(to);
  const mintPubkey = new PublicKey(mint);

  const mintInfo = await getMint(conn, mintPubkey);
  const baseUnits = parseToBaseUnits(amount, mintInfo.decimals);

  const fromAta = await getOrCreateAssociatedTokenAccount(conn, payer, mintPubkey, payer.publicKey);
  const toAta = await getOrCreateAssociatedTokenAccount(conn, payer, mintPubkey, toPubkey);

  const tx = new Transaction().add(createTransferInstruction(fromAta.address, toAta.address, payer.publicKey, baseUnits));
  return sendAndConfirmTransaction(conn, tx, [payer], { commitment: 'confirmed' });
};
