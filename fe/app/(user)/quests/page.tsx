"use client";

import React, { useState } from "react";
import { Card, Button } from "@heroui/react";
import { FiGlobe, FiUsers, FiCode, FiActivity, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

const QUESTS = [
  {
    id: 1,
    provider: "Nova Network",
    timeAgo: "2 hours ago",
    tag: "Beginner",
    title: "Bridge to Nova",
    description: "Complete your first cross-chain transfer to the Nova testnet and secure your early adopter role.",
    reward: "100 NVT",
    rewardColor: "text-[#f59e0b]",
    icon: FiGlobe,
    iconBg: "bg-[#e8ddff]",
    iconColor: "text-[#20005e]"
  },
  {
    id: 2,
    provider: "Cosmic DAO",
    timeAgo: "5 hours ago",
    tag: "Social",
    title: "Community Vanguard",
    description: "Join the Discord, participate in the town hall, and vote on the latest governance proposal.",
    reward: "Special NFT",
    rewardColor: "text-[#6746c5]",
    icon: FiUsers,
    iconBg: "bg-[#85f4f4]",
    iconColor: "text-[#002020]"
  },
  {
    id: 3,
    provider: "AstroFi Labs",
    timeAgo: "1 day ago",
    tag: "Advanced",
    title: "Testnet Stress Test",
    description: "Help us find bugs in the v2 contracts. High rewards for critical vulnerability reports.",
    reward: "Up to $5k",
    rewardColor: "text-[#ef4444]",
    icon: FiCode,
    iconBg: "bg-[#ffdad6]",
    iconColor: "text-[#93000a]"
  },
  {
    id: 4,
    provider: "Stellar DEX",
    timeAgo: "2 days ago",
    tag: "DeFi",
    title: "Liquidity Provision Run",
    description: "Provide liquidity to the new StarDEX pools and earn exclusive cosmic badges alongside yield multipliers.",
    reward: "500 XP + Badge",
    rewardColor: "text-[#9d7eff]",
    icon: FiActivity,
    iconBg: "bg-[#ffb4a5]",
    iconColor: "text-[#891e0c]"
  }
];

const FILTERS = ["All Quests", "AstroFi Labs", "Nova Network", "Cosmic DAO"];

export default function QuestExplorerPage() {
  const [activeFilter, setActiveFilter] = useState("All Quests");

  return (
    <div className="flex flex-col gap-10">
      {/* Header Section */}
      <section className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold text-[#a63420] tracking-tight">Quest Explorer</h1>
        <p className="text-[17px] text-[#6b6560] max-w-200 leading-relaxed">
          Explore new frontiers, connect with top providers, and embark on personalized quests
          designed for your journey across the Web3 galaxy.
        </p>
      </section>

      {/* Filters Section */}
      <section className="flex flex-wrap items-center justify-between gap-6">
        <h2 className="text-2xl font-bold text-[#a63420]">Active Missions</h2>
        <div className="flex flex-wrap items-center gap-2 p-1 bg-white border border-[#dfbfb94d] rounded-full">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === filter
                  ? "bg-[#ffdad3] text-[#3f0400]"
                  : "text-[#6b6560] hover:bg-[#f8f4ef]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Quests Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUESTS.map((quest) => (
          <Card key={quest.id} className="p-5 border border-transparent hover:border-[#dfbfb94d] shadow-sm hover:shadow-md transition-all rounded-2xl flex flex-col gap-4">
            <Card.Header className="flex justify-between items-start p-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${quest.iconBg} ${quest.iconColor}`}>
                  <quest.icon size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#1f1b18]">{quest.provider}</span>
                  <span className="text-xs text-[#6b6560]">{quest.timeAgo}</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f8f4ef] text-[#6b6560] border border-[#dfbfb94d]">
                {quest.tag}
              </span>
            </Card.Header>
            <Card.Content className="p-0 flex flex-col gap-1.5 grow">
              <h3 className="text-lg font-bold text-[#a63420]">{quest.title}</h3>
              <p className="text-[13px] text-[#6b6560] leading-relaxed">
                {quest.description}
              </p>
            </Card.Content>
            <Card.Footer className="p-0 pt-4 mt-auto border-t border-[#f5ddd9] flex justify-between items-center">
              <span className={`font-bold font-mono text-[13px] ${quest.rewardColor}`}>
                {quest.reward}
              </span>
              <Link href="#" className="flex items-center gap-1 text-xs font-bold text-[#a63420] hover:text-[#891e0c] transition-colors group">
                Join <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Card.Footer>
          </Card>
        ))}
      </section>

      {/* Load More Button */}
      <div className="flex justify-center mt-4">
        <Button className="bg-white border border-[#dfbfb9] text-[#a63420] font-bold px-8 py-3 rounded-full hover:bg-[#fffbf5] transition-colors shadow-sm">
          Load More Missions
        </Button>
      </div>
    </div>
  );
}
