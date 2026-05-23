import { connect, disconnect, signMessage as wagmiSignMessage } from '@wagmi/core';
import { wagmiConfig } from '@/lib/wagmi';
import { injected } from 'wagmi/connectors';

declare global {
  interface Window {
    ethereum?: any;
  }
}

/** Check whether an EVM wallet (like MetaMask) is installed in the browser */
export function isEvmWalletInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return !!window.ethereum;
}

/**
 * Connect to an EVM wallet using wagmi.
 * Returns the wallet address.
 */
export async function connectWallet(): Promise<string> {
  // If already connected, get the first account
  const state = wagmiConfig.state;
  const currentConnection = state.connections.get(state.current || '');
  if (currentConnection?.accounts?.[0]) {
    return currentConnection.accounts[0];
  }

  const result = await connect(wagmiConfig, {
    connector: injected(),
  });
  
  if (!result.accounts || result.accounts.length === 0) {
    throw new Error('No accounts found after connecting.');
  }
  
  return result.accounts[0];
}

/**
 * Disconnect the wallet.
 */
export async function disconnectWallet(): Promise<void> {
  const state = wagmiConfig.state;
  const currentConnection = state.connections.get(state.current || '');
  if (currentConnection) {
    await disconnect(wagmiConfig, {
      connector: currentConnection.connector,
    });
  }
}

/**
 * Build the canonical sign-in message that will be signed by the wallet.
 */
export function buildSignInMessage(walletAddress: string): string {
  return (
    `Sign in to QuPilot\n\n` +
    `Wallet: ${walletAddress}\n` +
    `Timestamp: ${new Date().toISOString()}\n\n` +
    `This request will not trigger a blockchain transaction or cost any fees.`
  );
}

/**
 * Ask the connected wallet to sign a message and return the hex signature.
 */
export async function signMessage(message: string): Promise<string> {
  const signature = await wagmiSignMessage(wagmiConfig, {
    message,
  });
  return signature;
}
