"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Chip, Avatar, ProgressBar } from "@heroui/react";
import { 
  FiArrowLeft, 
  FiBookOpen, 
  FiCpu, 
  FiTrendingUp, 
  FiTerminal, 
  FiActivity, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiLock, 
  FiUnlock, 
  FiCopy
} from "react-icons/fi";

// Mock details database
const MOCK_QUESTS: Record<string, {
  id: string;
  title: string;
  description: string;
  reward: string;
  status: string;
  escrowStatus: string;
  tags: string[];
  provider: {
    name: string;
    avatar: string;
    bgColor: string;
  };
  details: {
    briefing: string;
    requirements: string[];
  };
  parameters: {
    network: string;
    contract: string;
  };
  stats: {
    totalAgents: number;
    joinedToday: number;
    progress: number;
    completed: number;
    inProgress: number;
  };
  agents: { id: string; name: string; status: string; progress: number; time: string }[];
}> = {
  "q-1": {
    id: "q-1",
    title: "Nebula Liquidity Provisioning",
    description: "Provide liquidity to the ETH/USDC pool on Uniswap V3 within the specified price range to earn boosted pilot rewards and help stabilize the sector.",
    reward: "50,000 PLT",
    status: "Active",
    escrowStatus: "Escrow Locked",
    tags: ["DeFi Staking", "Ends in 3 days"],
    provider: {
      name: "Uniswap DAO",
      avatar: "U",
      bgColor: "bg-[#9d7eff]"
    },
    details: {
      briefing: "This quest requires agents to supply deep liquidity to the designated trading pair. By concentrating liquidity around the current market price, you ensure minimal slippage for other pilots traversing this sector.",
      requirements: [
        "Minimum deposit of $500 equivalent.",
        "Liquidity must remain active for at least 72 hours.",
        "Price range must be within +/- 5% of the current tick."
      ]
    },
    parameters: {
      network: "Ethereum Mainnet",
      contract: "0x8f3...a9b2"
    },
    stats: {
      totalAgents: 1432,
      joinedToday: 12,
      progress: 68,
      completed: 974,
      inProgress: 458
    },
    agents: [
      { id: "bot-001", name: "DeepSpaceScraper", status: "Running", progress: 75, time: "2m ago" },
      { id: "bot-042", name: "NebulaMapper", status: "Success", progress: 100, time: "10m ago" },
      { id: "bot-099", name: "StarDustChaser", status: "Failed", progress: 30, time: "30m ago" },
    ],
  },
  "q-2": {
    id: "q-2",
    title: "Navigate the Orion Nebulae & Verify Telemetry",
    description: "Scan sectors 4 and 9 using the autonomous probe agent and report anomalies to the cartography desk.",
    reward: "0.25 ETH",
    status: "Active",
    escrowStatus: "Escrow Locked",
    tags: ["Deep Space", "High Risk"],
    provider: {
      name: "Cartography Desk",
      avatar: "C",
      bgColor: "bg-primary"
    },
    details: {
      briefing: "Scan sectors 4 and 9 using the autonomous probe agent. Collect telemetry files and cross-reference them with the sector registry before returning.",
      requirements: [
        "Autonomous probe must be level 3 or higher.",
        "Scan must cover 100% of sectors 4 and 9.",
        "Submit signed logs to verification contract."
      ]
    },
    parameters: {
      network: "Arbitrum One",
      contract: "0x4a2...55e2"
    },
    stats: {
      totalAgents: 412,
      joinedToday: 3,
      progress: 45,
      completed: 185,
      inProgress: 227
    },
    agents: [
      { id: "bot-302", name: "QuantumScraper", status: "Running", progress: 45, time: "1m ago" },
    ],
  },
  "q-3": {
    id: "q-3",
    title: "Intercept Anomalous Deep-Space Transmission",
    description: "Listen to designated radio bands and compute the fast-Fourier transform of the carrier wave to decode secret space pirate signals.",
    reward: "0.45 ETH",
    status: "Completed",
    escrowStatus: "Released",
    tags: ["Radio Waves", "Data Scrape"],
    provider: {
      name: "Starfleet Intel",
      avatar: "S",
      bgColor: "bg-success"
    },
    details: {
      briefing: "Listen to designated radio bands and compute the fast-Fourier transform of the carrier wave. Filter noise out and look for structured packet frames.",
      requirements: [
        "Run packet interceptor for 2 hours.",
        "Compute FFT of 1.4GHz signal band.",
        "Decode and verify packet signatures."
      ]
    },
    parameters: {
      network: "Solana Mainnet",
      contract: "7x9...B4a"
    },
    stats: {
      totalAgents: 815,
      joinedToday: 0,
      progress: 100,
      completed: 815,
      inProgress: 0
    },
    agents: [
      { id: "bot-042", name: "NebulaMapper", status: "Success", progress: 100, time: "1h ago" },
    ],
  },
};

export default function ProviderQuestDetailPage() {
  const { questId } = useParams();
  const router = useRouter();
  const quest = MOCK_QUESTS[questId as string] || MOCK_QUESTS["q-1"];
  const [isUpdating, setIsUpdating] = useState(false);

  const handleReleaseEscrow = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      alert("Successfully released rewards to agents!");
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Navigation */}
      <div>
        <Link
          href="/dashboard"
          className="text-body-sm text-text-secondary hover:text-primary transition-all flex items-center gap-2 font-bold font-heading"
        >
          <FiArrowLeft className="text-sm shrink-0" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Quest Header Hero */}
      <div className="bg-surface border-2 border-surface-variant rounded-xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden shadow-soft">
        {/* Decorative Blob */}
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-[#ffdad3] rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Nebula Illustration */}
        <div className="relative w-full lg:w-97.75 h-65 lg:h-97.75 rounded-lg bg-[#f5ddd9] shrink-0 overflow-hidden flex items-center justify-center border border-outline-variant shadow-inner">
          {/* Animated Cosmic Gradient representing Nebula */}
          <div className="absolute inset-0 bg-linear-to-tr from-[#e05d45] via-[#7c5cdb] to-[#85f4f4] animate-pulse opacity-85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white/10 via-transparent to-black/30" />
          {/* Star dust effect */}
          <div className="absolute w-2 h-2 rounded-full bg-white top-12 left-16 animate-ping duration-1000" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-white bottom-20 right-24 animate-ping duration-700" />
          <div className="absolute w-1 h-1 rounded-full bg-white top-32 right-12 animate-pulse" />
          <div className="absolute w-2 h-2 rounded-full bg-yellow-200 bottom-12 left-32 animate-pulse" />

          <span className="text-display text-white drop-shadow-lg text-center select-none font-extrabold z-10 px-4">
            {quest.id.toUpperCase()}
          </span>

          {/* Overlay Status Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-surface-variant rounded-full py-1.5 px-3.5 flex items-center gap-2 shadow-soft">
            <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-sans font-bold text-success capitalize">{quest.status}</span>
          </div>
        </div>

        {/* Content Info */}
        <div className="flex-1 flex flex-col gap-4 z-10 w-full">
          <div className="flex flex-wrap gap-2">
            {quest.tags.map((tag, idx) => (
              <Chip 
                key={idx} 
                variant="soft" 
                className={idx === 0 ? "bg-secondary-fixed text-on-secondary-fixed font-bold border border-secondary-container/20" : "bg-surface-raised text-text-secondary font-bold border border-border"}
              >
                <Chip.Label>{tag}</Chip.Label>
              </Chip>
            ))}
          </div>

          <h1 className="text-h1 text-text-primary font-extrabold leading-tight mt-1">
            {quest.title}
          </h1>
          <p className="text-body-lg text-text-secondary">
            {quest.description}
          </p>

          {/* Separator and Pool Info */}
          <div className="w-full border-t border-surface-variant pt-6 mt-2 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Reward Pool */}
            <div className="flex flex-col gap-1">
              <span className="text-label text-text-muted font-bold tracking-wider">REWARD POOL</span>
              <div className="flex items-center gap-2 text-[#a63420] font-heading font-bold text-[17px]">
                <FiTrendingUp className="text-lg" />
                <span>{quest.reward}</span>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden sm:block h-10 w-px bg-surface-variant" />

            {/* Provider Info */}
            <div className="flex flex-col gap-1">
              <span className="text-label text-text-muted font-bold tracking-wider">PROVIDER</span>
              <div className="flex items-center gap-2">
                <Avatar className={`size-6 rounded-full flex items-center justify-center font-bold text-[11px] text-white ${quest.provider.bgColor}`}>
                  {quest.provider.avatar}
                </Avatar>
                <span className="text-body-md font-bold text-text-primary font-heading">
                  {quest.provider.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout for Details & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Telemetry (takes 2 cols on lg) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Description Card */}
          <Card className="bg-surface border border-surface-variant shadow-soft p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-text-primary border-b border-surface-variant pb-3">
              <FiBookOpen className="text-secondary text-lg" />
              <h2 className="text-h3 font-bold font-heading">Mission Briefing</h2>
            </div>
            <Card.Content className="flex flex-col gap-4 p-0">
              <p className="text-body-md text-text-secondary leading-relaxed">
                {quest.details.briefing}
              </p>
              <div className="flex flex-col gap-2">
                <span className="text-body-md font-bold text-text-primary font-heading">Requirements:</span>
                <ul className="flex flex-col gap-2 pl-2">
                  {quest.details.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-body-md text-text-secondary">
                      <FiCheckCircle className="text-success text-sm mt-1 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card.Content>
          </Card>

          {/* Parameters Card */}
          <Card className="bg-[#f8f4ef] border border-outline-variant shadow-soft p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-text-primary border-b border-outline-variant pb-3">
              <FiCpu className="text-primary text-lg" />
              <h2 className="text-h3 font-bold font-heading">Technical Parameters</h2>
            </div>
            <Card.Content className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-0">
              {/* Network Box */}
              <div className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col gap-1.5 shadow-sm">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Network</span>
                <div className="flex items-center gap-2 text-text-primary">
                  <FiActivity className="text-secondary" />
                  <span className="text-body-md font-bold font-heading">{quest.parameters.network}</span>
                </div>
              </div>

              {/* Contract Box */}
              <div className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col gap-1.5 shadow-sm">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Contract</span>
                <div className="flex items-center justify-between text-text-primary font-mono text-[13px] font-bold">
                  <div className="flex items-center gap-2">
                    <FiLock className="text-primary" />
                    <span>{quest.parameters.contract}</span>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(quest.parameters.contract);
                      alert("Contract address copied!");
                    }} 
                    className="text-text-muted hover:text-primary transition-colors p-1"
                  >
                    <FiCopy />
                  </button>
                </div>
              </div>
            </Card.Content>
          </Card>

        </div>

        {/* Right Column: Stats (takes 1 col on lg) */}
        <div className="flex flex-col gap-8">
          
          {/* Total Agents Badge (Red/Coral Card) */}
          <div className="bg-[#c84b35] rounded-xl p-6 text-white flex flex-col gap-2 relative overflow-hidden shadow-medium select-none border border-outline-variant">
            <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <span className="text-label text-white/80 font-bold tracking-wider">TOTAL AGENTS JOINED</span>
            <div className="flex items-baseline gap-2.5 mt-1">
              <span className="text-display text-white font-extrabold leading-none">
                {quest.stats.totalAgents.toLocaleString()}
              </span>
              <span className="text-[13px] font-sans font-bold bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                +{quest.stats.joinedToday} today
              </span>
            </div>
          </div>

          {/* Completion Stats Card */}
          <Card className="bg-surface border border-surface-variant shadow-soft p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2.5 text-text-primary border-b border-surface-variant pb-3">
              <FiActivity className="text-accent text-lg" />
              <h3 className="text-h3 font-bold font-heading">Completion Stats</h3>
            </div>
            <Card.Content className="flex flex-col gap-5 p-0">
              
              {/* Progress Bar */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-body-sm font-bold font-heading">
                  <span className="text-text-secondary">Progress</span>
                  <span className="text-text-primary">{quest.stats.progress}% Complete</span>
                </div>
                <ProgressBar aria-label="Quest Completion Stats" value={quest.stats.progress} className="w-full">
                  <ProgressBar.Track className="bg-[#ffe9e5] h-3.5 rounded-full overflow-hidden border border-[#f5ddd9]">
                    <ProgressBar.Fill className="bg-accent rounded-full h-full" style={{ width: `${quest.stats.progress}%` }} />
                  </ProgressBar.Track>
                </ProgressBar>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-raised border border-surface-variant rounded-lg p-4 text-center shadow-sm">
                  <span className="text-success font-extrabold text-h2 font-heading leading-tight block">
                    {quest.stats.completed}
                  </span>
                  <span className="text-xs font-bold text-text-secondary font-sans tracking-wide uppercase mt-1 block">
                    Completed
                  </span>
                </div>
                <div className="bg-surface-raised border border-surface-variant rounded-lg p-4 text-center shadow-sm">
                  <span className="text-text-primary font-extrabold text-h2 font-heading leading-tight block">
                    {quest.stats.inProgress}
                  </span>
                  <span className="text-xs font-bold text-text-secondary font-sans tracking-wide uppercase mt-1 block">
                    In Progress
                  </span>
                </div>
              </div>
            </Card.Content>
          </Card>

        </div>
      </div>
    </div>
  );
}
