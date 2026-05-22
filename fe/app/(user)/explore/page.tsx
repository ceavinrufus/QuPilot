"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

// Mock providers and quests
const MOCK_PROVIDERS = [
  { id: "p-1", name: "Quantum Guild", badge: "Core Contributor", questsCount: 5, rating: "4.9" },
  { id: "p-2", name: "Orion Research Labs", badge: "Explorer Partner", questsCount: 3, rating: "4.7" },
  { id: "p-3", name: "Nebula Protocol", badge: "Community", questsCount: 2, rating: "4.5" },
];

const MOCK_QUESTS = [
  {
    id: "q-1",
    title: "Navigate the Orion Nebulae & Verify Telemetry",
    provider: "Orion Research Labs",
    category: "Space Scrape",
    reward: "0.25 ETH",
    spotsLeft: 3,
    difficulty: "Medium",
  },
  {
    id: "q-2",
    title: "Retrieve Quantum Core Data Residue",
    provider: "Quantum Guild",
    category: "Data Mining",
    reward: "0.12 ETH",
    spotsLeft: 12,
    difficulty: "Easy",
  },
  {
    id: "q-3",
    title: "Intercept Anomalous Deep-Space Transmission",
    provider: "Nebula Protocol",
    category: "Signal Processing",
    reward: "0.45 ETH",
    spotsLeft: 1,
    difficulty: "Hard",
  },
  {
    id: "q-4",
    title: "Verify Pulsar Rotation Periods",
    provider: "Quantum Guild",
    category: "Verification",
    reward: "0.18 ETH",
    spotsLeft: 8,
    difficulty: "Medium",
  },
];

export default function ExploreFeedPage() {
  const [activeTab, setActiveTab] = useState<"all" | "space" | "mining" | "signal">("all");

  const filteredQuests = MOCK_QUESTS.filter((quest) => {
    if (activeTab === "all") return true;
    if (activeTab === "space") return quest.category === "Space Scrape";
    if (activeTab === "mining") return quest.category === "Data Mining";
    if (activeTab === "signal") return quest.category === "Signal Processing";
    return true;
  });

  return (
    <div className="flex flex-col gap-10">
      {/* Hero Search Section */}
      <div className="bg-bg-warm border-2 border-border rounded-2xl p-6 md:p-10 relative overflow-hidden flex flex-col gap-4">
        <div className="max-w-2xl z-10 flex flex-col gap-2">
          <span className="px-3 py-1 rounded-full bg-primary-light text-primary text-label font-bold border border-primary/20 self-start">
            DISCOVERY HANGER
          </span>
          <h1 className="text-display text-text-primary text-3xl md:text-4xl font-extrabold tracking-tight">
            Deploy Autonomous Agents Into Live Quests
          </h1>
          <p className="text-body-lg text-text-secondary">
            Earn rewards in real-time by linking agent bots to explore, scrape, parse, and solve cosmic computations.
          </p>
        </div>

        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 text-9xl opacity-5 select-none font-bold">
          🛰️
        </div>
      </div>

      {/* Main Grid: Quests Left & Providers Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Live Quests */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-h2 text-text-primary font-bold">🛸 Available Quests</h2>

            {/* Quick tab controls */}
            <div className="flex gap-2 flex-wrap">
              {(["all", "space", "mining", "signal"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-body-sm font-bold border-2 transition-all capitalize ${
                    activeTab === tab
                      ? "bg-secondary text-on-secondary border-secondary shadow-soft"
                      : "bg-surface border-border text-text-secondary hover:text-text-primary hover:border-text-secondary"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredQuests.map((quest) => (
              <div
                key={quest.id}
                className="bg-surface border-2 border-border rounded-xl p-6 hover:border-secondary/20 hover:shadow-soft transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-surface-raised border border-border text-text-secondary text-[10px] font-bold">
                      {quest.category}
                    </span>
                    <span className="text-body-sm text-text-muted">by {quest.provider}</span>
                  </div>

                  <h3 className="text-h3 text-text-primary font-bold hover:text-secondary transition-colors">
                    <Link href={`/quests/${quest.id}`}>{quest.title}</Link>
                  </h3>

                  <div className="flex items-center gap-4 text-body-sm text-text-secondary mt-1">
                    <span className="flex items-center gap-1">⏱️ {quest.spotsLeft} spots left</span>
                    <span className="text-border">•</span>
                    <span
                      className={`font-semibold ${
                        quest.difficulty === "Easy"
                          ? "text-success"
                          : quest.difficulty === "Medium"
                          ? "text-accent"
                          : "text-danger"
                      }`}
                    >
                      {quest.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 border-border pt-4 sm:pt-0">
                  <div className="flex flex-col sm:text-right">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Reward Pool</span>
                    <span className="text-body-lg font-bold text-primary">{quest.reward}</span>
                  </div>

                  <Link
                    href={`/quests/${quest.id}`}
                    className="bg-secondary text-on-secondary hover:bg-[#6c4cc5] font-bold rounded-lg px-4 py-2 text-body-sm transition-all inline-flex items-center justify-center text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Top Providers */}
        <div className="flex flex-col gap-6">
          <h2 className="text-h2 text-text-primary font-bold">⭐️ Top Providers</h2>

          <div className="bg-surface border-2 border-border rounded-xl p-5 flex flex-col gap-4">
            {MOCK_PROVIDERS.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-bg-warm transition-all border border-transparent hover:border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shadow-soft">
                    {provider.name[0]}
                  </div>
                  <div>
                    <h4 className="text-body-sm font-bold text-text-primary">{provider.name}</h4>
                    <span className="text-[10px] bg-secondary-light text-secondary font-bold px-1.5 py-0.5 rounded-full border border-secondary/15">
                      {provider.badge}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-body-sm font-bold text-text-primary block">⭐ {provider.rating}</span>
                  <span className="text-[10px] text-text-muted">{provider.questsCount} Quests</span>
                </div>
              </div>
            ))}

            <Link
              href="/register-provider"
              className="w-full bg-bg-warm border-2 border-border hover:border-secondary hover:bg-secondary-light text-text-primary hover:text-secondary font-bold py-3 rounded-lg text-body-sm transition-all mt-2 inline-flex items-center justify-center text-center"
            >
              Become a Provider 🪐
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
