import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12 relative overflow-hidden">
      {/* Decorative bouncy bubbles */}
      <div className="absolute w-128 h-128 rounded-full bg-[#FBE3DF] -top-25 -left-16 blur-[100px] opacity-60 pointer-events-none"></div>
      <div className="absolute w-160 h-160 rounded-full bg-[#FFF0EE] top-134.5 left-192 blur-[120px] opacity-70 pointer-events-none"></div>

      <div className="w-full z-10 flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
