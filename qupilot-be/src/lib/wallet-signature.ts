import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';

/**
 * Verify a Solana wallet signed `message` with the secret key matching `walletAddress`.
 * `signatureBase58` is the base58-encoded 64-byte ed25519 signature produced by the wallet.
 */
export const verifySolanaSignature = (
  walletAddress: string,
  message: string,
  signatureBase58: string,
): boolean => {
  let pubkeyBytes: Uint8Array;
  try {
    pubkeyBytes = new PublicKey(walletAddress).toBytes();
  } catch {
    return false;
  }

  let signatureBytes: Uint8Array;
  try {
    signatureBytes = bs58.decode(signatureBase58);
  } catch {
    return false;
  }

  if (signatureBytes.length !== nacl.sign.signatureLength) {
    return false;
  }

  const messageBytes = new TextEncoder().encode(message);
  return nacl.sign.detached.verify(messageBytes, signatureBytes, pubkeyBytes);
};
