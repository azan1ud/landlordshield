"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CircleDot,
  Send,
} from "lucide-react";
import type { MtdStatus } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface QuarterData {
  quarter: number;
  label: string;
  periodStart: string;
  periodEnd: string;
  submissionDeadline: string;
  submitBy: string;
  status: MtdStatus;
  totalIncome: number | null;
  totalExpenses: number | null;
}

interface QuarterTrackerProps {
  quarters: QuarterData[];
  finalDeclarationDeadline: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function statusConfig(status: MtdStatus) {
  switch (status) {
    case "submitted":
      return {
        label: "Submitted",
        icon: CheckCircle2,
        color: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
        dot: "bg-green-500",
        ring: "ring-green-500/30",
      };
    case "in_progress":
      return {
        label: "In Progress",
        icon: CircleDot,
        color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
        dot: "bg-blue-500",
        ring: "ring-blue-500/30",
      };
    case "overdue":
      return {
        label: "Overdue",
        icon: AlertTriangle,
        color: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
        dot: "bg-red-500",
        ring: "ring-red-500/30",
      };
    default:
      return {
        label: "Not Started",
        icon: Clock,
        color: "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
        dot: "bg-gray-400",
        ring: "ring-gray-400/30",
      };
  }
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number | null): string {
  if (amount === null) return "--";
  return `\u00A3${amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function QuarterTracker({ quarters, finalDeclarationDeadline }: QuarterTrackerProps) {
  return (
    <div className="space-y-6">
      {/* Quarters */}
      <div className="relative space-y-0">
        {quarters.map((q, idx) => {
          const config = statusConfig(q.status);
          const StatusIcon = config.icon;
          const remaining = daysUntil(q.submissionDeadline);
          const isLast = idx === quarters.length - 1;

          return (
            <div key={q.quarter} className="relative flex gap-4">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div
                  className={`z-10 flex size-10 items-center justify-center rounded-full ${config.dot} ring-4 ${config.ring}`}
                >
                  <StatusIcon className="size-5 text-white" />
                </div>
                {!isLast && (
                  <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700" />
                )}
              </div>

              {/* Quarter Card */}
              <Card className="mb-6 flex-1">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">Q{q.quarter}</CardTitle>
                      <CardDescription>{q.label}</CardDescription>
                    </div>
                    <Badge className={`${config.color} border-0`}>
                      {config.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Period and Deadline */}
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-muted-foreground">Period</p>
                        <p>
                          {formatDate(q.periodStart)} &ndash; {formatDate(q.periodEnd)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Send className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-muted-foreground">Submit by</p>
                        <p>{formatDate(q.submissionDeadline)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Days Countdown */}
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Days remaining</span>
                      <span
                        className={`text-lg font-bold ${
                          remaining < 0
                            ? "text-red-600 dark:text-red-400"
                            : remaining <= 30
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-[#1E3A5F] dark:text-white"
                        }`}
                      >
                        {remaining < 0 ? `${Math.abs(remaining)} days overdue` : `${remaining} days`}
                      </span>
                    </div>
                    {/* Progress bar showing time elapsed */}
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          remaining < 0
                            ? "bg-red-500"
                            : remaining <= 30
                            ? "bg-amber-500"
                            : "bg-[#2563EB]"
                        }`}
                        style={{
                          width: `${Math.max(0, Math.min(100, ((daysUntil(q.periodStart) < 0 ? Math.abs(daysUntil(q.periodStart)) : 0) / Math.max(1, Math.abs(daysUntil(q.periodStart)) + remaining)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Income / Expenses placeholders */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-green-50 p-3 dark:bg-green-500/10">
                      <p className="text-xs font-medium text-green-600 dark:text-green-400">
                        Income
                      </p>
                      <p className="mt-0.5 text-lg font-semibold text-green-700 dark:text-green-300">
                        {formatCurrency(q.totalIncome)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-red-50 p-3 dark:bg-red-500/10">
                      <p className="text-xs font-medium text-red-600 dark:text-red-400">
                        Expenses
                      </p>
                      <p className="mt-0.5 text-lg font-semibold text-red-700 dark:text-red-300">
                        {formatCurrency(q.totalExpenses)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}

        {/* Final Declaration */}
        <div className="relative flex gap-4">
          <div className="flex flex-col items-center">
            <div className="z-10 flex size-10 items-center justify-center rounded-full bg-[#1E3A5F] ring-4 ring-[#1E3A5F]/20">
              <FileText className="size-5 text-white" />
            </div>
          </div>
          <Card className="flex-1 border-[#1E3A5F]/30 bg-[#1E3A5F]/5">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">Final Declaration</CardTitle>
                  <CardDescription>
                    End-of-period statement and final declaration for 2026/27
                  </CardDescription>
                </div>
                <Badge className="border-0 bg-[#1E3A5F]/10 text-[#1E3A5F] dark:bg-[#2563EB]/20 dark:text-[#2563EB]">
                  {formatDate(finalDeclarationDeadline)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm text-muted-foreground">Days remaining</span>
                <span className="text-lg font-bold text-[#1E3A5F] dark:text-white">
                  {daysUntil(finalDeclarationDeadline)} days
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
