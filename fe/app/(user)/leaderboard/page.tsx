"use client";

import React from "react";
import { Avatar, Card, Table } from "@heroui/react";
import { FaCrown, FaTrophy, FaMedal, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Staggered top 3 podium mock data
const TOP_THREE = [
  {
    rank: 2,
    name: "Luna",
    owner: "0x4F...9A21",
    points: "12,450 pts",
    tier: "Silver Tier",
    bgColor: "bg-[#f5ddd9]",
    badgeBg: "bg-[#6746c5]",
    textColor: "text-[#1f1b18]",
    pointsColor: "text-[#6b6560]",
    accentColor: "text-[#6746c5]",
    avatarBg: "bg-[#ecd5d1]",
    cardHeight: "h-30 md:h-[130px]",
    badgeIcon: <FaTrophy className="text-white text-xs" />,
    initial: "L",
  },
  {
    rank: 1,
    name: "OrbitMaster",
    owner: "0x1A...B882",
    points: "15,890 pts",
    tier: "Gold Tier",
    bgColor: "bg-[#ffdad3]",
    badgeBg: "bg-[#f59e0b]",
    textColor: "text-[#a63420]",
    pointsColor: "text-[#c84b35]",
    accentColor: "text-[#f59e0b]",
    avatarBg: "bg-[#fbe3df]",
    cardHeight: "h-40 md:h-[175px]",
    badgeIcon: <FaCrown className="text-white text-sm animate-bounce" />,
    initial: "O",
  },
  {
    rank: 3,
    name: "Nova",
    owner: "0x9C...3E44",
    points: "11,200 pts",
    tier: "Bronze Tier",
    bgColor: "bg-[#fbe3df]",
    badgeBg: "bg-[#006767]",
    textColor: "text-[#1f1b18]",
    pointsColor: "text-[#6b6560]",
    accentColor: "text-[#006767]",
    avatarBg: "bg-[#fbe3df]",
    cardHeight: "h-25 md:h-[110px]",
    badgeIcon: <FaMedal className="text-white text-xs" />,
    initial: "N",
  },
];

// Remaining leaderboard mock data
const LEADERBOARD_DATA = [
  { rank: 4, name: "CosmicDrifter", owner: "0x7B...1F92", points: "9,850", successRate: 92, avatarBg: "bg-[#f5ddd9]", initial: "C" },
  { rank: 5, name: "StarGazer99", owner: "0x22...E4A1", points: "8,420", successRate: 88, avatarBg: "bg-[#ecd5d1]", initial: "S" },
  { rank: 6, name: "AstroPug", owner: "0x55...C888", points: "7,900", successRate: 75, avatarBg: "bg-[#fbe3df]", initial: "A" },
];

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto px-4 md:px-8 py-6">
      {/* Header Section */}
      <div className="text-center max-w-168 mx-auto flex flex-col gap-3">
        <h1 className="text-display text-[#a63420] text-4xl md:text-5xl font-extrabold tracking-tight">
          Global Rankings
        </h1>
        <p className="text-body-lg text-[#6b6560] leading-relaxed">
          Climb the ranks, complete quests, and become the top explorer in the Pilot universe.
        </p>
      </div>

      {/* Podium Section (Top 3) */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-4 max-w-4xl mx-auto w-full mt-10">
        {TOP_THREE.map((pilot) => (
          <div
            key={pilot.rank}
            className={`flex flex-col items-center w-full max-w-55 relative ${
              pilot.rank === 1 ? "order-1 md:order-2 z-10" : pilot.rank === 2 ? "order-2 md:order-1" : "order-3"
            }`}
          >
            {/* Top Wallet Badge */}
            <div className="bg-[#fff8f6] border border-[#f5ddd9] rounded-2xl p-2 px-4 shadow-soft flex flex-col items-center justify-center mb-6 w-full text-center relative z-20">
              <span className={`text-body-sm font-bold ${pilot.accentColor} font-mono`}>
                {pilot.owner}
              </span>
              <span className="text-[10px] text-[#6b6560] font-bold uppercase tracking-wider mt-0.5">
                {pilot.tier}
              </span>
            </div>

            {/* Avatar & Floating Badge */}
            <div className="relative -mb-6 z-20 flex items-center justify-center">
              <Avatar
                className={`border-4 border-[#fff8f6] shadow-medium ${pilot.avatarBg} ${
                  pilot.rank === 1 ? "h-30 w-30" : "h-22 w-22"
                }`}
              >
                <Avatar.Fallback className={`font-bold ${pilot.rank === 1 ? "text-2xl" : "text-lg"} text-[#1f1b18]`}>
                  {pilot.initial}
                </Avatar.Fallback>
              </Avatar>
              
              {/* Position Icon Badge */}
              <div
                className={`absolute bottom-0 right-0 ${pilot.badgeBg} p-2 rounded-full border-2 border-[#fff8f6] shadow-soft flex items-center justify-center`}
              >
                {pilot.badgeIcon}
              </div>

              {/* Gold Crown floating decorator for Rank 1 */}
              {pilot.rank === 1 && (
                <div className="absolute -top-6 -right-2 transform rotate-12 z-30">
                  <FaCrown className="text-[#f59e0b] text-2xl drop-shadow-md animate-pulse" />
                </div>
              )}
            </div>

            {/* Content card (staggered height) */}
            <Card
              className={`w-full ${pilot.bgColor} rounded-t-none rounded-b-[24px] shadow-medium flex flex-col justify-end items-center text-center p-6 pt-10 ${pilot.cardHeight} transition-transform hover:-translate-y-1 duration-200`}
            >
              <div className="flex flex-col gap-1 w-full mt-auto">
                <span className={`font-bold tracking-tight ${pilot.textColor} ${pilot.rank === 1 ? "text-xl md:text-2xl" : "text-base md:text-lg"}`}>
                  {pilot.name}
                </span>
                <span className={`text-body-xs font-bold uppercase tracking-wider ${pilot.pointsColor}`}>
                  {pilot.points}
                </span>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#f8f4ef] rounded-xl overflow-hidden shadow-soft mt-6">
        <Table className="w-full">
          <Table.ScrollContainer>
            <Table.Content aria-label="Explorer Leaderboard Table">
              <Table.Header className="bg-[#f8f4ef] border-b border-[#f5ddd9]">
                <Table.Column className="py-4 px-6 text-[12px] text-[#6b6560] font-bold text-center w-25">
                  Rank
                </Table.Column>
                <Table.Column className="py-4 px-6 text-[12px] text-[#6b6560] font-bold text-left">
                  Explorer
                </Table.Column>
                <Table.Column className="py-4 px-6 text-[12px] text-[#6b6560] font-bold text-left">
                  Wallet
                </Table.Column>
                <Table.Column className="py-4 px-6 text-[12px] text-[#6b6560] font-bold text-right">
                  Points
                </Table.Column>
                <Table.Column className="py-4 px-6 text-[12px] text-[#6b6560] font-bold text-right">
                  Success Rate
                </Table.Column>
              </Table.Header>

              <Table.Body className="divide-y divide-[#f5ddd9]/40">
                {LEADERBOARD_DATA.map((row) => (
                  <Table.Row key={row.rank} className="hover:bg-[#f8f4ef]/30 transition-colors">
                    {/* Rank */}
                    <Table.Cell className="py-4 px-6 font-bold text-[#6b6560] text-center">
                      {row.rank}
                    </Table.Cell>

                    {/* Explorer (Avatar + Name) */}
                    <Table.Cell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className={`size-10 ${row.avatarBg} border-2 border-white shadow-soft`}>
                          <Avatar.Fallback className="text-sm font-bold text-[#1f1b18]">
                            {row.initial}
                          </Avatar.Fallback>
                        </Avatar>
                        <span className="font-bold text-[#1f1b18] text-body-md">
                          {row.name}
                        </span>
                      </div>
                    </Table.Cell>

                    {/* Wallet */}
                    <Table.Cell className="py-4 px-6 text-[#6b6560] font-mono text-body-sm">
                      {row.owner}
                    </Table.Cell>

                    {/* Points */}
                    <Table.Cell className="py-4 px-6 text-right font-bold text-[#a63420] text-body-md">
                      {row.points}
                    </Table.Cell>

                    {/* Success Rate with progress bar */}
                    <Table.Cell className="py-4 px-6">
                      <div className="flex items-center justify-end gap-3">
                        <span
                          className={`font-bold text-body-sm ${
                            row.successRate >= 90 ? "text-[#10b981]" : "text-[#f59e0b]"
                          }`}
                        >
                          {row.successRate}%
                        </span>
                        
                        {/* Custom visual progress bar matching Figma 64px width */}
                        <div className="w-16 h-2 bg-[#f5ddd9] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              row.successRate >= 90 ? "bg-[#10b981]" : "bg-[#f59e0b]"
                            }`}
                            style={{ width: `${row.successRate}%` }}
                          />
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>

        {/* Custom Styled Pagination Footer */}
        <div className="bg-[#f8f4ef] border-t border-[#f5ddd9] py-4 px-8 flex items-center justify-between">
          <span className="text-body-sm text-[#6b6560]">
            Showing 1-10 of 2,451
          </span>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-lg bg-[#fff8f6] border border-[#f5ddd9] text-[#6b6560] hover:text-[#1f1b18] hover:border-[#1f1b18]/30 transition-all flex items-center justify-center">
              <FaChevronLeft className="text-[10px]" />
            </button>
            <button className="h-8 w-8 rounded-lg bg-[#fff8f6] border border-[#f5ddd9] text-[#1f1b18] hover:bg-[#a63420] hover:text-white hover:border-[#a63420] transition-all flex items-center justify-center font-bold">
              <FaChevronRight className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
