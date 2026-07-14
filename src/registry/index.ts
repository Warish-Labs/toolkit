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

// --- Date & Time (Batch 2) ---
import { TimeDurationCalculatorTool } from "@/src/ui/tool/time-duration-calculator";
import { DateDifferenceCalculatorTool } from "@/src/ui/tool/date-difference-calculator";
import { WorkingDaysCalculatorTool } from "@/src/ui/tool/working-days-calculator";
import { CountdownCalculatorTool } from "@/src/ui/tool/countdown-calculator";
import { DateCalculatorTool } from "@/src/ui/tool/date-calculator";
import { StopwatchTool } from "@/src/ui/tool/stopwatch";
import { TimerTool } from "@/src/ui/tool/timer";
import { CalendarGeneratorTool } from "@/src/ui/tool/calendar-generator";
import { LeapYearCheckerTool } from "@/src/ui/tool/leap-year-checker";
import { AgeDifferenceTool } from "@/src/ui/tool/age-difference";
import { BusinessDaysCalculatorTool } from "@/src/ui/tool/business-days-calculator";
import { TimeZoneConverterTool } from "@/src/ui/tool/time-zone-converter";
import { WeekNumberCalculatorTool } from "@/src/ui/tool/week-number-calculator";

// --- Developer Tools (Batch 3) ---
import { JsonValidatorTool } from "@/src/ui/tool/json-validator";
import { JsonMinifierTool } from "@/src/ui/tool/json-minifier";
import { JsonYamlConverterTool } from "@/src/ui/tool/json-to-yaml-converter";
import { XmlFormatterTool } from "@/src/ui/tool/xml-formatter";
import { HtmlFormatterMinifierTool } from "@/src/ui/tool/html-formatter-minifier";
import { CssFormatterMinifierTool } from "@/src/ui/tool/css-formatter-minifier";
import { SqlFormatterTool } from "@/src/ui/tool/sql-formatter";
import { UrlEncoderDecoderTool } from "@/src/ui/tool/url-encoder-decoder";
import { JwtDecoderTool } from "@/src/ui/tool/jwt-decoder";

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

  // --- Date & Time ---
  "time-duration-calculator": TimeDurationCalculatorTool,
  "date-difference-calculator": DateDifferenceCalculatorTool,
  "working-days-calculator": WorkingDaysCalculatorTool,
  "countdown-calculator": CountdownCalculatorTool,
  "date-calculator": DateCalculatorTool,
  "stopwatch": StopwatchTool,
  "timer": TimerTool,
  "calendar-generator": CalendarGeneratorTool,
  "leap-year-checker": LeapYearCheckerTool,
  "age-difference-calculator": AgeDifferenceTool,
  "business-days-calculator": BusinessDaysCalculatorTool,
  "time-zone-converter": TimeZoneConverterTool,
  "week-number-calculator": WeekNumberCalculatorTool,

  // --- Developer Tools ---
  "json-validator": JsonValidatorTool,
  "json-minifier": JsonMinifierTool,
  "json-viewer": JsonValidatorTool, // uses JSON validator's viewer capabilities
  "json-to-yaml": JsonYamlConverterTool,
  "yaml-to-json": JsonYamlConverterTool,
  "xml-formatter": XmlFormatterTool,
  "xml-validator": XmlFormatterTool,
  "html-formatter": HtmlFormatterMinifierTool,
  "html-minifier": HtmlFormatterMinifierTool,
  "css-beautifier": CssFormatterMinifierTool,
  "css-minifier": CssFormatterMinifierTool,
  "sql-formatter": SqlFormatterTool,
  "sql-minifier": SqlFormatterTool,
  "url-encoder-decoder": UrlEncoderDecoderTool,
  "jwt-decoder": JwtDecoderTool,
};

export function getToolComponent(slug: string): ComponentType | null {
  return toolRegistry[slug] || null;
}
