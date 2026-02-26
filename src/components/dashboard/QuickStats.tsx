"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Calculator, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Individual stat card
// ---------------------------------------------------------------------------

interface StatItemProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: string | number;
  subtext?: string;
}

function StatItem({
  icon: Icon,
  iconColor,
  iconBgColor,
  label,
  value,
  subtext,
}: StatItemProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-1">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            iconBgColor
          )}
        >
          <Icon className={cn("size-5", iconColor)} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold leading-tight text-foreground">
            {value}
          </p>
          {subtext && (
            <p className="text-[11px] text-muted-foreground truncate">
              {subtext}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface QuickStatsProps {
  totalProperties: number;
  totalTenancies: number;
  mtdThresholdStatus: string;
  mtdSubtext?: string;
  epcCompliant: number;
  epcTotal: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function QuickStats({
  totalProperties,
  totalTenancies,
  mtdThresholdStatus,
  mtdSubtext,
  epcCompliant,
  epcTotal,
  className,
}: QuickStatsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      <StatItem
        icon={Building2}
        iconColor="text-[#1E3A5F]"
        iconBgColor="bg-blue-100 dark:bg-blue-500/10"
        label="Total Properties"
        value={totalProperties}
      />

      <StatItem
        icon={Users}
        iconColor="text-[#1E3A5F]"
        iconBgColor="bg-indigo-100 dark:bg-indigo-500/10"
        label="Total Tenancies"
        value={totalTenancies}
      />

      <StatItem
        icon={Calculator}
        iconColor="text-[#2563EB]"
        iconBgColor="bg-blue-100 dark:bg-blue-500/10"
        label="MTD Status"
        value={mtdThresholdStatus}
        subtext={mtdSubtext}
      />

      <StatItem
        icon={Zap}
        iconColor="text-[#F59E0B]"
        iconBgColor="bg-amber-100 dark:bg-amber-500/10"
        label="EPC Breakdown"
        value={`${epcCompliant} / ${epcTotal}`}
        subtext={
          epcTotal > 0
            ? `${Math.round((epcCompliant / epcTotal) * 100)}% compliant`
            : "No properties"
        }
      />
    </div>
  );
}

export default QuickStats;
