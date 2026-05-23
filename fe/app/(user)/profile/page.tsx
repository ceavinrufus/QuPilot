"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Card, Avatar, Badge, Chip, ProgressBar, Tabs } from "@heroui/react";
import {
  FaUserAstronaut,
  FaRegCopy,
  FaRocket,
  FaFire,
  FaAward,
  FaBolt,
  FaTrophy,
  FaCompass,
  FaWater,
  FaShareNodes,
  FaRoute,
  FaSpinner,
  FaCheck,
  FaLock,
  FaChevronRight
} from "react-icons/fa6";

const COMPLETED_QUESTS = [
  {
    id: "q-c1",
    title: "Bridge Initiate",
    description: "Successfully bridge any amount of ETH to Base mainnet using QuPilot.",
    category: "BRIDGING",
    xp: "100 XP",
    date: "2 days ago",
    icon: FaRoute,
    iconColor: "text-[#006767]"
  },
  {
    id: "q-c2",
    title: "First Space Telemetry Scrap",
    description: "Inspect telemetry anomaly logs and check for deep space telemetry errors.",
    category: "TELEMETRY",
    xp: "300 XP",
    date: "5 days ago",
    icon: FaAward,
    iconColor: "text-[#a63420]"
  }
];

export default function UserProfilePage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("active");
  const walletAddress = "0x71C2473A7FD9899B34D8E2221973E888358E299C";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const newLocal = "rounded-xl border border-[#dfbfb94d] bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md";
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto py-6 px-4 md:px-6">
      {/* 1. Header Profile Card */}
      <Card className={newLocal}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left flex-1 w-full min-w-0">
            {/* Avatar block with active status dot anchor */}
            <div className="relative shrink-0">
              <Badge.Anchor>
                <Avatar className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-[#fff8f6]">
                  <Avatar.Image 
                    src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=250" 
                    alt="AstroExplorer99" 
                  />
                  <Avatar.Fallback className="bg-secondary-light">
                    <FaUserAstronaut className="text-secondary text-5xl" />
                  </Avatar.Fallback>
                </Avatar>
                <Badge 
                  color="success" 
                  placement="bottom-right" 
                  className="w-8 h-8 rounded-full border-4 border-white bg-[#10b981] text-white flex items-center justify-center p-0 shadow-md -translate-x-1.5 -translate-y-1.5"
                >
                  <FaCheck className="text-[10px]" />
                </Badge>
              </Badge.Anchor>
            </div>

            {/* Profile Info details - with full width to allow bio wrapping beautifully */}
            <div className="flex flex-col gap-3 w-full flex-1 min-w-0">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1f1b18] tracking-tight font-display mb-1">
                  AstroExplorer99
                </h1>
                <p className="text-sm text-[#6b6560] font-sans">
                  Web3 Space Pilot Cadet • Active since May 2026
                </p>
              </div>

              {/* Copyable Wallet Address box */}
              <div className="flex justify-center sm:justify-start">
                <button
                  onClick={copyToClipboard}
                  className="bg-[#f8f4ef] hover:bg-[#ebdcd6] border border-[#dfbfb94d] rounded-xs px-3 py-1.5 flex items-center gap-2 cursor-pointer transition-colors text-[#6b6560] font-mono text-xs shadow-2xs group"
                  title="Click to copy wallet address"
                >
                  <span className="font-semibold select-all">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                  {copied ? (
                    <FaCheck className="text-[#10b981] text-xs transition-transform duration-200 scale-110" />
                  ) : (
                    <FaRegCopy className="text-xs group-hover:scale-110 transition-transform duration-200" />
                  )}
                </button>
              </div>

              {/* Bio block wrapped inside a standard full-width block div to prevent flexbox narrow word-wrapping */}
              <div className="w-full">
                <p className="text-sm text-[#6b6560] leading-relaxed italic font-sans font-medium">
                  "Navigating the Web3 cosmos, one liquidity pool and cross-chain bridge at a time. Searching for data residues."
                </p>
              </div>

              {/* Level & Streak Chips */}
              <div className="flex flex-wrap gap-2.5 mt-1 justify-center sm:justify-start">
                <Chip className="bg-[#e8ddff] text-[#20005e] border border-[#cebdff] font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-2xs">
                  <FaRocket className="text-[11px] text-[#6746c5]" />
                  <Chip.Label>Level 42</Chip.Label>
                </Chip>
                <Chip className="bg-[#ffdad3] text-[#3f0400] border border-[#ffb4ab] font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-2xs">
                  <FaFire className="text-[11px] text-[#ff543c] animate-pulse" />
                  <Chip.Label>15 Day Streak</Chip.Label>
                </Chip>
              </div>
            </div>
          </div>

          {/* Quick Header Mini-Stats overview */}
          <div className="w-full md:w-auto flex justify-around md:justify-end gap-6 md:gap-8 border-t md:border-t-0 md:border-l border-[#dfbfb94d] pt-6 md:pt-2 md:pl-8 shrink-0">
            <div className="flex flex-col text-center md:text-right">
              <span className="text-[10px] text-[#a39d97] font-bold uppercase tracking-wider mb-0.5">Rank tier</span>
              <span className="text-xl font-extrabold text-[#6746c5]">Gold Voyager</span>
            </div>
            <div className="flex flex-col text-center md:text-right">
              <span className="text-[10px] text-[#a39d97] font-bold uppercase tracking-wider mb-0.5">Completion</span>
              <span className="text-xl font-extrabold text-[#10b981]">94.2%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Grid Columns layout: Stats/Achievements left, Quests right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Mission Stats & Achievements */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          {/* Mission Stats card */}
          <Card className="rounded-xl border border-[#dfbfb94d] bg-white p-6 shadow-sm">
            <Card.Header className="flex items-center gap-2.5 pb-4">
              <FaAward className="text-[#a63420] text-xl" />
              <Card.Title className="text-lg font-extrabold text-[#1f1b18]">Mission Stats</Card.Title>
            </Card.Header>
            <Card.Content className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Quests Done Card */}
                <div className="bg-[#f8f4ef] border border-[#dfbfb94d] rounded-xl p-4 flex flex-col gap-1 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xs">
                  <span className="text-[10px] text-[#6b6560] font-bold uppercase tracking-wider">Quests Done</span>
                  <span className="text-2xl font-extrabold text-[#a63420]">128</span>
                </div>
                {/* Total XP Card */}
                <div className="bg-[#f8f4ef] border border-[#dfbfb94d] rounded-xl p-4 flex flex-col gap-1 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xs">
                  <span className="text-[10px] text-[#6b6560] font-bold uppercase tracking-wider">Total XP</span>
                  <span className="text-2xl font-extrabold text-[#6746c5]">45.2k</span>
                </div>
              </div>

              {/* Global Rank full width card */}
              <div className="bg-[#f8f4ef] border border-[#dfbfb94d] rounded-xl p-4 flex items-center justify-between transition-all duration-200 hover:scale-[1.02] hover:shadow-2xs">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-[#6b6560] font-bold uppercase tracking-wider">Global Rank</span>
                  <span className="text-2xl font-extrabold text-[#1f1b18]">#1,042</span>
                </div>
                <FaTrophy className="text-[#f59e0b] text-3xl opacity-90 animate-bounce" style={{ animationDuration: "3s" }} />
              </div>
            </Card.Content>
          </Card>

          {/* Achievements Card list */}
          <Card className="rounded-xl border border-[#dfbfb94d] bg-white p-6 shadow-sm">
            <Card.Header className="flex items-center gap-2.5 pb-4">
              <FaTrophy className="text-[#f59e0b] text-xl" />
              <Card.Title className="text-lg font-extrabold text-[#1f1b18]">My Achievements</Card.Title>
            </Card.Header>
            <Card.Content className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-3.5">
                {/* Achievement 1 */}
                <div className="bg-[#f8f4ef] border border-[#dfbfb94d] rounded-xl p-3.5 flex flex-col gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#dfbfb94d] flex items-center justify-center text-sm shadow-2xs">
                    <FaRocket className="text-[#a63420]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#1f1b18]">First Blood</h4>
                    <p className="text-[9px] text-[#6b6560] mt-0.5 leading-tight font-medium">Complete your first quest.</p>
                  </div>
                </div>
                {/* Achievement 2 */}
                <div className="bg-[#f8f4ef] border border-[#dfbfb94d] rounded-xl p-3.5 flex flex-col gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#dfbfb94d] flex items-center justify-center text-sm shadow-2xs">
                    <FaWater className="text-[#6746c5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#1f1b18]">DeFi Degen</h4>
                    <p className="text-[9px] text-[#6b6560] mt-0.5 leading-tight font-medium">Provide $1,000+ pool liquidity.</p>
                  </div>
                </div>
                {/* Achievement 3 */}
                <div className="bg-[#f8f4ef] border border-[#dfbfb94d] rounded-xl p-3.5 flex flex-col gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#dfbfb94d] flex items-center justify-center text-sm shadow-2xs">
                    <FaFire className="text-[#006767]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#1f1b18]">Guardian</h4>
                    <p className="text-[9px] text-[#6b6560] mt-0.5 leading-tight font-medium">Maintain a 15+ day streak easily.</p>
                  </div>
                </div>
                {/* Achievement 4 */}
                <div className="bg-[#f8f4ef] border border-[#dfbfb94d] rounded-xl p-3.5 flex flex-col gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#dfbfb94d] flex items-center justify-center text-sm shadow-2xs">
                    <FaBolt className="text-[#f59e0b]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#1f1b18]">Speedster</h4>
                    <p className="text-[9px] text-[#6b6560] mt-0.5 leading-tight font-medium">Bridge tokens in under 30 seconds.</p>
                  </div>
                </div>
                {/* Locked Achievement Slot 5 */}
                <div className="bg-[#ffe9e5] border border-[#ffdad3] rounded-xl p-3.5 flex flex-col gap-2 items-center justify-center transition-all duration-200 hover:scale-[1.02] opacity-80 select-none">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#ffdad3] flex items-center justify-center text-xs shadow-2xs">
                    <FaLock className="text-[#a63420] text-[10px]" />
                  </div>
                  <span className="text-[9px] font-extrabold text-[#a63420] uppercase tracking-wider font-sans">Locked</span>
                </div>
                {/* Locked Achievement Slot 6 */}
                <div className="bg-[#ffe9e5] border border-[#ffdad3] rounded-xl p-3.5 flex flex-col gap-2 items-center justify-center transition-all duration-200 hover:scale-[1.02] opacity-80 select-none">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#ffdad3] flex items-center justify-center text-xs shadow-2xs">
                    <FaLock className="text-[#a63420] text-[10px]" />
                  </div>
                  <span className="text-[9px] font-extrabold text-[#a63420] uppercase tracking-wider font-sans">Locked</span>
                </div>
              </div>

              {/* View Leaderboard action */}
              <Link href="/leaderboard" className="w-full mt-2 block">
                <Button className="w-full bg-[#f8f4ef] hover:bg-[#ffdad3]/60 border border-[#ffdad3] text-[#a63420] font-extrabold py-3 rounded-full text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5">
                  View Leaderboard <FaChevronRight className="text-[9px]" />
                </Button>
              </Link>
            </Card.Content>
          </Card>
        </div>

        {/* Right Column: Quest Tabs & List content */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          
          <Card className="rounded-xl border border-[#dfbfb94d] bg-white p-6 shadow-sm min-h-125">
            <Card.Header className="flex items-center gap-2.5 pb-6">
              <FaCompass className="text-[#6746c5] text-xl" />
              <Card.Title className="text-lg font-extrabold text-[#1f1b18]">My Quests</Card.Title>
            </Card.Header>
            <Card.Content>
              
              {/* Controlled Tabs Component to guarantee bulletproof functional interactivity */}
              <Tabs 
                selectedKey={activeTab} 
                onSelectionChange={(key) => setActiveTab(key as string)} 
                className="w-full flex flex-col gap-6"
              >
                <Tabs.ListContainer className="border-b border-[#dfbfb94d] pb-2">
                  <Tabs.List aria-label="Quest filters" className="flex gap-4">
                    
                    {/* Active quests tab */}
                    <Tabs.Tab 
                      id="active" 
                      className="px-4 py-2 text-sm font-bold text-[#6b6560] data-[selected=true]:text-[#a63420] relative cursor-pointer outline-none transition-colors"
                    >
                      Active (3)
                      <Tabs.Indicator className="absolute -bottom-2.25 left-0 right-0 h-0.75 bg-[#a63420] rounded-full" />
                    </Tabs.Tab>

                    {/* Completed quests tab */}
                    <Tabs.Tab 
                      id="completed" 
                      className="px-4 py-2 text-sm font-bold text-[#6b6560] data-[selected=true]:text-[#a63420] relative cursor-pointer outline-none transition-colors"
                    >
                      Completed (12)
                      <Tabs.Indicator className="absolute -bottom-2.25 left-0 right-0 h-0.75 bg-[#a63420] rounded-full" />
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>

                {/* Tab Panel: Active Quests */}
                <Tabs.Panel id="active" className="flex flex-col gap-4 mt-2">
                  
                  {/* Quest Card 1: DeFi Liquidity Provider */}
                  <div className="bg-[#f8f4ef] border border-[#dfbfb94d] rounded-xl p-5 flex flex-col md:flex-row gap-5 items-stretch justify-between transition-all duration-200 hover:border-[#ebdcd6] hover:shadow-2xs">
                    <div className="flex gap-4 items-start flex-1">
                      <div className="w-12 h-12 rounded-lg bg-white border border-[#dfbfb94d] flex items-center justify-center text-xl shrink-0 shadow-3xs">
                        <FaWater className="text-[#6746c5]" />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[9px] font-extrabold tracking-wider bg-[#ffe9e5] text-[#a63420] px-2 py-0.5 rounded-[4px] uppercase font-sans border border-[#ffdad3]">
                            DeFi
                          </span>
                          <h3 className="text-base font-extrabold text-[#1f1b18]">
                            Liquidity Provider Initiate
                          </h3>
                        </div>
                        <p className="text-xs text-[#6b6560] leading-relaxed">
                          Provide at least $50 equivalent liquidity to the ETH/USDC pool on Uniswap V3.
                        </p>
                        
                        {/* Outer layout for progress labels to prevent HeroUI layout overrides */}
                        <div className="mt-2 w-full max-w-md">
                          <div className="flex justify-between text-[10px] text-[#6b6560] font-bold mb-1.5 font-sans">
                            <span className="whitespace-nowrap">Progress: 45%</span>
                            <span className="whitespace-nowrap">Reward: 500 XP + NFT</span>
                          </div>
                          <ProgressBar value={45} aria-label="Quest Progress" className="w-full">
                            <ProgressBar.Track className="h-2 w-full bg-[#f5ddd9] rounded-full overflow-hidden">
                              <ProgressBar.Fill 
                                className="h-full bg-[#a63420] rounded-full transition-all duration-300" 
                                style={{ width: '45%' }} 
                              />
                            </ProgressBar.Track>
                          </ProgressBar>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Chip wrapper */}
                    <div className="flex items-center shrink-0 self-center md:self-auto">
                      <Chip className="bg-[#e8ddff] text-[#20005e] border border-[#cebdff] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs shadow-3xs">
                        <FaSpinner className="animate-spin text-[10px]" />
                        <Chip.Label>In Progress</Chip.Label>
                      </Chip>
                    </div>
                  </div>

                  {/* Quest Card 2: Social Signal */}
                  <div className="bg-[#f8f4ef] border border-[#dfbfb94d] rounded-xl p-5 flex flex-col md:flex-row gap-5 items-stretch justify-between transition-all duration-200 hover:border-[#ebdcd6] hover:shadow-2xs">
                    <div className="flex gap-4 items-start flex-1">
                      <div className="w-12 h-12 rounded-lg bg-white border border-[#dfbfb94d] flex items-center justify-center text-xl shrink-0 shadow-3xs">
                        <FaShareNodes className="text-[#f59e0b]" />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[9px] font-extrabold tracking-wider bg-[#fff3d6] text-[#b25e00] px-2 py-0.5 rounded-[4px] uppercase font-sans border border-[#ffe1a8]">
                            Social
                          </span>
                          <h3 className="text-base font-extrabold text-[#1f1b18]">
                            Social Signal Booster
                          </h3>
                        </div>
                        <p className="text-xs text-[#6b6560] leading-relaxed">
                          Retweet the official QuPilot launch post and verify with your connected X account.
                        </p>
                        
                        {/* Outer layout for progress labels to prevent HeroUI layout overrides */}
                        <div className="mt-2 w-full max-w-md">
                          <div className="flex justify-between text-[10px] text-[#6b6560] font-bold mb-1.5 font-sans">
                            <span className="whitespace-nowrap">Progress: 0%</span>
                            <span className="whitespace-nowrap">Reward: 150 XP</span>
                          </div>
                          <ProgressBar value={0} aria-label="Quest Progress" className="w-full">
                            <ProgressBar.Track className="h-2 w-full bg-[#f5ddd9] rounded-full overflow-hidden">
                              <ProgressBar.Fill 
                                className="h-full bg-[#a63420] rounded-full transition-all duration-300" 
                                style={{ width: '0%' }} 
                              />
                            </ProgressBar.Track>
                          </ProgressBar>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Chip wrapper */}
                    <div className="flex items-center shrink-0 self-center md:self-auto">
                      <Chip className="bg-[#f8f4ef] text-[#6b6560] border border-[#dfbfb94d] hover:bg-[#ebdcd6]/50 font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs shadow-3xs cursor-pointer transition-colors">
                        <Chip.Label>AVAILABLE</Chip.Label>
                      </Chip>
                    </div>
                  </div>

                  {/* Quest Card 3: Bridge Explorer */}
                  <div className="bg-[#f8f4ef] border border-[#dfbfb94d] rounded-xl p-5 flex flex-col md:flex-row gap-5 items-stretch justify-between transition-all duration-200 hover:border-[#ebdcd6] hover:shadow-2xs">
                    <div className="flex gap-4 items-start flex-1">
                      <div className="w-12 h-12 rounded-lg bg-white border border-[#dfbfb94d] flex items-center justify-center text-xl shrink-0 shadow-3xs">
                        <FaRoute className="text-[#006767]" />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[9px] font-extrabold tracking-wider bg-[#d6f2f2] text-[#004d4d] px-2 py-0.5 rounded-[4px] uppercase font-sans border border-[#b2e8e8]">
                            Bridging
                          </span>
                          <h3 className="text-base font-extrabold text-[#1f1b18]">
                            Bridge Explorer
                          </h3>
                        </div>
                        <p className="text-xs text-[#6b6560] leading-relaxed">
                          Bridge at least 0.05 ETH to Arbitrum or Optimism using the QuPilot Bridge Portal.
                        </p>
                        
                        {/* Outer layout for progress labels to prevent HeroUI layout overrides */}
                        <div className="mt-2 w-full max-w-md">
                          <div className="flex justify-between items-center text-[10px] text-[#6b6560] font-bold mb-1.5 font-sans">
                            <span className="whitespace-nowrap">
                              Progress: 90% <span className="text-[#f59e0b] font-semibold">(Waiting Confirmation)</span>
                            </span>
                            <span className="whitespace-nowrap">Reward: 400 XP</span>
                          </div>
                          <ProgressBar value={90} aria-label="Quest Progress" className="w-full">
                            <ProgressBar.Track className="h-2 w-full bg-[#f5ddd9] rounded-full overflow-hidden">
                              <ProgressBar.Fill 
                                className="h-full bg-[#f59e0b] rounded-full transition-all duration-300" 
                                style={{ width: '90%' }} 
                              />
                            </ProgressBar.Track>
                          </ProgressBar>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Chip wrapper */}
                    <div className="flex items-center shrink-0 self-center md:self-auto">
                      <Chip className="bg-[#fff3d6] text-[#b25e00] border border-[#ffe1a8] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs shadow-3xs">
                        <FaSpinner className="animate-spin text-[10px]" />
                        <Chip.Label>Processing</Chip.Label>
                      </Chip>
                    </div>
                  </div>

                </Tabs.Panel>

                {/* Tab Panel: Completed Quests */}
                <Tabs.Panel id="completed" className="flex flex-col gap-4 mt-2">
                  
                  {COMPLETED_QUESTS.map((quest) => {
                    const QuestIcon = quest.icon;
                    return (
                      <div 
                        key={quest.id} 
                        className="bg-[#f8f4ef] border border-[#dfbfb94d] rounded-xl p-5 flex flex-col md:flex-row gap-5 items-stretch justify-between transition-all duration-200 hover:border-[#ebdcd6] hover:shadow-2xs"
                      >
                        <div className="flex gap-4 items-start flex-1">
                          <div className="w-12 h-12 rounded-lg bg-white border border-[#dfbfb94d] flex items-center justify-center text-xl shrink-0 shadow-3xs">
                            <QuestIcon className={quest.iconColor} />
                          </div>
                          <div className="flex-1 flex flex-col gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className="text-[9px] font-extrabold tracking-wider bg-[#d1f7c4] text-[#1a5f08] px-2 py-0.5 rounded-[4px] uppercase font-sans border border-[#a2e88a]">
                                {quest.category}
                              </span>
                              <h3 className="text-base font-extrabold text-[#1f1b18] line-through decoration-1 opacity-75">
                                {quest.title}
                              </h3>
                            </div>
                            <p className="text-xs text-[#6b6560] leading-relaxed opacity-75">
                              {quest.description}
                            </p>
                            
                            {/* ProgressBar fully completed */}
                            <div className="mt-2 w-full max-w-md">
                              <div className="flex justify-between text-[10px] text-[#6b6560] font-bold mb-1.5 font-sans">
                                <span className="whitespace-nowrap">Completed • {quest.date}</span>
                                <span className="whitespace-nowrap">Reward: {quest.xp}</span>
                              </div>
                              <ProgressBar value={100} aria-label="Quest Progress" className="w-full">
                                <ProgressBar.Track className="h-2 w-full bg-[#d1f7c4] rounded-full overflow-hidden">
                                  <ProgressBar.Fill 
                                    className="h-full bg-[#10b981] rounded-full" 
                                    style={{ width: '100%' }} 
                                  />
                                </ProgressBar.Track>
                              </ProgressBar>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Chip showing full completion */}
                        <div className="flex items-center shrink-0 self-center md:self-auto">
                          <Chip className="bg-[#d1f7c4] text-[#1a5f08] border border-[#a2e88a] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1 text-xs shadow-3xs">
                            <FaCheck className="text-[10px]" />
                            <Chip.Label>COMPLETED</Chip.Label>
                          </Chip>
                        </div>
                      </div>
                    );
                  })}

                </Tabs.Panel>
              </Tabs>

            </Card.Content>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
