"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ComplianceScoreCardProps {
  /** Compliance score from 0 to 100 */
  score: number;
  /** Additional Tailwind classes */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getScoreColor(score: number): string {
  if (score >= 80) return "#16A34A"; // green
  if (score >= 40) return "#F59E0B"; // amber
  return "#DC2626"; // red
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 40) return "Needs Work";
  return "At Risk";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ComplianceScoreCard({
  score,
  className,
}: ComplianceScoreCardProps) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const clampedScore = Math.max(0, Math.min(100, score));

  // SVG circular progress ring
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  return (
    <Card className={cn("flex items-center justify-center", className)}>
      <CardContent className="flex flex-col items-center gap-3 py-2">
        {/* Circular progress ring */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            className="-rotate-90"
            aria-hidden="true"
          >
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/40"
            />
            {/* Progress arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-4xl font-bold leading-none"
              style={{ color }}
            >
              {clampedScore}%
            </span>
            <span
              className="mt-1 text-xs font-medium"
              style={{ color }}
            >
              {label}
            </span>
          </div>
        </div>

        {/* Label */}
        <p className="text-sm font-medium text-muted-foreground">
          Overall Compliance
        </p>
      </CardContent>
    </Card>
  );
}

export default ComplianceScoreCard;
