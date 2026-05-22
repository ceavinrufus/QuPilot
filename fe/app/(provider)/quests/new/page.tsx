"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, TextArea, TextField, Label, Select, ListBox } from "@heroui/react";
import type { Key } from "@heroui/react";
import { FiTarget, FiGift } from "react-icons/fi";
import { LuRocket } from "react-icons/lu";

export default function CreateQuestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardType, setRewardType] = useState<Key>("erc20");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !amount) return;

    setIsLoading(true);
    // Simulate API quest launch
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="flex justify-center w-full max-w-7xl mx-auto pt-8 pb-32">
      <div className="flex flex-col w-full max-w-214 gap-10">
        {/* Header */}
        <div className="text-center flex flex-col gap-3">
          <h1 className="text-4xl md:text-5xl text-[#1f1b18] font-extrabold tracking-tight font-nunito">
            Launch a New Quest
          </h1>
          <p className="text-[#6b6560] text-base md:text-lg">
            Configure the mission parameters to engage your community.
          </p>
        </div>

        {/* Form Container */}
        <Form 
          onSubmit={handleSubmit} 
          className="bg-white rounded-3xl border border-[#f5ddd9] p-8 md:p-12 shadow-sm flex flex-col gap-10"
        >
          {/* Section 1: Identity */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#f5ddd9]">
              <FiTarget className="text-[#a63420] text-xl" />
              <h2 className="text-[#1f1b18] text-xl font-bold font-nunito">Quest Identity</h2>
            </div>
            
            <div className="flex flex-col gap-6">
              <TextField isRequired>
                <Label className="text-[#1f1b18] text-sm font-bold tracking-wide mb-1">Quest Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Great Liquidity Migration"
                  className="rounded-md border border-[#e8e2d9] px-3 py-2.5 text-base shadow-sm focus-visible:border-[#a63420]"
                />
              </TextField>

              <TextField isRequired>
                <Label className="text-[#1f1b18] text-sm font-bold tracking-wide mb-1">Detailed Description</Label>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the mission objectives and lore..."
                  rows={4}
                  className="rounded-md border border-[#e8e2d9] px-3 py-2.5 text-base shadow-sm focus-visible:border-[#a63420] resize-none"
                  style={{ resize: "none" }}
                />
              </TextField>
            </div>
          </div>

          {/* Section 2: Rewards */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#f5ddd9]">
              <FiGift className="text-[#f59e0b] text-xl" />
              <h2 className="text-[#1f1b18] text-xl font-bold font-nunito">Reward Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <Select
                isRequired
                value={rewardType}
                onChange={(key) => setRewardType(key as Key)}
                className="w-full flex flex-col"
              >
                <Label className="text-[#1f1b18] text-sm font-bold tracking-wide mb-1.5">Reward Type</Label>
                <Select.Trigger className="rounded-md border border-[#dfbfb9] bg-white px-3 py-2.5 text-base shadow-sm focus-visible:border-[#a63420] flex items-center justify-between min-h-10.5 cursor-pointer">
                  <Select.Value />
                  <Select.Indicator className="ml-2" />
                </Select.Trigger>
                <Select.Popover className="bg-white border border-[#dfbfb9] rounded-md shadow-lg">
                  <ListBox className="p-1">
                    <ListBox.Item id="erc20" textValue="Native Tokens (ERC-20)" className="px-3 py-2 text-base text-[#1f1b18] hover:bg-[#f5ddd9] rounded-md cursor-pointer flex items-center justify-between">
                      Native Tokens (ERC-20)
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="nft" textValue="NFT" className="px-3 py-2 text-base text-[#1f1b18] hover:bg-[#f5ddd9] rounded-md cursor-pointer flex items-center justify-between">
                      NFT
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="xp" textValue="Experience Points" className="px-3 py-2 text-base text-[#1f1b18] hover:bg-[#f5ddd9] rounded-md cursor-pointer flex items-center justify-between">
                      Experience Points
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>

              <TextField isRequired>
                <Label className="text-[#1f1b18] text-sm font-bold tracking-wide mb-1">Amount / Value</Label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 500 USDC"
                  className="rounded-md border border-[#e8e2d9] px-3 py-2.5 text-base shadow-sm focus-visible:border-[#a63420]"
                />
              </TextField>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-8 mt-2 flex justify-end border-t border-[#f5ddd9]">
            <Button
              type="submit"
              isDisabled={isLoading}
              className="bg-[#a63420] text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 hover:bg-[#8c2a1a] transition-colors cursor-pointer"
            >
              <LuRocket className="text-xl" />
              {isLoading ? "Deploying..." : "Launch Quest"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
