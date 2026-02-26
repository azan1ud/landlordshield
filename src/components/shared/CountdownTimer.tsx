"use client";

import React, { useMemo } from "react";
import { differenceInDays, differenceInHours, isPast, parseISO } from "date-fns";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CountdownTimerProps {
  /** Target date -- accepts a Date object or an ISO 8601 string */
  targetDate: Date | string;
  /** Optional label displayed before the countdown text */
  label?: string;
  /** When true, a compact single-line layout is used */
  compact?: boolean;
  /** Show an icon alongside the text */
  showIcon?: boolean;
  /** Additional Tailwind classes for the wrapper */
  className?: string;
}

// ---------------------------------------------------------------------------
// Urgency colour thresholds
// ---------------------------------------------------------------------------

function getUrgencyClasses(daysLeft: number, isOverdue: boolean) {
  if (isOverdue) {
    return {
      text: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-500/10",
      border: "border-red-200 dark:border-red-500/20",
      icon: "text-red-500",
    };
  }
  if (daysLeft < 30) {
    return {
      text: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-500/10",
      border: "border-red-200 dark:border-red-500/20",
      icon: "text-red-500",
    };
  }
  if (daysLeft < 90) {
    return {
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-200 dark:border-amber-500/20",
      icon: "text-amber-500",
    };
  }
  return {
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-500/10",
    border: "border-green-200 dark:border-green-500/20",
    icon: "text-green-500",
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CountdownTimer({
  targetDate,
  label,
  compact = false,
  showIcon = true,
  className,
}: CountdownTimerProps) {
  const countdown = useMemo(() => {
    const target =
      typeof targetDate === "string" ? parseISO(targetDate) : targetDate;
    const now = new Date();

    const isOverdue = isPast(target);
    const daysLeft = Math.abs(differenceInDays(target, now));
    const hoursLeft = Math.abs(differenceInHours(target, now));

    // Build human-readable text
    let displayText: string;

    if (isOverdue) {
      displayText = "OVERDUE";
    } else if (daysLeft === 0) {
      if (hoursLeft === 0) {
        displayText = "Less than 1 hour left";
      } else {
        displayText = `${hoursLeft} hour${hoursLeft === 1 ? "" : "s"} left`;
      }
    } else if (daysLeft === 1) {
      displayText = "1 day left";
    } else {
      displayText = `${daysLeft} days left`;
    }

    const urgency = getUrgencyClasses(daysLeft, isOverdue);

    return { daysLeft, isOverdue, displayText, urgency };
  }, [targetDate]);

  const { isOverdue, displayText, urgency } = countdown;
  const IconComponent = isOverdue ? AlertTriangle : Clock;

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium",
          urgency.text,
          className
        )}
      >
        {showIcon && <IconComponent className={cn("size-3.5", urgency.icon)} />}
        {displayText}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-3 py-1.5",
        urgency.bg,
        urgency.border,
        className
      )}
    >
      {showIcon && <IconComponent className={cn("size-4 shrink-0", urgency.icon)} />}
      <div className="flex flex-col">
        {label && (
          <span className="text-[11px] font-medium text-muted-foreground">
            {label}
          </span>
        )}
        <span className={cn("text-sm font-semibold", urgency.text)}>
          {displayText}
        </span>
      </div>
    </div>
  );
}

export default CountdownTimer;
