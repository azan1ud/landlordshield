"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calculator, PoundSterling, AlertTriangle, CheckCircle2, Clock, Info } from "lucide-react";
import { calculateMtdStatus } from "@/lib/compliance/mtd-calculator";
import { MTD_THRESHOLDS } from "@/lib/constants/mtd-deadlines";
import type { MtdCalculatorInput, MtdCalculatorResult, MtdPhase } from "@/types";

// ---------------------------------------------------------------------------
// Phase colour helpers
// ---------------------------------------------------------------------------
function phaseColor(phase: MtdPhase) {
  switch (phase) {
    case "april_2026":
      return {
        bg: "bg-red-50 dark:bg-red-500/10",
        border: "border-red-200 dark:border-red-500/30",
        text: "text-red-700 dark:text-red-400",
        badge: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
        dot: "bg-red-500",
      };
    case "april_2027":
      return {
        bg: "bg-amber-50 dark:bg-amber-500/10",
        border: "border-amber-200 dark:border-amber-500/30",
        text: "text-amber-700 dark:text-amber-400",
        badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
        dot: "bg-amber-500",
      };
    case "april_2028":
      return {
        bg: "bg-amber-50 dark:bg-amber-500/10",
        border: "border-amber-200 dark:border-amber-500/30",
        text: "text-amber-700 dark:text-amber-400",
        badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
        dot: "bg-amber-500",
      };
    default:
      return {
        bg: "bg-green-50 dark:bg-green-500/10",
        border: "border-green-200 dark:border-green-500/30",
        text: "text-green-700 dark:text-green-400",
        badge: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
        dot: "bg-green-500",
      };
  }
}

function phaseLabel(phase: MtdPhase): string {
  switch (phase) {
    case "april_2026":
      return "April 2026";
    case "april_2027":
      return "April 2027";
    case "april_2028":
      return "April 2028";
    default:
      return "Not Required";
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ThresholdCalculator() {
  const [grossRental, setGrossRental] = useState<string>("");
  const [selfEmployment, setSelfEmployment] = useState<string>("");
  const [isJoint, setIsJoint] = useState(false);
  const [isLtd, setIsLtd] = useState(false);
  const [result, setResult] = useState<MtdCalculatorResult | null>(null);

  const handleCalculate = useCallback(() => {
    const input: MtdCalculatorInput = {
      grossRentalIncome: parseFloat(grossRental) || 0,
      selfEmploymentIncome: parseFloat(selfEmployment) || 0,
      isJointOwnership: isJoint,
      hasLimitedCompanyProperties: isLtd,
    };
    setResult(calculateMtdStatus(input));
  }, [grossRental, selfEmployment, isJoint, isLtd]);

  const colors = result ? phaseColor(result.phase) : null;

  return (
    <div className="space-y-6">
      {/* Calculator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5 text-[#2563EB]" />
            Income Details
          </CardTitle>
          <CardDescription>
            Enter your income details to determine which MTD phase applies to you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gross Rental Income */}
          <div className="space-y-2">
            <Label htmlFor="grossRental">Gross rental income (annual)</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <PoundSterling className="size-4 text-muted-foreground" />
              </div>
              <Input
                id="grossRental"
                type="number"
                min="0"
                step="100"
                placeholder="e.g. 55000"
                className="pl-9"
                value={grossRental}
                onChange={(e) => setGrossRental(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Total rent received from all properties before expenses (gross, not profit).
            </p>
          </div>

          {/* Self Employment Income */}
          <div className="space-y-2">
            <Label htmlFor="selfEmployment">Self-employment income (annual)</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <PoundSterling className="size-4 text-muted-foreground" />
              </div>
              <Input
                id="selfEmployment"
                type="number"
                min="0"
                step="100"
                placeholder="e.g. 0"
                className="pl-9"
                value={selfEmployment}
                onChange={(e) => setSelfEmployment(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Income from any self-employment. This is combined with rental income for the threshold.
            </p>
          </div>

          {/* Joint Ownership Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="joint-switch">Joint ownership</Label>
              <p className="text-xs text-muted-foreground">
                If jointly owned, rental income is split 50/50 for threshold purposes.
              </p>
            </div>
            <Switch
              id="joint-switch"
              checked={isJoint}
              onCheckedChange={setIsJoint}
            />
          </div>

          {/* Limited Company Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="ltd-switch">Properties held in a limited company</Label>
              <p className="text-xs text-muted-foreground">
                Limited company rental income is excluded from MTD for ITSA.
              </p>
            </div>
            <Switch
              id="ltd-switch"
              checked={isLtd}
              onCheckedChange={setIsLtd}
            />
          </div>

          <Button onClick={handleCalculate} className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90">
            <Calculator className="size-4" />
            Calculate My MTD Status
          </Button>
        </CardContent>
      </Card>

      {/* Result Card */}
      {result && colors && (
        <Card className={`${colors.bg} ${colors.border} border-2`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${colors.text}`}>
              {result.isAffected ? (
                <AlertTriangle className="size-5" />
              ) : (
                <CheckCircle2 className="size-5" />
              )}
              {result.isAffected ? "You Are Affected by MTD" : "Not Currently Required"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white/60 p-4 dark:bg-white/5">
                <p className="text-xs font-medium text-muted-foreground">Qualifying Income</p>
                <p className="mt-1 text-2xl font-bold text-[#1E3A5F]">
                  {"\u00A3"}{result.qualifyingIncome.toLocaleString("en-GB")}
                </p>
              </div>
              <div className="rounded-lg bg-white/60 p-4 dark:bg-white/5">
                <p className="text-xs font-medium text-muted-foreground">MTD Phase</p>
                <Badge className={`mt-1 text-sm ${colors.badge} border-0`}>
                  {phaseLabel(result.phase)}
                </Badge>
              </div>
            </div>

            {/* Message */}
            <div className={`rounded-lg border p-4 ${colors.border}`}>
              <p className={`text-sm font-medium ${colors.text}`}>{result.message}</p>
            </div>

            {/* Timeline of All Phases */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[#1E3A5F] dark:text-white">
                MTD Threshold Timeline
              </h4>
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-[15px] top-[24px] h-[calc(100%-48px)] w-0.5 bg-gray-200 dark:bg-gray-700" />

                {MTD_THRESHOLDS.map((t) => {
                  const isActive = result.phase === t.phase;
                  const tColor = phaseColor(t.phase);
                  return (
                    <div key={t.phase} className="relative flex items-start gap-4 pb-6 last:pb-0">
                      <div
                        className={`relative z-10 mt-1 size-[30px] shrink-0 rounded-full border-2 ${
                          isActive
                            ? `${tColor.dot} border-white shadow-md`
                            : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
                        } flex items-center justify-center`}
                      >
                        {isActive && (
                          <div className="size-2.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className={`flex-1 ${isActive ? "opacity-100" : "opacity-60"}`}>
                        <p className="text-sm font-semibold">{t.label}</p>
                        <p className="text-xs text-muted-foreground">
                          Threshold: {"\u00A3"}{t.threshold.toLocaleString("en-GB")} &mdash; {t.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Accordion */}
      <Card>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="help">
              <AccordionTrigger>
                <span className="flex items-center gap-2 text-sm">
                  <Info className="size-4 text-[#2563EB]" />
                  What does this mean?
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong>Making Tax Digital (MTD) for Income Tax</strong> requires landlords and
                    self-employed individuals to keep digital records and submit quarterly updates to
                    HMRC using compatible software.
                  </p>
                  <p>
                    <strong>Qualifying income</strong> is your total gross property income plus any
                    self-employment income. For jointly owned properties, only your share counts.
                  </p>
                  <p>
                    <strong>Limited companies</strong> are outside the scope of MTD for Income Tax
                    Self Assessment (ITSA). If all your properties are held through a limited company,
                    MTD for ITSA does not apply to your property income.
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="font-semibold text-foreground">Threshold Phases:</p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>
                        <strong>April 2026:</strong> Income over {"\u00A3"}50,000
                      </li>
                      <li>
                        <strong>April 2027:</strong> Income over {"\u00A3"}30,000
                      </li>
                      <li>
                        <strong>April 2028:</strong> Income over {"\u00A3"}20,000
                      </li>
                    </ul>
                  </div>
                  <div className="mt-3 flex items-start gap-2 rounded-md bg-amber-50 p-3 dark:bg-amber-500/10">
                    <Clock className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      These thresholds are based on HMRC guidance as of February 2026 and are subject
                      to change. Always verify with HMRC or a qualified tax adviser.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
