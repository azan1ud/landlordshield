"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EPC_IMPROVEMENTS,
  EPC_RATING_BANDS,
} from "@/lib/constants/epc-improvements";
import {
  ArrowUpRight,
  Zap,
  TrendingUp,
  PoundSterling,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EpcRating } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PlannerProperty {
  id: string;
  address: string;
  epcRating: EpcRating | null;
  epcScore: number | null;
}

export interface UpgradePlannerProps {
  properties: PlannerProperty[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const COST_EFFECTIVENESS_MAP: Record<string, { label: string; color: string }> =
  {
    high: { label: "Best Value", color: "bg-green-100 text-green-700" },
    medium: { label: "Good Value", color: "bg-amber-100 text-amber-700" },
    low: { label: "Lower Value", color: "bg-red-100 text-red-700" },
  };

const COST_EFFECTIVENESS_ORDER: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function getRatingFromScore(score: number): EpcRating {
  if (score >= 92) return "A";
  if (score >= 81) return "B";
  if (score >= 69) return "C";
  if (score >= 55) return "D";
  if (score >= 39) return "E";
  if (score >= 21) return "F";
  return "G";
}

function gapToC(score: number): number {
  return Math.max(69 - score, 0);
}

const fmt = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
});

// Sort improvements: best cost-effectiveness first, then by avg points/cost ratio
const sortedImprovements = [...EPC_IMPROVEMENTS].sort((a, b) => {
  const orderDiff =
    (COST_EFFECTIVENESS_ORDER[a.costEffectiveness] ?? 1) -
    (COST_EFFECTIVENESS_ORDER[b.costEffectiveness] ?? 1);
  if (orderDiff !== 0) return orderDiff;
  const ratioA =
    ((a.pointsMin + a.pointsMax) / 2) / ((a.costMin + a.costMax) / 2);
  const ratioB =
    ((b.pointsMin + b.pointsMax) / 2) / ((b.costMin + b.costMax) / 2);
  return ratioB - ratioA;
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UpgradePlanner({
  properties,
  className,
}: UpgradePlannerProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [budget, setBudget] = useState<string>("");

  const property = properties.find((p) => p.id === selectedPropertyId);
  const currentScore = property?.epcScore ?? 0;
  const currentRating = property?.epcRating ?? null;

  const toggleImprovement = useCallback((type: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  // Calculate running totals
  const totals = useMemo(() => {
    let costMin = 0;
    let costMax = 0;
    let pointsMin = 0;
    let pointsMax = 0;

    for (const imp of EPC_IMPROVEMENTS) {
      if (selectedTypes.has(imp.type)) {
        costMin += imp.costMin;
        costMax += imp.costMax;
        pointsMin += imp.pointsMin;
        pointsMax += imp.pointsMax;
      }
    }

    const projectedScoreMin = Math.min(currentScore + pointsMin, 100);
    const projectedScoreMax = Math.min(currentScore + pointsMax, 100);
    const projectedRatingMin = getRatingFromScore(projectedScoreMin);
    const projectedRatingMax = getRatingFromScore(projectedScoreMax);

    return {
      costMin,
      costMax,
      pointsMin,
      pointsMax,
      projectedScoreMin,
      projectedScoreMax,
      projectedRatingMin,
      projectedRatingMax,
    };
  }, [selectedTypes, currentScore]);

  // Budget filter
  const budgetNum = parseFloat(budget) || 0;
  const budgetImprovements = useMemo(() => {
    if (budgetNum <= 0) return null;
    const fits: typeof sortedImprovements = [];
    let remaining = budgetNum;
    for (const imp of sortedImprovements) {
      const avgCost = (imp.costMin + imp.costMax) / 2;
      if (avgCost <= remaining) {
        fits.push(imp);
        remaining -= avgCost;
      }
    }
    return fits;
  }, [budgetNum]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* ---- Property selector ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="size-5 text-[#1E3A5F]" />
            Select Property
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedPropertyId}
            onValueChange={(v) => {
              setSelectedPropertyId(v);
              setSelectedTypes(new Set());
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a property..." />
            </SelectTrigger>
            <SelectContent>
              {properties.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ---- Current rating summary (when property selected) ---- */}
      {property && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current EPC Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Current Rating</p>
                {currentRating ? (
                  <span
                    className="mt-1 inline-block rounded px-3 py-1 text-lg font-bold text-white"
                    style={{
                      backgroundColor:
                        EPC_RATING_BANDS[currentRating]?.color ?? "#999",
                    }}
                  >
                    {currentRating}
                  </span>
                ) : (
                  <span className="mt-1 inline-block text-lg font-bold text-muted-foreground">
                    --
                  </span>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Current Score</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {currentScore}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Gap to Band C</p>
                <p
                  className={cn(
                    "mt-1 text-2xl font-bold",
                    gapToC(currentScore) === 0
                      ? "text-green-600"
                      : "text-red-500"
                  )}
                >
                  {gapToC(currentScore) === 0
                    ? "Compliant"
                    : `+${gapToC(currentScore)} pts`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ---- Improvements list ---- */}
      {property && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-5 text-[#F59E0B]" />
              Recommended Improvements
            </CardTitle>
            <CardDescription>
              Sorted by cost-effectiveness. Select improvements to calculate
              projected upgrade.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedImprovements.map((imp) => {
              const isSelected = selectedTypes.has(imp.type);
              const ce =
                COST_EFFECTIVENESS_MAP[imp.costEffectiveness] ??
                COST_EFFECTIVENESS_MAP.medium;
              const inBudget =
                budgetImprovements === null ||
                budgetImprovements.some((b) => b.type === imp.type);

              return (
                <div
                  key={imp.type}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                    isSelected
                      ? "border-[#F59E0B]/50 bg-amber-50/50 dark:bg-amber-500/5"
                      : "border-border",
                    budgetImprovements !== null &&
                      !inBudget &&
                      "opacity-50"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleImprovement(imp.type)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">
                        {imp.label}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-[11px]", ce.color)}
                      >
                        {ce.label}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {imp.description}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        <PoundSterling className="mr-0.5 inline size-3" />
                        {fmt.format(imp.costMin)} - {fmt.format(imp.costMax)}
                      </span>
                      <span>
                        <ArrowUpRight className="mr-0.5 inline size-3" />
                        +{imp.pointsMin} - {imp.pointsMax} pts
                      </span>
                      <span>{imp.typicalTimeline}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ---- Running total / projection ---- */}
      {property && selectedTypes.size > 0 && (
        <Card className="border-[#F59E0B]/30 bg-amber-50/30 dark:bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="size-5 text-[#F59E0B]" />
              Upgrade Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Estimated Cost
                </p>
                <p className="text-lg font-bold text-foreground">
                  {fmt.format(totals.costMin)} - {fmt.format(totals.costMax)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Points Gain</p>
                <p className="text-lg font-bold text-green-600">
                  +{totals.pointsMin} - {totals.pointsMax}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Projected Score
                </p>
                <p className="text-lg font-bold text-foreground">
                  {totals.projectedScoreMin} - {totals.projectedScoreMax}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Projected Rating
                </p>
                <div className="mt-1 flex justify-center gap-1">
                  {totals.projectedRatingMin === totals.projectedRatingMax ? (
                    <span
                      className="inline-block rounded px-3 py-0.5 font-bold text-white"
                      style={{
                        backgroundColor:
                          EPC_RATING_BANDS[totals.projectedRatingMin]?.color ??
                          "#999",
                      }}
                    >
                      {totals.projectedRatingMin}
                    </span>
                  ) : (
                    <>
                      <span
                        className="inline-block rounded px-2 py-0.5 text-sm font-bold text-white"
                        style={{
                          backgroundColor:
                            EPC_RATING_BANDS[totals.projectedRatingMin]
                              ?.color ?? "#999",
                        }}
                      >
                        {totals.projectedRatingMin}
                      </span>
                      <span className="text-muted-foreground">to</span>
                      <span
                        className="inline-block rounded px-2 py-0.5 text-sm font-bold text-white"
                        style={{
                          backgroundColor:
                            EPC_RATING_BANDS[totals.projectedRatingMax]
                              ?.color ?? "#999",
                        }}
                      >
                        {totals.projectedRatingMax}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Score progress bar */}
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current: {currentScore}</span>
                <span>
                  Projected: {totals.projectedScoreMin}-
                  {totals.projectedScoreMax}
                </span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-muted/40">
                {/* Current score bar */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gray-300 dark:bg-gray-600"
                  style={{ width: `${currentScore}%` }}
                />
                {/* Projected gain */}
                <div
                  className="absolute inset-y-0 rounded-full bg-[#F59E0B]/70"
                  style={{
                    left: `${currentScore}%`,
                    width: `${totals.projectedScoreMax - currentScore}%`,
                  }}
                />
                {/* Band C threshold line */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-green-600"
                  style={{ left: "69%" }}
                />
              </div>
              <p className="text-center text-[11px] text-muted-foreground">
                Green line = Band C threshold (69)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ---- Budget filter ---- */}
      {property && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PoundSterling className="size-5 text-[#1E3A5F]" />
              Budget Filter
            </CardTitle>
            <CardDescription>
              Enter your budget to see which improvements fit.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="budget" className="shrink-0">
                Budget
              </Label>
              <div className="relative max-w-xs flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  &pound;
                </span>
                <Input
                  id="budget"
                  type="number"
                  min={0}
                  step={100}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="pl-7"
                  placeholder="e.g. 5000"
                />
              </div>
            </div>
            {budgetImprovements !== null && (
              <p className="text-sm text-muted-foreground">
                {budgetImprovements.length === 0
                  ? "No improvements fit within this budget."
                  : `${budgetImprovements.length} improvement${
                      budgetImprovements.length === 1 ? "" : "s"
                    } fit within ${fmt.format(budgetNum)} (highlighted above).`}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default UpgradePlanner;
