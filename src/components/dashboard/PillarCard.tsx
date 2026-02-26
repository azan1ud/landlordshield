"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComplianceStatus, Pillar } from "@/types";

// ---------------------------------------------------------------------------
// Pillar colour config
// ---------------------------------------------------------------------------

const PILLAR_CONFIG: Record<
  Pillar,
  { label: string; color: string; borderColor: string; bgColor: string; href: string }
> = {
  mtd: {
    label: "Making Tax Digital",
    color: "#2563EB",
    borderColor: "border-t-[#2563EB]",
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
    href: "/mtd",
  },
  renters_rights: {
    label: "Renters' Rights",
    color: "#16A34A",
    borderColor: "border-t-[#16A34A]",
    bgColor: "bg-green-50 dark:bg-green-500/10",
    href: "/renters-rights",
  },
  epc: {
    label: "EPC",
    color: "#F59E0B",
    borderColor: "border-t-[#F59E0B]",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    href: "/epc",
  },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface PillarCardProps {
  pillar: Pillar;
  score: number;
  status: ComplianceStatus;
  nextDeadline: Date | null;
  daysUntilDeadline: number | null;
  outstandingActions: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PillarCard({
  pillar,
  score,
  status,
  nextDeadline,
  daysUntilDeadline,
  outstandingActions,
  className,
}: PillarCardProps) {
  const config = PILLAR_CONFIG[pillar];
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <Card
      className={cn(
        "border-t-4 transition-shadow hover:shadow-md",
        config.borderColor,
        className
      )}
    >
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Colour indicator dot */}
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: config.color }}
              aria-hidden="true"
            />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {config.label}
            </CardTitle>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Large score */}
        <p
          className="text-4xl font-bold leading-none"
          style={{ color: config.color }}
        >
          {clampedScore}%
        </p>

        {/* Deadline + countdown */}
        <div className="space-y-1.5">
          {nextDeadline && (
            <p className="text-xs text-muted-foreground">
              Deadline:{" "}
              <span className="font-medium text-foreground">
                {nextDeadline.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </p>
          )}

          {nextDeadline && (
            <CountdownTimer targetDate={nextDeadline} compact showIcon />
          )}
        </div>

        {/* Outstanding actions */}
        <p className="text-xs text-muted-foreground">
          {outstandingActions === 0
            ? "All actions completed"
            : `${outstandingActions} action${outstandingActions === 1 ? "" : "s"} remaining`}
        </p>

        {/* View Details link */}
        <Link href={config.href}>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between px-0 text-xs font-medium"
            style={{ color: config.color }}
          >
            View Details
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default PillarCard;
