import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ComplianceStatus, CertificateStatus } from "@/types";

// ---------------------------------------------------------------------------
// Supported status types
// ---------------------------------------------------------------------------

type StatusType = ComplianceStatus | CertificateStatus;

// ---------------------------------------------------------------------------
// Colour & label mappings
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  StatusType,
  { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
  // Compliance statuses
  ready: {
    label: "Ready",
    dotColor: "bg-green-500",
    bgColor: "bg-green-50 dark:bg-green-500/10",
    textColor: "text-green-700 dark:text-green-400",
  },
  partial: {
    label: "Partial",
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    textColor: "text-amber-700 dark:text-amber-400",
  },
  not_ready: {
    label: "Not Ready",
    dotColor: "bg-red-500",
    bgColor: "bg-red-50 dark:bg-red-500/10",
    textColor: "text-red-700 dark:text-red-400",
  },

  // Certificate statuses
  valid: {
    label: "Valid",
    dotColor: "bg-green-500",
    bgColor: "bg-green-50 dark:bg-green-500/10",
    textColor: "text-green-700 dark:text-green-400",
  },
  expiring_soon: {
    label: "Expiring Soon",
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    textColor: "text-amber-700 dark:text-amber-400",
  },
  expired: {
    label: "Expired",
    dotColor: "bg-red-500",
    bgColor: "bg-red-50 dark:bg-red-500/10",
    textColor: "text-red-700 dark:text-red-400",
  },
  missing: {
    label: "Missing",
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-500/10",
    textColor: "text-gray-600 dark:text-gray-400",
  },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface StatusBadgeProps {
  /** The compliance or certificate status to display */
  status: StatusType;
  /** Override the default label text */
  label?: string;
  /** Show a coloured dot indicator alongside the label */
  showDot?: boolean;
  /** Additional Tailwind classes */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StatusBadge({
  status,
  label,
  showDot = true,
  className,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return null;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-medium",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {showDot && (
        <span
          className={cn("size-1.5 shrink-0 rounded-full", config.dotColor)}
          aria-hidden="true"
        />
      )}
      {label ?? config.label}
    </Badge>
  );
}

export default StatusBadge;
