"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

// Mock achievements and history
const ACHIEVEMENTS = [
  { icon: "🌌", name: "Starfarer First Class", desc: "Successfully joined first deep-space telemetry scrap." },
  { icon: "👾", name: "De-anomalizer", desc: "Detected 5 deep-space telemetry signal errors." },
  { icon: "💎", name: "Yield Harvester", desc: "Earned more than 0.50 ETH in active pilot quests." },
];

const USER_QUESTS = [
  {
    id: "q-1",
    title: "Navigate the Orion Nebulae & Verify Telemetry",
    role: "NebulaMapper (Agent #042)",
    reward: "0.25 ETH",
    status: "Success",
    date: "10 mins ago",
  },
  {
    id: "q-2",
    title: "Retrieve Quantum Core Data Residue",
    role: "QuantumScraper (Agent #302)",
    reward: "0.12 ETH",
    status: "Running",
    date: "1 hour ago",
  },
];

export default function UserProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Profile Header & Bouncy stats card */}
      <div className="bg-surface border-2 border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-soft transition-all">
        <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-secondary-light border-4 border-secondary text-secondary font-bold flex items-center justify-center text-4xl shadow-medium">
            👨‍🚀
          </div>
          <div>
            <h1 className="text-h1 text-text-primary font-extrabold flex items-center gap-2 justify-center sm:justify-start">
              DegenPilot.eth
            </h1>
            <p className="text-body-md text-text-secondary">
              Space explorer cadet • Active since May 2026
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-secondary-light border border-secondary/20 rounded-full text-body-xs font-mono text-secondary font-bold">
              Wallet: 0x7a83B...34d8
            </div>
          </div>
        </div>

        {/* Overview Numbers */}
        <div className="flex gap-6 text-center border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8 w-full md:w-auto justify-around">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Joined</span>
            <span className="text-display text-text-primary text-2xl font-extrabold">2 Quests</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Earned</span>
            <span className="text-display text-primary text-2xl font-extrabold">0.25 ETH</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Reputation</span>
            <span className="text-display text-success text-2xl font-extrabold">98 pt</span>
          </div>
        </div>
      </div>

      {/* Grid: Achievements left, Quests joined right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Achievements */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-h2 text-text-primary font-bold">🌌 Badges & Achievements</h2>
          </div>

          <div className="bg-surface border-2 border-border rounded-xl p-5 flex flex-col gap-4">
            {ACHIEVEMENTS.map((ach, index) => (
              <div key={index} className="flex gap-3 items-start p-3 rounded-lg bg-bg-warm border border-border">
                <span className="text-2xl p-1 bg-surface rounded-lg shadow-soft">{ach.icon}</span>
                <div>
                  <h4 className="text-body-sm font-bold text-text-primary">{ach.name}</h4>
                  <p className="text-body-xs text-text-secondary mt-0.5">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/leaderboard"
            className="w-full bg-secondary text-on-secondary hover:bg-[#6c4cc5] font-bold py-3.5 rounded-lg border-b-4 border-secondary-container active:border-b-0 active:mt-1 transition-all text-body-sm shadow-soft text-center inline-flex items-center justify-center"
          >
            Check Global Leaderboard 🏆
          </Link>
        </div>

        {/* Quests History */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-h2 text-text-primary font-bold">🛰️ Connected Bot Agent History</h2>

          <div className="flex flex-col gap-4">
            {USER_QUESTS.map((quest) => (
              <div
                key={quest.id}
                className="bg-surface border-2 border-border rounded-xl p-5 hover:border-secondary/20 hover:shadow-soft transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-body-xs text-text-muted font-mono">{quest.id}</span>
                    <span className="text-body-xs text-text-secondary font-semibold">• {quest.role}</span>
                  </div>
                  <h3 className="text-body-md font-bold text-text-primary hover:text-secondary transition-colors">
                    <Link href={`/quests/${quest.id}`}>{quest.title}</Link>
                  </h3>
                  <span className="text-body-xs text-text-muted">Last run: {quest.date}</span>
                </div>

                <div className="flex items-center gap-6 justify-between sm:justify-end border-t sm:border-t-0 border-border pt-3 sm:pt-0">
                  <div className="flex flex-col sm:text-right">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Earned</span>
                    <span className="text-body-md font-bold text-primary">{quest.reward}</span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-label font-bold ${
                      quest.status === "Success"
                        ? "bg-success-light text-success border border-success/20"
                        : "bg-accent-light text-accent border border-accent/20 animate-pulse"
                    }`}
                  >
                    {quest.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
