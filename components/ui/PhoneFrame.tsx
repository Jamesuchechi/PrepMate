import React from 'react';

export default function PhoneFrame({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative w-[280px] h-[580px] bg-slate-950 rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden ${className}`}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-2xl z-50"></div>
      
      {/* Content */}
      <div className="w-full h-full relative">
        {children}
      </div>

      {/* Gloss Effect */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-tr from-white/5 to-transparent opacity-50"></div>
    </div>
  );
}
