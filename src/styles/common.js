// Centralized Tailwind classes — Apple Light default, dark diagnostics variant.
// Import these in every screen instead of scattering literals.
export const pageWrapClass = "min-h-screen bg-white text-[#1d1d1f]";

export const formGroup = "space-y-2";
export const labelClass = "text-sm font-medium text-[#1d1d1f]";
export const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[#1d1d1f] " +
  "placeholder:text-gray-400 focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20";
export const errorClass = "text-sm text-red-600";

export const buttonClass =
  "rounded-full bg-[#0066cc] px-6 py-2.5 font-medium text-white transition " +
  "hover:bg-[#0052a3] disabled:opacity-50";
export const buttonGhostClass =
  "rounded-full border border-gray-200 px-6 py-2.5 font-medium text-[#1d1d1f] transition hover:bg-gray-50";

export const cardClass = "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm";
export const sectionTitleClass = "font-display text-lg font-semibold text-[#1d1d1f]";
export const badgeClass = "rounded-full bg-[#0066cc]/10 px-3 py-1 text-xs font-medium text-[#0066cc]";

// Dark diagnostics variant (#050505 bg, #ff4d67 accent) — prediction + results only.
export const darkWrapClass = "dark min-h-screen bg-[#050505] text-gray-100";
export const darkCardClass = "rounded-2xl border border-white/10 bg-white/5 p-6";
export const darkInputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-gray-100 " +
  "placeholder:text-gray-500 focus:border-[#ff4d67] focus:outline-none focus:ring-2 focus:ring-[#ff4d67]/20";
export const darkButtonClass =
  "rounded-full bg-[#ff4d67] px-6 py-2.5 font-medium text-white transition hover:bg-[#e0445f] disabled:opacity-50";
export const confidenceBarClass = "h-2 overflow-hidden rounded-full bg-white/10";
export const confidenceFillClass = "h-full rounded-full bg-[#ff4d67]";
export const contribChipClass = "rounded-full bg-[#ff4d67]/15 px-3 py-1 text-xs font-medium text-[#ff8fa3]";
