import { ComponentType } from "react";
import { AgeCalculatorTool } from "@/src/ui/tool/age-calculator";
import { BmiCalculatorTool } from "@/src/ui/tool/bmi-calculator";
import { PercentageCalculatorTool } from "@/src/ui/tool/percentage-calculator";
import { JsonFormatterTool } from "@/src/ui/tool/json-formatter";
import { UuidGeneratorTool } from "@/src/ui/tool/uuid-generator";
import { Base64EncoderDecoderTool } from "@/src/ui/tool/base64-encoder-decoder";
import { HashGeneratorTool } from "@/src/ui/tool/hash-generator";
import { WordCharacterCounterTool } from "@/src/ui/tool/word-character-counter";
import { CaseConverterTool } from "@/src/ui/tool/case-converter";

export const toolRegistry: Record<string, ComponentType> = {
  "age-calculator": AgeCalculatorTool,
  "bmi-calculator": BmiCalculatorTool,
  "percentage-calculator": PercentageCalculatorTool,
  "json-formatter": JsonFormatterTool,
  "uuid-generator": UuidGeneratorTool,
  "base64-encoder-decoder": Base64EncoderDecoderTool,
  "hash-generator": HashGeneratorTool,
  "word-character-counter": WordCharacterCounterTool,
  "case-converter": CaseConverterTool,
};

export function getToolComponent(slug: string): ComponentType | null {
  return toolRegistry[slug] || null;
}
