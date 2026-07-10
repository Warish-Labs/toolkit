import {
  Calculator,
  Code2,
  Type,
  Clock,
  HeartPulse,
  Percent,
  Fingerprint,
  Binary,
  Hash,
  LetterText,
  CaseSensitive,
  HelpCircle,
} from "lucide-react";
import type { ComponentType } from "react";

export const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  calculator: Calculator,
  code: Code2,
  type: Type,
  clock: Clock,
  "heart-pulse": HeartPulse,
  percent: Percent,
  fingerprint: Fingerprint,
  binary: Binary,
  hash: Hash,
  "letter-text": LetterText,
  "case-sensitive": CaseSensitive,
};

export function getIcon(name: string) {
  return iconMap[name] || HelpCircle;
}
