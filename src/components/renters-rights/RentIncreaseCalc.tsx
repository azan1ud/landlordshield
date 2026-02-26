"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  AlertTriangle,
  CalendarDays,
  Info,
  PoundSterling,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CalcResult {
  increaseAmount: number;
  percentageIncrease: number;
  annualIncrease: number;
  aboveMarketRate: boolean;
  noticeServeDate: Date | null;
  effectiveDate: Date | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RentIncreaseCalc() {
  const [currentRent, setCurrentRent] = useState<string>("");
  const [proposedRent, setProposedRent] = useState<string>("");
  const [marketRent, setMarketRent] = useState<string>("");
  const [desiredDate, setDesiredDate] = useState<string>("");
  const [calculated, setCalculated] = useState(false);

  const result = useMemo<CalcResult | null>(() => {
    const current = parseFloat(currentRent);
    const proposed = parseFloat(proposedRent);
    const market = parseFloat(marketRent);

    if (!current || !proposed || current <= 0 || proposed <= 0) {
      return null;
    }

    const increaseAmount = proposed - current;
    const percentageIncrease = (increaseAmount / current) * 100;
    const annualIncrease = increaseAmount * 12;
    const aboveMarketRate = !isNaN(market) && market > 0 && proposed > market;

    let noticeServeDate: Date | null = null;
    let effectiveDate: Date | null = null;

    if (desiredDate) {
      effectiveDate = new Date(desiredDate);
      // Notice must be served 2 months before desired date
      noticeServeDate = new Date(effectiveDate);
      noticeServeDate.setMonth(noticeServeDate.getMonth() - 2);
    }

    return {
      increaseAmount,
      percentageIncrease,
      annualIncrease,
      aboveMarketRate,
      noticeServeDate,
      effectiveDate,
    };
  }, [currentRent, proposedRent, marketRent, desiredDate]);

  const handleCalculate = () => {
    setCalculated(true);
  };

  const handleReset = () => {
    setCurrentRent("");
    setProposedRent("");
    setMarketRent("");
    setDesiredDate("");
    setCalculated(false);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(val);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Input form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="size-5 text-[#16A34A]" />
            Rent Increase Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Current rent */}
            <div className="space-y-2">
              <Label htmlFor="current-rent">Current Monthly Rent</Label>
              <div className="relative">
                <PoundSterling className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="current-rent"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 1200"
                  value={currentRent}
                  onChange={(e) => setCurrentRent(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Proposed rent */}
            <div className="space-y-2">
              <Label htmlFor="proposed-rent">Proposed New Rent</Label>
              <div className="relative">
                <PoundSterling className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="proposed-rent"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 1350"
                  value={proposedRent}
                  onChange={(e) => setProposedRent(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Market rent */}
            <div className="space-y-2">
              <Label htmlFor="market-rent">
                Market Rent (for comparison)
              </Label>
              <div className="relative">
                <PoundSterling className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="market-rent"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 1300"
                  value={marketRent}
                  onChange={(e) => setMarketRent(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Desired date */}
          <div className="max-w-xs space-y-2">
            <Label htmlFor="desired-date">
              Desired Increase Date
            </Label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="desired-date"
                type="date"
                value={desiredDate}
                onChange={(e) => setDesiredDate(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCalculate}
              className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white"
            >
              <Calculator className="size-4" />
              Calculate
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {calculated && result && (
        <Card className="border-t-4 border-t-[#16A34A]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-5 text-[#16A34A]" />
              Calculation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Key figures */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border bg-muted/40 p-4 text-center">
                <p className="text-xs text-muted-foreground">Increase Amount</p>
                <p
                  className={cn(
                    "mt-1 text-2xl font-bold",
                    result.increaseAmount > 0
                      ? "text-[#16A34A]"
                      : "text-muted-foreground"
                  )}
                >
                  {formatCurrency(result.increaseAmount)}
                </p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>

              <div className="rounded-lg border bg-muted/40 p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Percentage Increase
                </p>
                <p
                  className={cn(
                    "mt-1 text-2xl font-bold",
                    result.percentageIncrease > 10
                      ? "text-amber-600"
                      : result.percentageIncrease > 0
                        ? "text-[#16A34A]"
                        : "text-muted-foreground"
                  )}
                >
                  {result.percentageIncrease.toFixed(1)}%
                </p>
              </div>

              <div className="rounded-lg border bg-muted/40 p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Annual Increase
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {formatCurrency(result.annualIncrease)}
                </p>
                <p className="text-xs text-muted-foreground">per year</p>
              </div>
            </div>

            {/* Above market rate warning */}
            {result.aboveMarketRate && (
              <Alert className="border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/5">
                <AlertTriangle className="size-4 text-amber-600" />
                <AlertTitle className="text-amber-800 dark:text-amber-300">
                  Above Market Rate
                </AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-400">
                  Your proposed rent of{" "}
                  {formatCurrency(parseFloat(proposedRent))} is above the market
                  rent of {formatCurrency(parseFloat(marketRent))}. Tenants can
                  challenge rent increases at the First-tier Tribunal, and the
                  tribunal will assess what the open market rent would be.
                </AlertDescription>
              </Alert>
            )}

            {/* Section 13 notice timeline */}
            {result.noticeServeDate && result.effectiveDate && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-foreground">
                    Section 13 Notice Timeline
                  </h4>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
                    {/* Serve notice */}
                    <div className="flex-1 rounded-lg border bg-muted/40 p-3 text-center">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                        Serve Notice By
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {formatDate(result.noticeServeDate)}
                      </p>
                      {result.noticeServeDate < new Date() && (
                        <Badge
                          variant="outline"
                          className="mt-1 border-transparent bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        >
                          Past Date
                        </Badge>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className="hidden sm:flex items-center px-3">
                      <ArrowRight className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex sm:hidden items-center justify-center py-1">
                      <div className="h-4 w-0.5 bg-muted-foreground/30" />
                    </div>

                    {/* 2 months notice */}
                    <div className="flex-1 rounded-lg border border-dashed bg-muted/20 p-3 text-center">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                        Notice Period
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        2 Months Minimum
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="hidden sm:flex items-center px-3">
                      <ArrowRight className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex sm:hidden items-center justify-center py-1">
                      <div className="h-4 w-0.5 bg-muted-foreground/30" />
                    </div>

                    {/* Effective date */}
                    <div className="flex-1 rounded-lg border border-[#16A34A]/30 bg-green-50 p-3 text-center dark:bg-green-500/5">
                      <p className="text-[11px] font-medium text-[#16A34A] uppercase tracking-wide">
                        Increase Takes Effect
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {formatDate(result.effectiveDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* New rules info box */}
      <Alert className="border-[#16A34A]/30 bg-green-50 dark:border-green-500/20 dark:bg-green-500/5">
        <Info className="size-4 text-[#16A34A]" />
        <AlertTitle className="text-green-800 dark:text-green-300">
          Rent Increase Rules Under the Renters&apos; Rights Act
        </AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-400">
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed">
            <li>
              Rent can only be increased <strong>once per year</strong> via a
              Section 13 notice. Rent review clauses in tenancy agreements are
              no longer valid.
            </li>
            <li>
              Landlords must give <strong>at least 2 months&apos; notice</strong>{" "}
              of a rent increase (increased from 1 month).
            </li>
            <li>
              Tenants have the right to{" "}
              <strong>challenge the increase at the First-tier Tribunal</strong>,
              which will determine the open market rent.
            </li>
            <li>
              The tribunal can only set rent at or below the landlord&apos;s
              proposed amount &mdash; it cannot increase rent above what was
              proposed.
            </li>
            <li>
              <strong>No bidding wars:</strong> landlords and agents must
              advertise rent at a fixed price and cannot accept offers above
              the listed amount.
            </li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default RentIncreaseCalc;
