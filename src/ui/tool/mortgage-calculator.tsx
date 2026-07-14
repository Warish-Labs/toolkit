"use client";

import { useState } from "react";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { calculateMortgage, type MortgageResult } from "@/src/logic/mortgage";

export function MortgageCalculatorTool() {
  const [homePrice, setHomePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [downPaymentType, setDownPaymentType] = useState<"percent" | "amount">("percent");
  const [interestRate, setInterestRate] = useState("");
  const [termYears, setTermYears] = useState("30");
  const [propertyTax, setPropertyTax] = useState("");
  const [homeInsurance, setHomeInsurance] = useState("");
  const [hoa, setHoa] = useState("");
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const price = parseFloat(homePrice);
    const down = parseFloat(downPayment || "0");
    const rate = parseFloat(interestRate);
    const term = parseInt(termYears, 10);
    const tax = parseFloat(propertyTax || "0");
    const insurance = parseFloat(homeInsurance || "0");
    const hoaFees = parseFloat(hoa || "0");

    if (isNaN(price) || isNaN(rate) || isNaN(term)) {
      setError("Please enter valid positive numbers for Home Price, Interest Rate, and Term.");
      return;
    }

    try {
      const res = calculateMortgage({
        homePrice: price,
        downPayment: down,
        downPaymentType,
        interestRate: rate,
        termYears: term,
        propertyTax: tax,
        homeInsurance: insurance,
        hoa: hoaFees,
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="home-price">Home Price ($)</Label>
          <Input
            id="home-price"
            type="number"
            min="0"
            placeholder="e.g., 400000"
            value={homePrice}
            onChange={(e) => { setHomePrice(e.target.value); setResult(null); }}
          />
        </div>

        <div className="grid gap-2 grid-cols-3 items-end">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="down-payment">Down Payment</Label>
            <Input
              id="down-payment"
              type="number"
              min="0"
              placeholder={downPaymentType === "percent" ? "e.g., 20" : "e.g., 80000"}
              value={downPayment}
              onChange={(e) => { setDownPayment(e.target.value); setResult(null); }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="down-payment-type">Unit</Label>
            <Select value={downPaymentType} onValueChange={(val) => { setDownPaymentType(val as "percent" | "amount"); setResult(null); }}>
              <SelectTrigger id="down-payment-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">%</SelectItem>
                <SelectItem value="amount">$</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="interest">Annual Interest Rate (%)</Label>
          <Input
            id="interest"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 6.5"
            value={interestRate}
            onChange={(e) => { setInterestRate(e.target.value); setResult(null); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="term">Loan Term</Label>
          <Select value={termYears} onValueChange={(val) => { setTermYears(val); setResult(null); }}>
            <SelectTrigger id="term">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 Years</SelectItem>
              <SelectItem value="20">20 Years</SelectItem>
              <SelectItem value="15">15 Years</SelectItem>
              <SelectItem value="10">10 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t border-border/40 pt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Taxes, Insurance & Fees (Optional)</h4>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="property-tax">Annual Property Tax ($)</Label>
            <Input
              id="property-tax"
              type="number"
              min="0"
              placeholder="e.g., 3600"
              value={propertyTax}
              onChange={(e) => { setPropertyTax(e.target.value); setResult(null); }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="home-insurance">Annual Home Insurance ($)</Label>
            <Input
              id="home-insurance"
              type="number"
              min="0"
              placeholder="e.g., 1200"
              value={homeInsurance}
              onChange={(e) => { setHomeInsurance(e.target.value); setResult(null); }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hoa">Monthly HOA Fees ($)</Label>
            <Input
              id="hoa"
              type="number"
              min="0"
              placeholder="e.g., 150"
              value={hoa}
              onChange={(e) => { setHoa(e.target.value); setResult(null); }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
      >
        Calculate Mortgage
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-6">
          <div className="text-center py-2 border-b border-border/40 pb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Estimated Monthly Payment</span>
            <p className="text-4xl font-extrabold mt-1 text-foreground">${result.totalMonthlyPayment}</p>
            <p className="text-xs text-muted-foreground mt-1.5">
              Loan Amount: ${result.loanAmount} (Down Payment: ${result.downPaymentAmount})
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold tracking-tight text-foreground">Monthly Payment Breakdown:</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Principal & Interest</span>
                <span className="font-semibold">${result.monthlyPrincipalInterest}</span>
              </div>
              <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> Property Taxes</span>
                <span className="font-semibold">${result.monthlyPropertyTax}</span>
              </div>
              <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Home Insurance</span>
                <span className="font-semibold">${result.monthlyHomeInsurance}</span>
              </div>
              {result.monthlyPmi > 0 && (
                <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors text-destructive">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> PMI (Down Payment &lt; 20%)</span>
                  <span className="font-semibold">${result.monthlyPmi}</span>
                </div>
              )}
              {result.monthlyHoa > 0 && (
                <div className="flex justify-between p-2 rounded hover:bg-muted/40 transition-colors">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> HOA Fees</span>
                  <span className="font-semibold">${result.monthlyHoa}</span>
                </div>
              )}
            </div>

            {/* Visual stacked bar chart */}
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex mt-2">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(result.monthlyPrincipalInterest / result.totalMonthlyPayment) * 100}%` }} />
              <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${(result.monthlyPropertyTax / result.totalMonthlyPayment) * 100}%` }} />
              <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(result.monthlyHomeInsurance / result.totalMonthlyPayment) * 100}%` }} />
              {result.monthlyPmi > 0 && (
                <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${(result.monthlyPmi / result.totalMonthlyPayment) * 100}%` }} />
              )}
              {result.monthlyHoa > 0 && (
                <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${(result.monthlyHoa / result.totalMonthlyPayment) * 100}%` }} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
