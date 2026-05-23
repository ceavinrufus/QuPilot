"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import {
  FaWallet,
  FaUserPlus,
  FaDiscord,
  FaTwitter,
  FaCircle,
  FaRocket,
} from "react-icons/fa6";
import { FiLayout, FiUser, FiAward, FiCompass } from "react-icons/fi";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
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
    <div className="min-h-screen flex flex-col bg-[#fffbf5] font-sans antialiased text-[#1f1b18]">
      {/* TopNavBar */}
      <header className="sticky top-0 z-40 bg-[#fff8f6cc] backdrop-blur-md border-b border-[#f5ddd9] py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-12">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform duration-200 hover:scale-105"
          >
            <span className="text-[#a63420] text-2xl font-extrabold flex items-center gap-1.5">
              <FaRocket
                className="inline-block animate-pulse text-[#a63420]"
                size={22}
              />
              <span className="font-extrabold tracking-tight">Pilot</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/explore"
              className={`px-1 py-1 text-sm font-bold transition-all flex items-center gap-1.5 ${
                pathname === "/explore"
                  ? "text-[#a63420] border-b-2 border-[#a63420]"
                  : "text-[#6b6560] hover:text-[#a63420]"
              }`}
            >
              <FiLayout size={16} />
              Dashboard
            </Link>

            <Link
              href="/quests"
              className={`px-1 py-1 text-sm font-bold transition-all flex items-center gap-1.5 ${
                pathname === "/quests"
                  ? "text-[#a63420] border-b-2 border-[#a63420]"
                  : "text-[#6b6560] hover:text-[#a63420]"
              }`}
            >
              <FiCompass size={16} />
              Quests
            </Link>

            <Link
              href="/profile"
              className={`px-1 py-1 text-sm font-bold transition-all flex items-center gap-1.5 ${
                pathname === "/profile"
                  ? "text-[#a63420] border-b-2 border-[#a63420]"
                  : "text-[#6b6560] hover:text-[#a63420]"
              }`}
            >
              <FiUser size={16} />
              My Profile
            </Link>

            <Link
              href="/leaderboard"
              className={`px-1 py-1 text-sm font-bold transition-all flex items-center gap-1.5 ${
                pathname === "/leaderboard"
                  ? "text-[#a63420] border-b-2 border-[#a63420]"
                  : "text-[#6b6560] hover:text-[#a63420]"
              }`}
            >
              <FiAward size={16} />
              Leaderboard
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/register-provider"
              className="text-xs font-bold text-[#6b6560] hover:text-[#a63420] transition-colors flex items-center gap-1"
            >
              <FaUserPlus size={14} />
              <span className="hidden sm:inline">Register as Provider</span>
            </Link>

            {walletAddress ? (
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fff8f6] border border-[#f5ddd9] rounded-full text-xs font-mono text-[#a63420] font-bold hover:shadow-sm transition-all">
                  <FaCircle size={8} className="text-[#008282] animate-pulse" />
                  {walletAddress}
                </div>
                <button
                  onClick={handleDisconnectWallet}
                  title="Disconnect"
                  className="text-xs font-bold text-[#6b6560] hover:text-red-600 hover:scale-110 transition-all px-1.5"
                >
                  ✕
                </button>
              </div>
            ) : (
              <Button
                onClick={handleConnectWallet}
                isDisabled={isConnecting}
                className="bg-[#a63420] text-white hover:bg-[#8f2b1a] transition-all text-xs font-bold px-5 py-2.5 rounded-full shadow-sm flex items-center gap-2"
              >
                <FaWallet size={14} />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content wrapper */}
      <main className="grow max-w-7xl w-full mx-auto px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#f8f4ef] border-t border-[#f5ddd9] py-8 text-sm text-[#6b6560]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-[#a63420] text-lg">Pilot</span>
            <span>© 2024 Pilot Web3 Quests. Explore the stars.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="hover:text-[#a63420] transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-[#a63420] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#a63420] transition-colors flex items-center gap-1"
            >
              <FaTwitter size={14} />
              Twitter
            </Link>
            <Link
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#a63420] transition-colors flex items-center gap-1"
            >
              <FaDiscord size={14} />
              Discord
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
