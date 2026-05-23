import React from "react";
import Link from "next/link";
import { Avatar, Popover } from "@heroui/react";
import { LuRocket, LuLogOut } from "react-icons/lu";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffbf5] text-[#1f1b18] font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#fff8f6cc] backdrop-blur-md border-b border-[#dfbfb94d] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 group transition-transform duration-200 hover:scale-105">
              <LuRocket className="text-2xl text-[#a63420]" />
              <span className="text-xl text-[#a63420] font-extrabold tracking-tight">
                QuPilot
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#ffe9e5] text-[#a63420] text-[10px] font-bold border border-[#a63420]/20 tracking-wider">
                PROVIDER
              </span>
            </Link>
          </div>

          {/* User Menu / Right elements */}
          <div className="flex items-center gap-4">

            {/* Provider Mini Profile using HeroUI Avatar */}
            <Popover>
              <Popover.Trigger>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#dfbfb94d] hover:shadow-sm transition-all cursor-pointer">
                  <Avatar size="sm" className="bg-[#a63420] text-white font-bold">
                    <Avatar.Fallback>C</Avatar.Fallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold leading-none text-[#1f1b18]">Creator.eth</span>
                    <span className="text-[10px] text-[#6b6560]">Quantum Guild</span>
                  </div>
                </div>
              </Popover.Trigger>
              <Popover.Content placement="bottom" offset={8}>
                <Popover.Dialog className="w-48 p-2">
                  <div className="flex flex-col w-full">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-[#a63420] hover:bg-[#ffe9e5] rounded-md transition-colors w-full text-left font-medium">
                      <LuLogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </Popover.Dialog>
              </Popover.Content>
            </Popover>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#dfbfb94d] bg-[#f8f4ef] py-8 text-[#6b6560] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#a63420] text-sm">QuPilot</span>
            <span className="text-xs">| Provider Console</span>
          </div>
          <p className="text-xs text-center">
            © 2026 QuPilot Web3 Quests. Powering decentralized autonomous discovery. 🪐
          </p>
          <div className="flex gap-4 text-xs font-bold">
            <Link href="#" className="hover:text-[#a63420] transition-colors">Terms</Link>
            <Link href="#" className="hover:text-[#a63420] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#a63420] transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-[#a63420] transition-colors">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
