import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMetric(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

export function getStatusColor(status: "normal" | "alert" | "critical"): string {
  switch (status) {
    case "normal":
      return "bg-accent";
    case "alert":
      return "bg-alert";
    case "critical":
      return "bg-critical";
  }
}

export function getStatusTextColor(status: "normal" | "alert" | "critical"): string {
  switch (status) {
    case "normal":
      return "text-accent";
    case "alert":
      return "text-alert";
    case "critical":
      return "text-critical";
  }
}

export function getSeverityColor(severity: "critical" | "alert" | "info"): string {
  switch (severity) {
    case "critical":
      return "bg-critical";
    case "alert":
      return "bg-alert";
    case "info":
      return "bg-zinc-500";
  }
}
