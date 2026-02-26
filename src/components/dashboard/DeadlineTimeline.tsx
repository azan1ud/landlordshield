"use client";

import React, { useMemo } from "react";
import { differenceInDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllDeadlines } from "@/lib/compliance/deadline-engine";
import type { Deadline } from "@/types";

// ---------------------------------------------------------------------------
// Pillar colour map
// ---------------------------------------------------------------------------

const PILLAR_DOT_COLORS: Record<string, string> = {
  mtd: "bg-[#2563EB]",           // blue
  renters_rights: "bg-[#16A34A]", // green
  epc: "bg-[#F59E0B]",           // orange
  certificate: "bg-purple-500",
  custom: "bg-gray-400",
};

const PILLAR_BADGE_COLORS: Record<string, string> = {
  mtd: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  renters_rights:
    "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  epc: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  certificate:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  custom: "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
};

function pillarLabel(pillar: string): string {
  switch (pillar) {
    case "mtd":
      return "MTD";
    case "renters_rights":
      return "Renters' Rights";
    case "epc":
      return "EPC";
    case "certificate":
      return "Certificate";
    default:
      return "Custom";
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface DeadlineTimelineProps {
  /** Override the default deadlines (e.g. pass pre-fetched data) */
  deadlines?: Deadline[];
  /** Maximum items to display */
  limit?: number;
  /** Additional Tailwind classes */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DeadlineTimeline({
  deadlines: externalDeadlines,
  limit = 8,
  className,
}: DeadlineTimelineProps) {
  const items = useMemo(() => {
    const all = externalDeadlines ?? getAllDeadlines();
    const now = new Date();
    // Show overdue + upcoming, sorted by date
    return all.slice(0, limit);
  }, [externalDeadlines, limit]);

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 text-muted-foreground" />
          <CardTitle>Upcoming Deadlines</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

          <ul className="space-y-5">
            {items.map((item) => {
              const now = new Date();
              const isOverdue = item.date < now;
              const daysRemaining = differenceInDays(item.date, now);
              const dotColor = isOverdue
                ? "bg-[#DC2626]"
                : PILLAR_DOT_COLORS[item.pillar] ?? "bg-gray-400";

              return (
                <li key={item.id} className="relative pl-7">
                  {/* Dot */}
                  <span
                    className={cn(
                      "absolute left-0 top-1 size-[14px] rounded-full border-2 border-background",
                      dotColor
                    )}
                    aria-hidden="true"
                  />

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium leading-tight">
                          {item.title}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "border-transparent text-[10px] px-1.5 py-0",
                            PILLAR_BADGE_COLORS[item.pillar]
                          )}
                        >
                          {pillarLabel(item.pillar)}
                        </Badge>
                        {item.isCritical && (
                          <Badge
                            variant="destructive"
                            className="text-[10px] px-1.5 py-0"
                          >
                            Critical
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Date + countdown */}
                    <div className="mt-1 flex shrink-0 flex-col items-start sm:mt-0 sm:items-end">
                      <span className="text-xs font-medium text-foreground">
                        {item.date.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          isOverdue
                            ? "text-red-600 dark:text-red-400"
                            : daysRemaining < 30
                              ? "text-red-600 dark:text-red-400"
                              : daysRemaining < 90
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-green-600 dark:text-green-400"
                        )}
                      >
                        {isOverdue
                          ? "OVERDUE"
                          : daysRemaining === 0
                            ? "Today"
                            : daysRemaining === 1
                              ? "1 day left"
                              : `${daysRemaining} days left`}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default DeadlineTimeline;
