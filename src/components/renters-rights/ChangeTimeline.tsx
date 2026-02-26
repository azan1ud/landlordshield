"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RENTERS_RIGHTS_PHASES } from "@/lib/constants/renters-rights-timeline";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowUp,
  Minus,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Impact badge config
// ---------------------------------------------------------------------------

const IMPACT_CONFIG: Record<
  string,
  { label: string; className: string; icon: React.ElementType }
> = {
  critical: {
    label: "Critical",
    className:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    icon: AlertTriangle,
  },
  high: {
    label: "High",
    className:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
    icon: ArrowUp,
  },
  medium: {
    label: "Medium",
    className:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    icon: Minus,
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChangeTimeline() {
  const [expandedPhase, setExpandedPhase] = useState<number>(1);

  const togglePhase = (phase: number) => {
    setExpandedPhase((prev) => (prev === phase ? -1 : phase));
  };

  return (
    <div className="relative space-y-0">
      {RENTERS_RIGHTS_PHASES.map((phase, phaseIndex) => {
        const isExpanded = expandedPhase === phase.phase;
        const isLast = phaseIndex === RENTERS_RIGHTS_PHASES.length - 1;
        const phaseDate = new Date(phase.date);
        const isPast = phaseDate < new Date();
        const isUpcoming =
          !isPast &&
          phaseDate.getTime() - Date.now() < 120 * 24 * 60 * 60 * 1000;

        return (
          <div key={phase.phase} className="relative flex gap-4">
            {/* Vertical timeline line + dot */}
            <div className="flex flex-col items-center">
              {/* Dot */}
              <div
                className={cn(
                  "z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 font-bold text-sm",
                  isPast
                    ? "border-[#16A34A] bg-[#16A34A] text-white"
                    : isUpcoming
                      ? "border-[#16A34A] bg-green-50 text-[#16A34A] dark:bg-green-500/10"
                      : "border-muted-foreground/30 bg-muted text-muted-foreground"
                )}
              >
                {phase.phase}
              </div>
              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-4",
                    isPast
                      ? "bg-[#16A34A]"
                      : "bg-muted-foreground/20"
                  )}
                />
              )}
            </div>

            {/* Phase content */}
            <div className={cn("flex-1 pb-8", isLast && "pb-0")}>
              {/* Phase header -- clickable */}
              <button
                type="button"
                onClick={() => togglePhase(phase.phase)}
                className="flex w-full items-center justify-between text-left group"
              >
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {phase.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {phaseDate.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {isPast && (
                      <Badge
                        variant="outline"
                        className="ml-2 border-transparent bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                      >
                        In Effect
                      </Badge>
                    )}
                    {isUpcoming && !isPast && (
                      <Badge
                        variant="outline"
                        className="ml-2 border-transparent bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                      >
                        Upcoming
                      </Badge>
                    )}
                  </p>
                </div>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {isExpanded ? (
                    <ChevronUp className="size-5" />
                  ) : (
                    <ChevronDown className="size-5" />
                  )}
                </span>
              </button>

              {/* Expanded changes list */}
              {isExpanded && (
                <div className="mt-3 space-y-3">
                  {phase.changes.map((change, changeIndex) => {
                    const impact = IMPACT_CONFIG[change.impact];
                    const ImpactIcon = impact?.icon;

                    return (
                      <Card
                        key={changeIndex}
                        className="border-l-4 py-4"
                        style={{
                          borderLeftColor:
                            change.impact === "critical"
                              ? "#DC2626"
                              : change.impact === "high"
                                ? "#F97316"
                                : "#3B82F6",
                        }}
                      >
                        <CardContent className="px-4 py-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">
                                {change.title}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                {change.description}
                              </p>
                            </div>
                            {impact && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "shrink-0 gap-1",
                                  impact.className
                                )}
                              >
                                {ImpactIcon && (
                                  <ImpactIcon className="size-3" />
                                )}
                                {impact.label}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChangeTimeline;
