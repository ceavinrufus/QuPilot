"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, TextField, Label, Input, TextArea, FieldError, Button } from "@heroui/react";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import { FaRocket } from "react-icons/fa6";

export default function RegisterProviderPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId || !password || !confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Provider registered successfully!");
      router.push("/login");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-warm px-4 py-16 relative overflow-hidden">
      {/* Decorative background elements (from Figma & existing animations) */}
      <div className="absolute w-128 h-128 rounded-full bg-primary-light/50 -top-40 -right-40 blur-3xl animate-pulse duration-7000"></div>
      <div className="absolute w-160 h-160 rounded-full bg-secondary-light/60 -bottom-48 -left-48 blur-3xl animate-pulse duration-9000"></div>

      <div className="w-full max-w-144 z-10 flex flex-col items-center gap-8">
        
        {/* Brand Icon / Header */}
        <div className="flex flex-col items-center text-center gap-3">
          
          {/* Tilted Brand Icon Container (3 degrees rotation = rotate-3) */}
          <Link href="/" className="group transition-transform duration-300 hover:scale-105 active:scale-95">
            <div className="w-16 h-16 bg-white shadow-soft rounded-4xl flex items-center justify-center border-2 border-border rotate-3 transition-all duration-300 group-hover:rotate-6 group-hover:shadow-medium">
              <FaRocket size={26} className="text-[#A63420] transition-transform duration-300 group-hover:scale-110" />
            </div>
          </Link>
          
          <h1 className="text-h1 text-text-primary mt-2">Join the Mission</h1>
          <p className="text-body-lg text-text-secondary">
            Register as a Provider to start your Web3 quest.
          </p>
        </div>

        {/* Registration Card */}
        <div className="w-full bg-white border border-border shadow-medium rounded-xl p-8 hover:shadow-lifted transition-all duration-300">
          
          <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* User ID Field */}
            <TextField
              isRequired
              name="userId"
              value={userId}
              onChange={setUserId}
              className="flex flex-col gap-1.5"
            >
              <Label className="text-label text-text-secondary font-bold">
                User ID
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-text-secondary flex items-center pointer-events-none z-10">
                  <FiUser size={20} className="text-[#6B6560]" />
                </span>
                <Input
                  placeholder="Choose a unique ID"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-all duration-200 bg-bg-base text-text-primary font-medium text-body-md shadow-warm/5 focus:shadow-warm"
                />
              </div>
              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>

            {/* Password Field */}
            <TextField
              isRequired
              type="password"
              name="password"
              value={password}
              onChange={setPassword}
              className="flex flex-col gap-1.5"
            >
              <Label className="text-label text-text-secondary font-bold">
                Password
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-4.5 text-text-secondary flex items-center pointer-events-none z-10">
                  <FiLock size={20} className="text-[#6B6560]" />
                </span>
                <Input
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-all duration-200 bg-bg-base text-text-primary font-medium text-body-md shadow-warm/5 focus:shadow-warm"
                />
              </div>
              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>

            {/* Confirm Password Field */}
            <TextField
              isRequired
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={setConfirmPassword}
              className="flex flex-col gap-1.5"
            >
              <Label className="text-label text-text-secondary font-bold">
                Confirm Password
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-4.5 text-text-secondary flex items-center pointer-events-none z-10">
                  <FiLock size={20} className="text-[#6B6560]" />
                </span>
                <Input
                  placeholder="Repeat your password"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-all duration-200 bg-bg-base text-text-primary font-medium text-body-md shadow-warm/5 focus:shadow-warm"
                />
              </div>
              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>

            {/* Project Description Field */}
            <TextField
              name="description"
              value={description}
              onChange={setDescription}
              className="flex flex-col gap-1.5 pb-2"
            >
              <Label className="text-label text-text-secondary font-bold">
                Project Description
              </Label>
              <TextArea
                rows={4}
                placeholder="Tell us what you're building..."
                className="w-full px-4 py-3.5 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-all duration-200 bg-bg-base text-text-primary font-medium text-body-md resize-none shadow-warm/5 focus:shadow-warm"
              />
              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>

            {/* Submit Button */}
            <Button
              type="submit"
              isDisabled={isLoading}
              className="w-full bg-[#A63420] hover:bg-[#c84b35] text-white font-bold py-4 rounded-full border-none transition-all duration-200 shadow-soft hover:shadow-medium flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-75"
            >
              {isLoading ? "Submitting..." : "Submit Registration"}
              {!isLoading && (
                <span className="flex items-center justify-center">
                  <FiArrowRight size={14} className="text-white" />
                </span>
              )}
            </Button>
          </Form>

          {/* Footer Link */}
          <div className="flex items-center justify-center gap-1 mt-6 text-[13px] text-text-secondary">
            <span>Already a Provider? </span>
            <Link href="/login" className="text-[#A63420] hover:underline font-bold text-[17px]">
              Login
            </Link>
          </div>
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="text-body-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-1 group font-semibold"
        >
          <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1">←</span>
          Back to Explorer Feed
        </Link>
      </div>
    </div>
  );
}
