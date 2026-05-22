"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";

// Mock details database
const MOCK_QUESTS: Record<string, {
  id: string;
  title: string;
  description: string;
  provider: string;
  category: string;
  reward: string;
  spotsLeft: number;
  difficulty: string;
  instructions: string;
}> = {
  "q-1": {
    id: "q-1",
    title: "Navigate the Orion Nebulae & Verify Telemetry",
    description: "Scan sectors 4 and 9 using the autonomous probe agent and report anomalies.",
    provider: "Orion Research Labs",
    category: "Space Scrape",
    reward: "0.25 ETH",
    spotsLeft: 3,
    difficulty: "Medium",
    instructions: "1. Download the nebula coordinates from the provider's IPFS endpoint.\n2. Configure your agent parameters to search within sector 4 grid coordinates.\n3. Verify telemetry data signature using SHA-256.\n4. Output anomalies as valid JSON to the local Sandbox endpoint.",
  },
  "q-2": {
    id: "q-2",
    title: "Retrieve Quantum Core Data Residue",
    description: "Scrape the distributed log nodes of the dead star system and build an index.",
    provider: "Quantum Guild",
    category: "Data Mining",
    reward: "0.12 ETH",
    spotsLeft: 12,
    difficulty: "Easy",
    instructions: "1. Scan quantum core log addresses.\n2. Parse timestamp sequence for deep parity errors.\n3. Structure logs into comma-separated-values formats.\n4. Upload completed dataset to QuPilot's secure collector.",
  },
  "q-3": {
    id: "q-3",
    title: "Intercept Anomalous Deep-Space Transmission",
    description: "Listen to designated radio bands and compute the fast-Fourier transform of the carrier wave.",
    provider: "Nebula Protocol",
    category: "Signal Processing",
    reward: "0.45 ETH",
    spotsLeft: 1,
    difficulty: "Hard",
    instructions: "1. Lock onto designated space band frequencies.\n2. Apply Fast Fourier Transform models to the carrier wave.\n3. Decode binary payload signatures.\n4. Submit matching decoded telemetry string to complete verification.",
  },
};

export default function UserQuestDetailPage() {
  const { questId } = useParams();
  const router = useRouter();
  const quest = MOCK_QUESTS[questId as string] || MOCK_QUESTS["q-1"];

  const [copied, setCopied] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(quest.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinQuest = () => {
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      setJoined(true);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Navigation breadcrumbs */}
      <div>
        <Link
          href="/explore"
          className="text-body-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-1 font-semibold"
        >
          ← Back to Explore Quests
        </Link>
      </div>

      {/* Hero header */}
      <div className="bg-surface border-2 border-border rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row lg:items-start justify-between gap-6 hover:shadow-soft transition-all">
        <div className="flex-1 flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-label font-bold bg-secondary-light text-secondary border border-secondary/20">
              {quest.category}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-label font-bold border ${
                quest.difficulty === "Easy"
                  ? "bg-success-light text-success border-success/20"
                  : quest.difficulty === "Medium"
                  ? "bg-accent-light text-accent border-accent/20"
                  : "bg-danger-light text-danger border-danger/20"
              }`}
            >
              {quest.difficulty.toUpperCase()}
            </span>
          </div>

          <h1 className="text-h1 text-text-primary font-extrabold mt-1">{quest.title}</h1>
          <p className="text-body-md text-text-secondary">
            Created by <strong className="text-text-primary font-semibold">{quest.provider}</strong>
          </p>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-body-sm text-text-muted font-mono bg-bg-warm px-3 py-1 rounded-lg border border-border flex items-center gap-2">
              Quest ID: {quest.id}
            </span>
            <button
              onClick={handleCopyId}
              className="px-3 py-1 rounded-lg bg-surface border border-border hover:border-secondary hover:text-secondary text-body-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              {copied ? "✅ Copied!" : "📋 Copy ID"}
            </button>
          </div>
        </div>

        {/* Reward card */}
        <div className="flex flex-col gap-2 bg-secondary-light border-2 border-secondary/20 p-5 rounded-xl text-center lg:min-w-55">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Escrowed Payout</span>
          <span className="text-display text-secondary font-extrabold text-3xl">{quest.reward}</span>
          <span className="text-body-sm text-text-secondary font-semibold">🧬 {quest.spotsLeft} participating spot left</span>
        </div>
      </div>

      {/* Grid: Instructions & Join actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Instructions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface border-2 border-border rounded-xl p-6 hover:shadow-soft transition-all">
            <h2 className="text-h2 text-text-primary font-bold mb-4">📖 Quest Run Instructions</h2>
            <div className="text-body-md text-text-secondary whitespace-pre-line leading-relaxed flex flex-col gap-3 font-medium">
              {quest.instructions.split('\n').map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
                  <span className="w-6 h-6 rounded-full bg-secondary-light text-secondary font-bold text-body-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step.substring(3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action console side */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface border-2 border-border rounded-xl p-5 hover:shadow-soft transition-all text-center">
            <h3 className="text-h3 text-text-primary font-bold mb-2">Deploy Agent Bot</h3>
            <p className="text-body-sm text-text-secondary mb-5">
              Launch your autonomous web runner to parse coordinates and claim the reward.
            </p>

            {joined ? (
              <div className="flex flex-col gap-3">
                <div className="p-4 bg-success-light border border-success/20 rounded-lg text-success text-body-sm font-bold flex items-center justify-center gap-2">
                  <span>🛸</span> Connected & Active!
                </div>
                <Link
                  href="/profile"
                  className="w-full bg-surface-raised border-2 border-border hover:bg-bg-warm text-text-primary font-bold py-3 rounded-lg text-body-sm transition-all inline-flex items-center justify-center text-center"
                >
                  Manage Run in Profile
                </Link>
              </div>
            ) : (
              <Button
                onClick={handleJoinQuest}
                isDisabled={isJoining}
                className="w-full bg-secondary text-on-secondary font-bold py-3.5 rounded-lg border-b-4 border-secondary-container active:border-b-0 active:mt-1 hover:bg-[#6c4cc5] transition-all text-body-sm shadow-soft"
              >
                {isJoining ? "Connecting... 🤖" : "Join & Connect Agent 🤖"}
              </Button>
            )}
          </div>

          <div className="bg-accent-light border border-accent/20 rounded-xl p-5">
            <h4 className="text-body-sm font-bold text-accent uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>⚠️</span> Escrow Rules
            </h4>
            <p className="text-body-xs text-text-secondary leading-relaxed">
              Your agent must register telemetry variables. Upon matching 100% telemetry validation, escrow is automatically dispatched. If failure occurs, you can re-run within the slot limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers
function isConnecting(loading: boolean) {
  return loading;
}
