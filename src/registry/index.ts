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

// --- New Calculators ---
import { PercentageIncreaseDecreaseTool } from "@/src/ui/tool/percentage-increase-decrease";
import { BmrCalculatorTool } from "@/src/ui/tool/bmr-calculator";
import { CalorieCalculatorTool } from "@/src/ui/tool/calorie-calculator";
import { EmiCalculatorTool } from "@/src/ui/tool/emi-calculator";
import { LoanCalculatorTool } from "@/src/ui/tool/loan-calculator";
import { MortgageCalculatorTool } from "@/src/ui/tool/mortgage-calculator";
import { CompoundInterestCalculatorTool } from "@/src/ui/tool/compound-interest-calculator";
import { SimpleInterestCalculatorTool } from "@/src/ui/tool/simple-interest-calculator";
import { GstCalculatorTool } from "@/src/ui/tool/gst-calculator";
import { VatCalculatorTool } from "@/src/ui/tool/vat-calculator";
import { DiscountCalculatorTool } from "@/src/ui/tool/discount-calculator";
import { ProfitMarginCalculatorTool } from "@/src/ui/tool/profit-margin-calculator";
import { SalesTaxCalculatorTool } from "@/src/ui/tool/sales-tax-calculator";
import { TipCalculatorTool } from "@/src/ui/tool/tip-calculator";
import { SalaryCalculatorTool } from "@/src/ui/tool/salary-calculator";
import { HourlyWageCalculatorTool } from "@/src/ui/tool/hourly-wage-calculator";
import { InflationCalculatorTool } from "@/src/ui/tool/inflation-calculator";
import { InvestmentCalculatorTool } from "@/src/ui/tool/investment-calculator";
import { SipCalculatorTool } from "@/src/ui/tool/sip-calculator";
import { FdCalculatorTool } from "@/src/ui/tool/fd-calculator";
import { RdCalculatorTool } from "@/src/ui/tool/rd-calculator";
import { BreakEvenCalculatorTool } from "@/src/ui/tool/break-even-calculator";
import { RoiCalculatorTool } from "@/src/ui/tool/roi-calculator";
import { CagrCalculatorTool } from "@/src/ui/tool/cagr-calculator";
import { CagrReverseCalculatorTool } from "@/src/ui/tool/cagr-reverse-calculator";
import { CurrencySplitCalculatorTool } from "@/src/ui/tool/currency-split-calculator";

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
  
  // --- New Calculators ---
  "percentage-increase-decrease-calculator": PercentageIncreaseDecreaseTool,
  "bmr-calculator": BmrCalculatorTool,
  "calorie-calculator": CalorieCalculatorTool,
  "emi-calculator": EmiCalculatorTool,
  "loan-calculator": LoanCalculatorTool,
  "mortgage-calculator": MortgageCalculatorTool,
  "compound-interest-calculator": CompoundInterestCalculatorTool,
  "simple-interest-calculator": SimpleInterestCalculatorTool,
  "gst-calculator": GstCalculatorTool,
  "vat-calculator": VatCalculatorTool,
  "discount-calculator": DiscountCalculatorTool,
  "profit-margin-calculator": ProfitMarginCalculatorTool,
  "sales-tax-calculator": SalesTaxCalculatorTool,
  "tip-calculator": TipCalculatorTool,
  "salary-calculator": SalaryCalculatorTool,
  "hourly-wage-calculator": HourlyWageCalculatorTool,
  "inflation-calculator": InflationCalculatorTool,
  "investment-calculator": InvestmentCalculatorTool,
  "sip-calculator": SipCalculatorTool,
  "fd-calculator": FdCalculatorTool,
  "rd-calculator": RdCalculatorTool,
  "break-even-calculator": BreakEvenCalculatorTool,
  "roi-calculator": RoiCalculatorTool,
  "cagr-calculator": CagrCalculatorTool,
  "cagr-reverse-calculator": CagrReverseCalculatorTool,
  "currency-split-calculator": CurrencySplitCalculatorTool,
};

export function getToolComponent(slug: string): ComponentType | null {
  return toolRegistry[slug] || null;
}
