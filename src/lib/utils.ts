import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatPercent(n: number, digits = 1): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(digits)}%`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    typeof date === "string" ? new Date(date) : date
  );
}

export function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
