"use client";

import React from "react";
import Link from "next/link";
import { Card, Chip } from "@heroui/react";
import { 
  LuPlus, 
  LuActivity, 
  LuBot, 
  LuCircleCheck, 
  LuArrowRight, 
  LuSparkles, 
  LuMilestone 
} from "react-icons/lu";

// Quests data from the Figma design
const FIGMA_QUESTS = [
  {
    id: "q-1",
    title: "Lunar Resource Gathering",
    description: "Extracting rare helium-3 isotopes from the lunar surface to power the main colony grid.",
    tier: "Tier 2",
    tierColor: "bg-[#ffe9e5] text-[#a63420] border-[#a63420]/20",
    agents: "1,204",
    completion: "98%",
    completionColor: "text-[#10b981]",
    reward: "500 PLT",
    status: "Active",
    gradient: "from-[#1a0c08] via-[#3a130c] to-[#631c0f]",
  },
  {
    id: "q-2",
    title: "Asteroid Belt Mapping",
    description: "Charting navigation paths through the dense Kuiper belt for commercial transport lines.",
    tier: "Tier 1",
    tierColor: "bg-[#9d7eff33] text-[#6746c5] border-[#6746c5]/20",
    agents: "845",
    completion: "72%",
    completionColor: "text-[#f59e0b]",
    reward: "250 PLT",
    status: "Active",
    gradient: "from-[#0d091a] via-[#1c133a] to-[#301c63]",
  },
];

export default function ProviderDashboard() {
  return (
    <div className="flex flex-col gap-8">
      {/* Provider Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-[#1f1b18] tracking-tight font-sans">
            Provider Dashboard
          </h1>
          <p className="text-sm text-[#6b6560]">
            Manage your active quests and monitor fleet performance.
          </p>
        </div>
        <Link
          href="/quests/new"
          className="bg-[#a63420] hover:bg-[#a63420]/90 text-white font-bold text-xs rounded-full px-6 py-3.5 shadow-sm inline-flex items-center gap-1.5 justify-center transition-all text-center"
        >
          <LuPlus className="text-sm" />
          Register New Quest
        </Link>
      </div>

      {/* Dashboard Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1: Active Quests */}
        <Card className="bg-[#ffffffb2] border border-white/80 rounded-xl p-5 shadow-sm backdrop-blur-md">
          <Card.Content className="flex flex-row items-center gap-4 p-0">
            <div className="w-12 h-12 rounded-full bg-[#c84b3533] flex items-center justify-center text-[#a63420]">
              <LuActivity className="text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6b6560] font-bold tracking-wider uppercase">
                Active Quests
              </span>
              <span className="text-2xl font-extrabold text-[#1f1b18]">
                12
              </span>
            </div>
          </Card.Content>
        </Card>

        {/* Stat 2: Total Agents Deployed */}
        <Card className="bg-[#ffffffb2] border border-white/80 rounded-xl p-5 shadow-sm backdrop-blur-md">
          <Card.Content className="flex flex-row items-center gap-4 p-0">
            <div className="w-12 h-12 rounded-full bg-[#9d7eff33] flex items-center justify-center text-[#6746c5]">
              <LuBot className="text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6b6560] font-bold tracking-wider uppercase">
                Total Agents Deployed
              </span>
              <span className="text-2xl font-extrabold text-[#1f1b18]">
                3,492
              </span>
            </div>
          </Card.Content>
        </Card>

        {/* Stat 3: Avg Completion Rate */}
        <Card className="bg-[#ffffffb2] border border-white/80 rounded-xl p-5 shadow-sm backdrop-blur-md">
          <Card.Content className="flex flex-row items-center gap-4 p-0">
            <div className="w-12 h-12 rounded-full bg-[#10b98133] flex items-center justify-center text-[#10b981]">
              <LuCircleCheck className="text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6b6560] font-bold tracking-wider uppercase">
                Avg Completion Rate
              </span>
              <span className="text-2xl font-extrabold text-[#1f1b18]">
                94.2%
              </span>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Hosted Quests Title */}
      <div className="flex flex-col gap-1 border-b border-[#dfbfb94d] pb-2">
        <h2 className="text-xl font-bold text-[#1f1b18]">Hosted Quests</h2>
      </div>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FIGMA_QUESTS.map((quest) => (
          <Card key={quest.id} className="bg-white border border-[#dfbfb94d] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Visual Cover Header */}
            <div className={`h-40 bg-linear-to-br ${quest.gradient} relative p-4 flex flex-col justify-between overflow-hidden`}>
              {/* Decorative Stars */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-4 left-6 w-1 h-1 bg-white rounded-full animate-ping" />
                <div className="absolute top-12 right-16 w-1.5 h-1.5 bg-white rounded-full" />
                <div className="absolute bottom-8 left-20 w-0.5 h-0.5 bg-white rounded-full" />
              </div>
              
              <Chip 
                size="sm"
                className="bg-[#10b981e5] text-white font-bold self-end border-none shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white mr-1 inline-block animate-pulse" />
                <Chip.Label>{quest.status}</Chip.Label>
              </Chip>

              {/* Icon Overlay inside Cover */}
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                {quest.id === "q-1" ? <LuSparkles className="text-lg" /> : <LuMilestone className="text-lg" />}
              </div>
            </div>

            {/* Quest Details */}
            <Card.Content className="p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-[#1f1b18] hover:text-[#a63420] transition-colors leading-snug">
                  <Link href={`/quests/manage/${quest.id}`}>{quest.title}</Link>
                </h3>
                <Chip size="sm" className={`${quest.tierColor} border font-bold px-2 py-0.5`}>
                  {quest.tier}
                </Chip>
              </div>

              <p className="text-xs text-[#6b6560] leading-relaxed">
                {quest.description}
              </p>

              {/* Metrics Row */}
              <div className="bg-[#fff8f6] border border-[#dfbfb94d] rounded-lg p-3 flex items-center justify-between">
                {/* Metric 1: Agents */}
                <div className="flex flex-col items-center flex-1 text-center">
                  <span className="text-[10px] text-[#6b6560] uppercase tracking-wider">Agents</span>
                  <span className="text-sm font-bold text-[#1f1b18] font-mono mt-0.5">{quest.agents}</span>
                </div>
                
                <div className="w-px h-8 bg-[#dfbfb94d]" />

                {/* Metric 2: Completion */}
                <div className="flex flex-col items-center flex-1 text-center">
                  <span className="text-[10px] text-[#6b6560] uppercase tracking-wider">Completion</span>
                  <span className={`text-sm font-bold ${quest.completionColor} font-mono mt-0.5`}>{quest.completion}</span>
                </div>

                <div className="w-px h-8 bg-[#dfbfb94d]" />

                {/* Metric 3: Reward Pool */}
                <div className="flex flex-col items-center flex-1 text-center">
                  <span className="text-[10px] text-[#6b6560] uppercase tracking-wider">Reward Pool</span>
                  <span className="text-sm font-bold text-[#a63420] font-mono mt-0.5">{quest.reward}</span>
                </div>
              </div>

              <Link
                href={`/quests/manage/${quest.id}`}
                className="w-full border border-[#a63420] text-[#a63420] hover:bg-[#ffe9e5] font-bold rounded-full py-2.5 text-xs transition-colors inline-flex items-center justify-center gap-1.5 text-center"
              >
                View Analytics
                <LuArrowRight className="text-sm" />
              </Link>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
}
