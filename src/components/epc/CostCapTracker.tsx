"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PoundSterling } from "lucide-react";
import { cn } from "@/lib/utils";
import { EPC_KEY_DATES } from "@/lib/constants/epc-improvements";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CostCapTrackerProps {
  spent: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CostCapTracker({ spent, className }: CostCapTrackerProps) {
  const cap = EPC_KEY_DATES.spendingCap;
  const percentage = Math.min(Math.round((spent / cap) * 100), 100);
  const remaining = Math.max(cap - spent, 0);

  const capStartDate = new Date(EPC_KEY_DATES.spendingCapStart);
  const formattedStart = capStartDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <PoundSterling className="size-5 text-[#F59E0B]" />
          Cost Cap Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-foreground">
            {new Intl.NumberFormat("en-GB", {
              style: "currency",
              currency: "GBP",
              minimumFractionDigits: 0,
            }).format(spent)}
          </span>
          <span className="text-sm text-muted-foreground">
            of{" "}
            {new Intl.NumberFormat("en-GB", {
              style: "currency",
              currency: "GBP",
              minimumFractionDigits: 0,
            }).format(cap)}
          </span>
        </div>

        <Progress value={percentage} className="h-3" />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{percentage}% used</span>
          <span>
            {new Intl.NumberFormat("en-GB", {
              style: "currency",
              currency: "GBP",
              minimumFractionDigits: 0,
            }).format(remaining)}{" "}
            remaining
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          Spending cap applies from {formattedStart}. Maximum spend per property
          for qualifying improvements before you may apply for a cost cap
          exemption.
        </p>
      </CardContent>
    </Card>
  );
}

export default CostCapTracker;
