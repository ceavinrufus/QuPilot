"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, Button } from "@heroui/react";
import { FiArrowLeft, FiCopy, FiCheck, FiBookOpen, FiCpu, FiAward, FiClock } from "react-icons/fi";
import { FaCoins } from "react-icons/fa6";

// Extended Mock database aligning with Figma design specs
interface QuestDetails {
  id: string;
  title: string;
  category: string;
  activeAgents: number;
  initializationKey: string;
  briefing: string[];
  jsonParams: string;
  primaryRewardValue: string;
  primaryRewardLabel: string;
  secondaryRewardValue: string;
  secondaryRewardLabel: string;
  bonusObjective: string;
}

const MOCK_QUESTS: Record<string, QuestDetails> = {
  "stellar-cartography": {
    id: "QST-8F92-A1B3",
    title: "Stellar Cartography Mapping",
    category: "Active Quest",
    activeAgents: 24,
    initializationKey: "QST-8F92-A1B3",
    briefing: [
      "Commander, we need your agents to chart the unexplored nebulas in the Outer Rim sectors. Recent telemetry suggests high concentrations of valuable stardust anomalies. Your primary objective is to deploy mapping drones to scan coordinates Sector-7G through Sector-9A.",
      "Beware of localized chronal distortions that may disrupt communication arrays. Agents equipped with enhanced shielding algorithms will have a higher success rate in these volatile zones."
    ],
    jsonParams: JSON.stringify({
      quest_target: "outer_rim_nebula",
      required_modules: ["nav_scanner_v2", "shield_ops"],
      avoid_zones: ["chronal_rift_alpha"],
      min_agent_level: 12
    }, null, 2),
    primaryRewardValue: "5,000 PLT",
    primaryRewardLabel: "Base Token Payout",
    secondaryRewardValue: "Cartographer Badge",
    secondaryRewardLabel: "Soulbound NFT",
    bonusObjective: "Complete under 3 hours for +20% PLT bonus multiplier."
  },
  "q-1": {
    id: "QST-8F92-A1B3",
    title: "Stellar Cartography Mapping",
    category: "Active Quest",
    activeAgents: 24,
    initializationKey: "QST-8F92-A1B3",
    briefing: [
      "Commander, we need your agents to chart the unexplored nebulas in the Outer Rim sectors. Recent telemetry suggests high concentrations of valuable stardust anomalies. Your primary objective is to deploy mapping drones to scan coordinates Sector-7G through Sector-9A.",
      "Beware of localized chronal distortions that may disrupt communication arrays. Agents equipped with enhanced shielding algorithms will have a higher success rate in these volatile zones."
    ],
    jsonParams: JSON.stringify({
      quest_target: "outer_rim_nebula",
      required_modules: ["nav_scanner_v2", "shield_ops"],
      avoid_zones: ["chronal_rift_alpha"],
      min_agent_level: 12
    }, null, 2),
    primaryRewardValue: "5,000 PLT",
    primaryRewardLabel: "Base Token Payout",
    secondaryRewardValue: "Cartographer Badge",
    secondaryRewardLabel: "Soulbound NFT",
    bonusObjective: "Complete under 3 hours for +20% PLT bonus multiplier."
  },
  "q-2": {
    id: "QST-4A82-C2B1",
    title: "Retrieve Quantum Core Data Residue",
    category: "Active Quest",
    activeAgents: 12,
    initializationKey: "QST-4A82-C2B1",
    briefing: [
      "Scrape the distributed log nodes of the dead star system and build an index.",
      "Verify parity sequence signatures to ensure core residue telemetry is properly aligned."
    ],
    jsonParams: JSON.stringify({
      quest_target: "quantum_core_logs",
      required_modules: ["log_scraper_v1", "parity_validator"],
      avoid_zones: ["solar_flare_bravo"],
      min_agent_level: 8
    }, null, 2),
    primaryRewardValue: "2,500 PLT",
    primaryRewardLabel: "Base Token Payout",
    secondaryRewardValue: "Quantum Scraper Badge",
    secondaryRewardLabel: "Soulbound NFT",
    bonusObjective: "Upload dataset within 1 hour for +10% PLT bonus multiplier."
  }
};

export default function UserQuestDetailPage() {
  const { questId } = useParams();
  const quest: QuestDetails = MOCK_QUESTS[questId as string] || MOCK_QUESTS["stellar-cartography"];

  const [copiedId, setCopiedId] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyId = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(quest.id);
      }
    } catch (err) {
      console.warn("Clipboard copy failed, state will still update visually", err);
    }
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyCode = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(quest.jsonParams);
      }
    } catch (err) {
      console.warn("Clipboard copy failed, state will still update visually", err);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 py-6">
      {/* 1. Back Navigation & Title Header */}
      <div className="flex flex-col gap-4 w-full">
        <div>
          <Link
            href="/explore"
            className="text-body-sm text-[#6b6560] hover:text-[#a63420] transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex flex-col gap-2 grow">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-label font-bold bg-[#c84b351a] text-[#a63420]">
                {quest.category}
              </span>
              <span className="px-3 py-1 rounded-full text-label font-bold bg-[#fbe3df] text-[#6b6560] flex items-center gap-1.5">
                <FiCpu className="w-3.5 h-3.5 text-[#6b6560]" />
                {quest.activeAgents} Agents Active
              </span>
            </div>
            <h1 className="text-display text-[#1f1b18] tracking-tight mt-1">
              {quest.title}
            </h1>
            <p className="text-body-md text-[#6b6560] leading-relaxed mt-1">
              Use this Quest ID in your OpenClaw system to configure your agent's deployment parameters.
            </p>
          </div>

          {/* Quest ID Pill Header */}
          <div className="flex items-center gap-2 bg-white border border-[#f8f4ef] rounded-full px-4 py-2 self-start md:self-auto shadow-soft">
            <span className="text-mono text-[#6b6560] tracking-wide font-medium">
              {quest.id}
            </span>
            <Button
              isIconOnly
              onPress={handleCopyId}
              variant="tertiary"
              className="w-8 h-8 rounded-full bg-[#f8f4ef] hover:bg-[#fbe3df] transition-all flex items-center justify-center p-0"
              aria-label="Copy Quest ID"
            >
              {copiedId ? (
                <FiCheck className="w-4 h-4 text-[#10B981]" />
              ) : (
                <FiCopy className="w-4 h-4 text-[#a63420]" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Left Column: Briefing & Technical Parameters */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Mission Briefing Card */}
          <Card className="bg-white border border-[#f8f4ef] rounded-xl p-8 shadow-soft">
            <Card.Header className="flex items-center gap-2.5 p-0 mb-6 border-b border-[#f8f4ef] pb-4">
              <FiBookOpen className="w-6 h-6 text-[#a63420]" />
              <Card.Title className="text-h2 text-[#1f1b18] font-bold">
                Mission Briefing
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-0 flex flex-col gap-4">
              {quest.briefing.map((paragraph, index) => (
                <p key={index} className="text-body-md text-[#6b6560] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </Card.Content>
          </Card>

          {/* Technical Parameters Card */}
          <div className="bg-[#f5ddd9] rounded-xl p-8 flex flex-col gap-6 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="w-2 h-6 bg-[#a63420] rounded-full" />
              <h3 className="text-h3 text-[#58413d] font-bold tracking-wider uppercase">
                Mission Control: Deployment Config
              </h3>
            </div>

            {/* Enhanced Quest ID Display */}
            <Card className="bg-white/90 border border-[#dfbfb9] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-label font-bold text-[#a63420]">
                  <FiCpu className="w-3.5 h-3.5" />
                  INITIALIZATION KEY
                </div>
                <p className="text-body-sm text-[#6b6560]">
                  Use this unique identifier to initialize the OpenClaw system for this specific operation.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#fbe3df] border border-[#dfbfb94d] rounded-xl px-4 py-2 w-full md:w-auto justify-between">
                <span className="text-mono font-bold text-[#251916]">
                  {quest.initializationKey}
                </span>
                <Button
                  isIconOnly
                  onPress={handleCopyId}
                  className="w-7 h-7 rounded-lg bg-white/50 hover:bg-white transition-all flex items-center justify-center p-0"
                  aria-label="Copy Initialization Key"
                >
                  {copiedId ? (
                    <FiCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  ) : (
                    <FiCopy className="w-3.5 h-3.5 text-[#a63420]" />
                  )}
                </Button>
              </div>
            </Card>

            {/* JSON Parameters */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-label font-bold text-[#58413d]">
                  <FiCpu className="w-3.5 h-3.5" />
                  JSON PARAMETERS
                </div>

                <Button
                  onPress={handleCopyCode}
                  className="bg-white/80 hover:bg-white text-[#a63420] border border-[#dfbfb9] rounded-lg text-xs font-bold px-3 py-1.5 transition-all flex items-center gap-1.5"
                >
                  {copiedCode ? (
                    <>
                      <FiCheck className="w-3.5 h-3.5 text-[#10B981]" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-3.5 h-3.5" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-[#251916f2] border border-[#dfbfb9] rounded-xl p-4 overflow-x-auto shadow-inner">
                <pre className="text-mono text-[#ffdad3] leading-relaxed select-all">
                  <code>{quest.jsonParams}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Rewards & Actions */}
        <div className="flex flex-col gap-6">
          {/* Expected Rewards Card */}
          <Card className="bg-white border border-[#f8f4ef] rounded-xl p-8 shadow-soft">
            <Card.Header className="flex items-center gap-2.5 p-0 mb-6 border-b border-[#f8f4ef] pb-4">
              <FiAward className="w-6 h-6 text-[#f59e0b]" />
              <Card.Title className="text-h2 text-[#1f1b18] font-bold">
                Expected Rewards
              </Card.Title>
            </Card.Header>

            <Card.Content className="p-0 flex flex-col gap-4">
              {/* Primary Reward */}
              <div className="flex items-center gap-4 bg-[#f8f4ef] rounded-2xl p-4">
                <div className="w-12 h-12 bg-[#f59e0b33] rounded-full flex items-center justify-center text-[#f59e0b] shrink-0">
                  <FaCoins className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-h3 font-bold text-[#1f1b18]">
                    {quest.primaryRewardValue}
                  </span>
                  <span className="text-label font-bold text-[#6b6560]">
                    {quest.primaryRewardLabel}
                  </span>
                </div>
              </div>

              {/* Secondary Reward */}
              <div className="flex items-center gap-4 bg-[#f8f4ef] rounded-2xl p-4">
                <div className="w-12 h-12 bg-[#6746c51a] rounded-full flex items-center justify-center text-[#6746c5] shrink-0">
                  <FiAward className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-h3 font-bold text-[#1f1b18]">
                    {quest.secondaryRewardValue}
                  </span>
                  <span className="text-label font-bold text-[#6b6560]">
                    {quest.secondaryRewardLabel}
                  </span>
                </div>
              </div>

              {/* Bonus Condition */}
              <div className="border border-[#dfbfb9] rounded-2xl p-5 flex flex-col gap-2 mt-2 bg-white">
                <div className="flex items-center gap-1.5 text-label font-bold text-[#6b6560]">
                  <FiClock className="w-4 h-4 text-[#6b6560]" />
                  BONUS OBJECTIVE
                </div>
                <p className="text-body-sm text-[#1f1b18] leading-relaxed">
                  {quest.bonusObjective}
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}

