"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuarterTracker, type QuarterData } from "@/components/mtd/QuarterTracker";
import {
  MTD_QUARTERLY_DEADLINES_2026_27,
  MTD_FINAL_DECLARATION_DEADLINE,
} from "@/lib/constants/mtd-deadlines";
import { ArrowLeft, CalendarDays } from "lucide-react";
import type { MtdStatus } from "@/types";

// ---------------------------------------------------------------------------
// Mock data for quarter statuses and financials
// ---------------------------------------------------------------------------
const MOCK_QUARTER_DATA: QuarterData[] = MTD_QUARTERLY_DEADLINES_2026_27.map((q) => {
  let status: MtdStatus;
  let totalIncome: number | null = null;
  let totalExpenses: number | null = null;

  // Simulate statuses based on current date relative to deadlines
  const now = new Date();
  const deadline = new Date(q.submissionDeadline);
  const periodEnd = new Date(q.periodEnd);

  if (now > deadline) {
    // Past deadline — mock as submitted for demo
    status = "submitted";
    totalIncome = 14250;
    totalExpenses = 3820;
  } else if (now > periodEnd) {
    // Period ended but submission not yet due
    status = "in_progress";
    totalIncome = 13800;
    totalExpenses = 2950;
  } else {
    // Period hasn't ended yet
    status = "not_started";
  }

  return {
    quarter: q.quarter,
    label: q.label,
    periodStart: q.periodStart,
    periodEnd: q.periodEnd,
    submissionDeadline: q.submissionDeadline,
    submitBy: q.submitBy,
    status,
    totalIncome,
    totalExpenses,
  };
});

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function MtdQuartersPage() {
  return (
    <div className="space-y-6">
      {/* Back nav + heading */}
      <div>
        <Link href="/mtd">
          <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground">
            <ArrowLeft className="size-4" />
            Back to MTD Overview
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#2563EB]/10">
            <CalendarDays className="size-5 text-[#2563EB]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Quarterly Submission Tracker
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Tax year 2026/27 &mdash; Track income, expenses, and submission status for each
              quarter.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {MOCK_QUARTER_DATA.map((q) => {
          const statusColor =
            q.status === "submitted"
              ? "text-green-600 dark:text-green-400"
              : q.status === "in_progress"
              ? "text-blue-600 dark:text-blue-400"
              : q.status === "overdue"
              ? "text-red-600 dark:text-red-400"
              : "text-gray-500";
          const statusLabel =
            q.status === "submitted"
              ? "Submitted"
              : q.status === "in_progress"
              ? "In Progress"
              : q.status === "overdue"
              ? "Overdue"
              : "Not Started";
          return (
            <div key={q.quarter} className="rounded-lg border p-4 text-center">
              <p className="text-sm font-medium text-muted-foreground">Q{q.quarter}</p>
              <p className={`mt-1 text-sm font-semibold ${statusColor}`}>{statusLabel}</p>
            </div>
          );
        })}
      </div>

      {/* Quarter Tracker Timeline */}
      <QuarterTracker
        quarters={MOCK_QUARTER_DATA}
        finalDeclarationDeadline={MTD_FINAL_DECLARATION_DEADLINE}
      />
    </div>
  );
}
