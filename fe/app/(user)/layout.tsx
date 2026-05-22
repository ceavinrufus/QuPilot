"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setWalletAddress("0x7a83B...34d8");
    }, 800);
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-base">
      {/* Sticky User Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b-2 border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group transition-transform duration-200 hover:scale-105">
              <span className="text-2xl animate-bounce">🛸</span>
              <span className="text-h2 text-secondary font-extrabold tracking-tight">
                QuPilot
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-light text-secondary text-[10px] font-bold border border-secondary/20 tracking-wider">
                EXPLORER
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/explore"
                className="px-4 py-2 rounded-lg text-body-md font-bold text-text-primary hover:bg-bg-warm transition-colors"
              >
                Explore Quests
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 rounded-lg text-body-md font-bold text-text-secondary hover:text-primary hover:bg-bg-warm transition-colors"
              >
                My Profile
              </Link>
              <Link
                href="/leaderboard"
                className="px-4 py-2 rounded-lg text-body-md font-bold text-text-secondary hover:text-primary hover:bg-bg-warm transition-colors"
              >
                Leaderboard
              </Link>
            </nav>
          </div>

          {/* Right menu - wallet connect button */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-body-sm font-bold text-text-secondary hover:text-primary transition-colors hidden sm:inline"
            >
              Provider Login
            </Link>

            {walletAddress ? (
              <div className="flex items-center gap-2">
                {/* Active Wallet Box */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-light border-2 border-secondary/20 rounded-lg text-body-sm font-mono text-secondary font-bold hover:shadow-soft transition-all">
                  <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
                  {walletAddress}
                </div>
                <button
                  onClick={handleDisconnectWallet}
                  title="Disconnect"
                  className="text-body-xs font-bold text-text-muted hover:text-danger hover:scale-110 transition-all px-1.5"
                >
                  ✕
                </button>
              </div>
            ) : (
              <Button
                onClick={handleConnectWallet}
                isDisabled={isConnecting}
                className="bg-secondary text-on-secondary font-bold px-5 py-2.5 rounded-lg border-b-4 border-secondary-container active:border-b-0 active:mt-1 hover:bg-[#6c4cc5] transition-all text-body-sm shadow-soft"
              >
                {isConnecting ? "Connecting... 🦊" : "Connect Wallet 🦊"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Main Footer */}
      <footer className="border-t border-border bg-surface py-8 text-center text-body-sm text-text-secondary mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 QuPilot Quest Feed. Propel your agents into deep-space yield pools. 🌌</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-primary transition-colors font-semibold">Provider Portal</Link>
            <span className="text-border">•</span>
            <Link href="/register-provider" className="hover:text-secondary transition-colors font-semibold">Register Provider</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
