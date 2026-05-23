"use client";

import React from "react";
import Link from "next/link";
import { Card, Button, Chip, Avatar } from "@heroui/react";
import { FaFire, FaCoins, FaAward, FaDollarSign, FaChevronRight } from "react-icons/fa6";
import { FiClock, FiUsers, FiCpu, FiCompass } from "react-icons/fi";

export default function ExploreFeedPage() {
  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto px-2">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-3 py-5 border-b border-[#f5ddd9]/60">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#a63420] tracking-tight font-sans">
          Discover Missions
        </h1>
        <p className="text-base md:text-lg text-[#6b6560] max-w-192 leading-relaxed">
          Explore new frontiers, connect with top providers, and embark on personalized quests
          designed for your journey across the Web3 galaxy.
        </p>
      </div>

      {/* 2. Bento Grid Section: Recommended for You */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hero Bento Item (Spans 2 cols on desktop) */}
        <Card 
          variant="default" 
          className="lg:col-span-2 relative overflow-hidden bg-white border border-[#f8f4ef] rounded-3xl p-8 hover:shadow-md transition-all duration-300"
        >
          {/* Subtle cosmic background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-orange-100/30 via-transparent to-transparent pointer-events-none" />
          
          <Card.Header className="flex flex-row items-center justify-between z-10 p-0 mb-6">
            <Chip color="danger" variant="soft" className="bg-[#fff8f6] border border-[#f5ddd9] text-[#a63420] rounded-full px-3 py-1 flex items-center gap-1.5">
              <FaFire size={12} className="text-[#a63420] animate-bounce" />
              <Chip.Label className="text-xs font-bold uppercase tracking-wider">Hot Quest</Chip.Label>
            </Chip>
            
            <div className="p-2 bg-[#f8f4ef] rounded-full text-[#6b6560]">
              <FiCompass size={18} />
            </div>
          </Card.Header>

          <Card.Content className="flex flex-col gap-4 z-10 p-0 mb-6">
            <h2 className="text-2xl font-bold text-[#a63420] tracking-tight">
              Stellar Liquidity Run
            </h2>
            <p className="text-[#6b6560] text-sm md:text-base leading-relaxed max-w-128">
              Provide liquidity to the new StarDEX pools and earn exclusive cosmic badges alongside yield multipliers.
            </p>
          </Card.Content>

          <Card.Footer className="flex flex-row items-center justify-between z-10 p-0 border-t border-[#f8f4ef] pt-5">
            <Button className="bg-[#a63420] text-white hover:bg-[#8f2b1a] transition-all text-xs font-bold px-6 py-2.5 rounded-full shadow-sm">
              Start Mission
            </Button>
            
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#6746c5] bg-[#f3efff] px-3 py-1.5 rounded-full border border-[#e5dcff]">
              <FaAward size={14} />
              <span>500 XP</span>
            </div>
          </Card.Footer>
        </Card>

        {/* Side Bento Item: Top Provider */}
        <Card 
          variant="secondary" 
          className="bg-[#f8f4ef] border-transparent rounded-3xl p-8 flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#fbe3df] rounded-full opacity-40 blur-xl pointer-events-none" />

          <Card.Header className="p-0">
            <h3 className="text-sm font-bold text-[#1f1b18] uppercase tracking-wider mb-6">
              Featured Provider
            </h3>
          </Card.Header>

          <Card.Content className="flex flex-col items-center gap-3 p-0 mb-6">
            <div className="w-20 h-20 bg-[#fbe3df] rounded-full border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
              <Avatar className="w-full h-full text-[#a63420] text-xl font-bold">
                <Avatar.Image src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150" alt="AstroFi Labs" className="object-cover" />
                <Avatar.Fallback>AF</Avatar.Fallback>
              </Avatar>
            </div>
            
            <h4 className="text-lg font-bold text-[#a63420] tracking-tight">
              AstroFi Labs
            </h4>
            
            <div className="bg-[#fff8f6] border border-[#f5ddd9] rounded-full px-3 py-1 text-xs font-bold text-[#6b6560] tracking-wide">
              12 Active Missions
            </div>
          </Card.Content>

          <Card.Footer className="p-0 flex justify-center w-full">
            <Link href="/profile" className="w-full">
              <Button 
                variant="outline" 
                className="w-full bg-white text-[#a63420] hover:bg-[#fff8f6] border border-[#c9c1b6] hover:border-[#a63420] transition-all text-xs font-bold py-2.5 rounded-full shadow-sm"
              >
                View Profile
              </Button>
            </Link>
          </Card.Footer>
        </Card>
      </div>

      {/* 3. New Quests Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-[#f5ddd9]/60 pb-3">
          <h2 className="text-xl md:text-2xl font-bold text-[#a63420]">
            New Quests
          </h2>
          <Link 
            href="/quests" 
            className="text-xs font-bold text-[#6b6560] hover:text-[#a63420] flex items-center gap-1 transition-colors uppercase tracking-wider"
          >
            View All
            <FaChevronRight size={10} />
          </Link>
        </div>

        {/* Grid of Quest Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Bridge to Nova */}
          <Card className="bg-white border border-[#f8f4ef] rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <Card.Header className="flex flex-row items-center justify-between p-0 mb-5">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 bg-[#9d7eff] text-white rounded-full flex items-center justify-center font-bold">
                  <Avatar.Fallback className="bg-[#9d7eff]"><FiCpu size={18} /></Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#6b6560]">Nova Network</span>
                  <span className="text-[10px] text-[#6b6560b2] flex items-center gap-1">
                    <FiClock size={10} />
                    2 hours ago
                  </span>
                </div>
              </div>
              
              <Chip className="bg-[#f8f4ef] border-transparent text-[#6b6560] rounded-full text-[10px] font-bold px-2 py-0.5">
                <Chip.Label>Beginner</Chip.Label>
              </Chip>
            </Card.Header>

            <Card.Content className="flex flex-col gap-2 p-0 mb-6">
              <h3 className="text-base font-bold text-[#1f1b18] hover:text-[#a63420] transition-colors leading-snug">
                Bridge to Nova
              </h3>
              <p className="text-[#6b6560] text-xs leading-relaxed line-clamp-2">
                Complete your first cross-chain transfer to the Nova testnet and secure your early adopter role.
              </p>
            </Card.Content>

            <Card.Footer className="flex items-center justify-between p-0 border-t border-[#f8f4ef] pt-4 mt-auto">
              <div className="flex items-center gap-1 text-[#f59e0b] font-bold text-xs">
                <FaCoins size={12} />
                <span>100 NVT</span>
              </div>
              
              <Link 
                href="/quests/nova-bridge" 
                className="text-xs font-bold text-[#a63420] hover:text-[#8f2b1a] flex items-center gap-1 transition-colors"
              >
                Join
                <FaChevronRight size={8} />
              </Link>
            </Card.Footer>
          </Card>

          {/* Card 2: Community Vanguard */}
          <Card className="bg-white border border-[#f8f4ef] rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <Card.Header className="flex flex-row items-center justify-between p-0 mb-5">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 bg-[#008282] text-white rounded-full flex items-center justify-center font-bold">
                  <Avatar.Fallback className="bg-[#008282]"><FiUsers size={18} /></Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#6b6560]">Cosmic DAO</span>
                  <span className="text-[10px] text-[#6b6560b2] flex items-center gap-1">
                    <FiClock size={10} />
                    5 hours ago
                  </span>
                </div>
              </div>
              
              <Chip className="bg-[#f8f4ef] border-transparent text-[#6b6560] rounded-full text-[10px] font-bold px-2 py-0.5">
                <Chip.Label>Social</Chip.Label>
              </Chip>
            </Card.Header>

            <Card.Content className="flex flex-col gap-2 p-0 mb-6">
              <h3 className="text-base font-bold text-[#1f1b18] hover:text-[#a63420] transition-colors leading-snug">
                Community Vanguard
              </h3>
              <p className="text-[#6b6560] text-xs leading-relaxed line-clamp-2">
                Join the Discord, participate in the town hall, and vote on the latest governance proposal.
              </p>
            </Card.Content>

            <Card.Footer className="flex items-center justify-between p-0 border-t border-[#f8f4ef] pt-4 mt-auto">
              <div className="flex items-center gap-1 text-[#6746c5] font-bold text-xs">
                <FaAward size={12} />
                <span>Special NFT</span>
              </div>
              
              <Link 
                href="/quests/cosmic-vanguard" 
                className="text-xs font-bold text-[#a63420] hover:text-[#8f2b1a] flex items-center gap-1 transition-colors"
              >
                Join
                <FaChevronRight size={8} />
              </Link>
            </Card.Footer>
          </Card>

          {/* Card 3: Testnet Stress Test */}
          <Card className="bg-white border border-[#f8f4ef] rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <Card.Header className="flex flex-row items-center justify-between p-0 mb-5">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 bg-[#ffdad6] text-[#93000a] rounded-full flex items-center justify-center font-bold animate-pulse">
                  <Avatar.Image src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150" alt="AstroFi Labs" className="object-cover" />
                  <Avatar.Fallback>AF</Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#6b6560]">AstroFi Labs</span>
                  <span className="text-[10px] text-[#6b6560b2] flex items-center gap-1">
                    <FiClock size={10} />
                    1 day ago
                  </span>
                </div>
              </div>
              
              <Chip className="bg-[#f8f4ef] border-transparent text-[#6b6560] rounded-full text-[10px] font-bold px-2 py-0.5">
                <Chip.Label>Advanced</Chip.Label>
              </Chip>
            </Card.Header>

            <Card.Content className="flex flex-col gap-2 p-0 mb-6">
              <h3 className="text-base font-bold text-[#1f1b18] hover:text-[#a63420] transition-colors leading-snug">
                Testnet Stress Test
              </h3>
              <p className="text-[#6b6560] text-xs leading-relaxed line-clamp-2">
                Help us find bugs in the v2 contracts. High rewards for critical vulnerability reports.
              </p>
            </Card.Content>

            <Card.Footer className="flex items-center justify-between p-0 border-t border-[#f8f4ef] pt-4 mt-auto">
              <div className="flex items-center gap-0.5 text-[#a63420] font-bold text-xs">
                <FaDollarSign size={12} />
                <span>Up to $5k</span>
              </div>
              
              <Link 
                href="/quests/astrofi-stress" 
                className="text-xs font-bold text-[#a63420] hover:text-[#8f2b1a] flex items-center gap-1 transition-colors"
              >
                Join
                <FaChevronRight size={8} />
              </Link>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
}
