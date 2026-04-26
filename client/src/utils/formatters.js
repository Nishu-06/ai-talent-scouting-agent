export function scoreTone(score) {
  if (score >= 85) return "text-emerald-300";
  if (score >= 70) return "text-sky-300";
  if (score >= 55) return "text-amber-300";
  return "text-rose-300";
}

export function badgeTone(tag) {
  if (tag === "Perfect Fit") return "bg-emerald-400/15 text-emerald-200 ring-emerald-300/30";
  if (tag === "High Match, Low Interest") return "bg-amber-400/15 text-amber-100 ring-amber-300/30";
  if (tag === "Warm Prospect") return "bg-sky-400/15 text-sky-100 ring-sky-300/30";
  if (tag === "Strong Match") return "bg-cyan-400/15 text-cyan-100 ring-cyan-300/30";
  if (tag === "Promising Match") return "bg-indigo-400/15 text-indigo-100 ring-indigo-300/30";
  return "bg-white/10 text-slate-100 ring-white/10";
}
