"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId || !password) return;

    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="w-full max-w-225 flex flex-col md:flex-row bg-white border border-[rgba(223,191,185,0.3)] shadow-[0px_0px_3px_0px_rgba(31,27,24,0.02),0px_4px_20px_-2px_rgba(31,27,24,0.05)] rounded-xl overflow-hidden relative z-10">
      
      {/* Illustration Side */}
      <div className="relative flex-1 bg-[#F5DDD9] p-8 flex flex-col items-center justify-center min-h-100 md:min-h-0 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-[rgba(245,221,217,0.4)] to-[rgba(245,221,217,0)] z-10 pointer-events-none"></div>
        
        {/* Space Explorer Background */}
        <Image 
          src="/images/auth/space-explorer-bg.png"
          alt="Space Explorer"
          fill
          className="object-cover opacity-30 mix-blend-multiply z-0"
          priority
        />
        
        {/* Foreground Content */}
        <div className="relative z-20 flex flex-col items-center text-center mt-12 md:mt-24">
          <h2 className="text-[22px] font-bold text-[#58413D] leading-[26.4px] mb-3">
            Mission Control
          </h2>
          <p className="text-[13px] text-[#6B6560] leading-[20.15px] max-w-62.5">
            Securely access your provider dashboard<br />and manage your stellar journeys.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white">
        <div className="mb-8">
          <h1 className="text-[32px] font-extrabold text-[#1F1B18] leading-[35.2px] tracking-[-0.02em] mb-2">
            Welcome back
          </h1>
          <p className="text-[15px] text-[#6B6560] leading-6">
            Please enter your credentials to login.
          </p>
        </div>

        <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* User ID Field */}
          <TextField 
            isRequired 
            name="userId" 
            value={userId} 
            onChange={setUserId}
            className="flex flex-col gap-1"
          >
            <Label className="text-[12px] font-bold text-[#1F1B18] tracking-[0.04em] ml-1">
              User ID
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6B6560]/60"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <Input
                placeholder="Enter your provider ID"
                className="w-full pl-12 pr-4 py-3.5 rounded-md border border-[#8C716C] focus:border-[#A63420] focus:ring-4 focus:ring-[rgba(166,52,32,0.15)] focus:outline-none transition-all bg-white text-[#1F1B18] text-[16px] placeholder:text-[#6B6560]/60"
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
            className="flex flex-col gap-1"
          >
            <Label className="text-[12px] font-bold text-[#1F1B18] tracking-[0.04em] ml-1">
              Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6B6560]/60"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <Input
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 rounded-md border border-[#8C716C] focus:border-[#A63420] focus:ring-4 focus:ring-[rgba(166,52,32,0.15)] focus:outline-none transition-all bg-white text-[#1F1B18] text-[16px] placeholder:text-[#6B6560]/60"
              />
            </div>
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* Primary Action Button */}
          <Button
            type="submit"
            isDisabled={isLoading}
            className="w-full mt-2 bg-[#A63420] hover:bg-[#8e2b1b] text-white font-bold text-[12px] tracking-[0.04em] py-4 rounded-full flex items-center justify-center transition-colors disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? "Authenticating..." : "Login"}
          </Button>
        </Form>

        <div className="mt-8 text-center flex items-center justify-center gap-1">
          <span className="text-[13px] text-[#6B6560]">
            Don&apos;t have an account?
          </span>
          <Link href="/register-provider" className="text-[12px] font-bold text-[#A63420] tracking-[0.04em] hover:underline">
            Register as Provider
          </Link>
        </div>
      </div>
    </div>
  );
}
