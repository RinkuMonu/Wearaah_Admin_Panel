export const BASE_URL = "http://localhost:5000/api";

export const STEPS = [
  { id: 1, label: "Verification", icon: "🛡️" },
  { id: 2, label: "Basic Info", icon: "📋" },
  { id: 3, label: "Location", icon: "📍" },
  { id: 4, label: "Bank", icon: "🏦" },
  { id: 5, label: "Documents", icon: "📄" },
];

export const inputClass =
  "w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#f0ede8] placeholder-[#444] focus:outline-none focus:border-[#e8c547] transition-colors text-sm font-mono";

export const labelClass =
  "block text-[#888] text-xs font-semibold uppercase tracking-widest mb-2";

export const errorClass = "text-red-400 text-xs mt-1 font-mono";