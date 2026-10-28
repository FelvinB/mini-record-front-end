import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/card";

const accents = {
  indigo: "from-indigo-500 to-violet-500 shadow-indigo-500/30",
  emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/30",
  amber: "from-amber-500 to-orange-500 shadow-amber-500/30",
  sky: "from-sky-500 to-cyan-500 shadow-sky-500/30",
  rose: "from-rose-500 to-pink-500 shadow-rose-500/30",
} as const;

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: keyof typeof accents;
  hint?: string;
}

export function StatCard({
  label,
  value,
  icon,
  accent = "indigo",
  hint,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          accent === "indigo" && "from-indigo-500 to-violet-500",
          accent === "emerald" && "from-emerald-500 to-teal-500",
          accent === "amber" && "from-amber-500 to-orange-500",
          accent === "sky" && "from-sky-500 to-cyan-500",
          accent === "rose" && "from-rose-500 to-pink-500",
        )}
      />
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
            accents[accent],
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
      {hint ? <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </Card>
  );
}