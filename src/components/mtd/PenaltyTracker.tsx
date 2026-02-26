"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ShieldAlert, Info } from "lucide-react";
import { MTD_PENALTY_POINTS } from "@/lib/constants/mtd-deadlines";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface PenaltyTrackerProps {
  currentPoints: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function PenaltyTracker({ currentPoints }: PenaltyTrackerProps) {
  const { maxPoints, warningAt, fineAtThreshold } = MTD_PENALTY_POINTS;
  const isWarning = currentPoints >= warningAt;
  const isAtMax = currentPoints >= maxPoints;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="size-5 text-[#2563EB]" />
          Penalty Points Tracker
        </CardTitle>
        <CardDescription>
          HMRC assigns penalty points for late quarterly submissions. Reaching {maxPoints} points
          triggers a {"\u00A3"}{fineAtThreshold} fine.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Points Gauge */}
        <div className="flex items-center justify-center">
          <div className="flex gap-3">
            {Array.from({ length: maxPoints }, (_, i) => {
              const pointNum = i + 1;
              const isFilled = pointNum <= currentPoints;
              const isWarnPoint = pointNum >= warningAt;
              return (
                <div key={pointNum} className="flex flex-col items-center gap-2">
                  <div
                    className={`flex size-14 items-center justify-center rounded-full border-2 text-lg font-bold transition-colors ${
                      isFilled
                        ? isWarnPoint
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-amber-500 bg-amber-500 text-white"
                        : "border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-600"
                    }`}
                  >
                    {pointNum}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isFilled
                        ? isWarnPoint
                          ? "text-red-600 dark:text-red-400"
                          : "text-amber-600 dark:text-amber-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {pointNum === warningAt ? "Warning" : pointNum === maxPoints ? "Fine" : `Pt ${pointNum}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Status */}
        <div className="rounded-lg border p-4 text-center">
          <p className="text-sm text-muted-foreground">Current Points</p>
          <p
            className={`mt-1 text-3xl font-bold ${
              isAtMax
                ? "text-red-600 dark:text-red-400"
                : isWarning
                ? "text-amber-600 dark:text-amber-400"
                : "text-[#1E3A5F] dark:text-white"
            }`}
          >
            {currentPoints} / {maxPoints}
          </p>
          {isAtMax && (
            <p className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
              {"\u00A3"}{fineAtThreshold} penalty triggered
            </p>
          )}
        </div>

        {/* Warning Alert */}
        {isWarning && !isAtMax && (
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10">
            <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-700 dark:text-amber-400">
              Warning: {maxPoints - currentPoints} point{maxPoints - currentPoints !== 1 ? "s" : ""} from a fine
            </AlertTitle>
            <AlertDescription className="text-amber-600 dark:text-amber-400/80">
              You currently have {currentPoints} penalty points. One more late submission will
              trigger a {"\u00A3"}{fineAtThreshold} fine. Ensure all future quarterly submissions are
              submitted on time.
            </AlertDescription>
          </Alert>
        )}

        {isAtMax && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10">
            <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
            <AlertTitle className="text-red-700 dark:text-red-400">
              Penalty Threshold Reached
            </AlertTitle>
            <AlertDescription className="text-red-600 dark:text-red-400/80">
              You have reached {maxPoints} penalty points. A {"\u00A3"}{fineAtThreshold} fine applies.
              Additional late payments may incur further charges at 3% after 15 days, a further 3%
              after 30 days, and 10% per annum thereafter.
            </AlertDescription>
          </Alert>
        )}

        {/* Info box */}
        <div className="flex items-start gap-3 rounded-lg border p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-[#2563EB]" />
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              Points can be reset to zero if you meet all submission deadlines for a continuous
              24-month period (known as the &ldquo;period of compliance&rdquo;).
            </p>
            <p>
              Late payment penalties are separate from late submission penalty points. Late payments
              incur charges starting at 3% of the outstanding amount after 15 days.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
