import { Contract, JsonRpcProvider, Wallet, getAddress, verifyMessage } from 'ethers';
import { env } from '../config/env';

let provider: JsonRpcProvider | null = null;
let treasuryWallet: Wallet | null = null;

export const getEvmProvider = (): JsonRpcProvider => {
  if (!provider) {
    provider = new JsonRpcProvider(env.EVM_RPC_URL, env.CHAIN_ID);
  }
  return provider;
};

export const loadTreasuryWallet = (): Wallet => {
  if (!treasuryWallet) {
    treasuryWallet = new Wallet(env.TREASURY_PRIVATE_KEY, getEvmProvider());
  }
  return treasuryWallet;
};

export const normalizeAddress = (address: string): string | null => {
  try {
    return getAddress(address);
  } catch {
    return null;
  }
};

export const verifyEvmSignature = (walletAddress: string, message: string, signatureHex: string): boolean => {
  const expected = normalizeAddress(walletAddress);
  if (!expected) return false;

  try {
    const recovered = verifyMessage(message, signatureHex);
    return getAddress(recovered) === expected;
  } catch {
    return false;
  }
};

export const verifyTxBasic = async (txHash: string, walletAddress: string): Promise<boolean> => {
  const expected = normalizeAddress(walletAddress);
  if (!expected) return false;

  const p = getEvmProvider();
  const receipt = await p.getTransactionReceipt(txHash);
  if (!receipt) return false;

  const statusOk = receipt.status === 1;
  if (!statusOk) return false;

  const from = receipt.from;
  if (!from) return false;

  return getAddress(from) === expected;
};

export const transferErc20 = async (
  to: string,
  tokenAddress: string,
  amount: number | string,
): Promise<string> => {
  const toAddr = normalizeAddress(to);
  const tokenAddr = normalizeAddress(tokenAddress);
  if (!toAddr || !tokenAddr) {
    throw new Error('Invalid EVM address');
  }

  const value = BigInt(String(amount));
  if (value < 0n) throw new Error('Invalid amount');

  const abi = ['function transfer(address to, uint256 amount) returns (bool)'];
  const signer = loadTreasuryWallet();
  const token = new Contract(tokenAddr, abi, signer) as unknown as {
    transfer: (to: string, amount: bigint) => Promise<{ wait: () => Promise<{ hash: string } | null> }>;
  };

  const tx = await token.transfer(toAddr, value);
  const receipt = await tx.wait();
  if (!receipt) throw new Error('Transaction not mined');

  return receipt.hash;
};
