"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { PenaltyTracker } from "@/components/mtd/PenaltyTracker";
import {
  MTD_READINESS_CHECKLIST,
  MTD_THRESHOLDS,
  MTD_QUARTERLY_DEADLINES_2026_27,
} from "@/lib/constants/mtd-deadlines";
import {
  FileText,
  Calculator,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Shield,
  TrendingUp,
  Loader2,
} from "lucide-react";
import type { Priority, ChecklistItem } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const MOCK_PENALTY_POINTS = 1;
const MOCK_MTD_PHASE = MTD_THRESHOLDS[0]; // Phase 1 - April 2026

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function priorityBadge(priority: Priority) {
  switch (priority) {
    case "critical":
      return (
        <Badge className="border-0 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
          Critical
        </Badge>
      );
    case "high":
      return (
        <Badge className="border-0 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
          High
        </Badge>
      );
    case "medium":
      return (
        <Badge className="border-0 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
          Medium
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">Low</Badge>
      );
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function MtdOverviewPage() {
  const { user, loading: authLoading } = useAuth();
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [togglingKeys, setTogglingKeys] = useState<Set<string>>(new Set());

  // Build a set of completed keys from Supabase checklist items
  const completedKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const item of checklistItems) {
      if (item.is_completed) {
        keys.add(item.item_key);
      }
    }
    return keys;
  }, [checklistItems]);

  // Build a lookup from item_key to checklist item id
  const itemKeyToId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const item of checklistItems) {
      map[item.item_key] = item.id;
    }
    return map;
  }, [checklistItems]);

  const fetchChecklist = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from("checklist_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("pillar", "mtd")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setChecklistItems(data);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    fetchChecklist().finally(() => setLoadingData(false));
  }, [user, authLoading, fetchChecklist]);

  const readinessScore = useMemo(() => {
    return Math.round(
      (completedKeys.size / MTD_READINESS_CHECKLIST.length) * 100
    );
  }, [completedKeys]);

  const toggleItem = async (key: string) => {
    if (!user) return;

    const existingId = itemKeyToId[key];
    const isCurrentlyCompleted = completedKeys.has(key);
    const supabase = createClient();

    // Mark this key as in-flight
    setTogglingKeys((prev) => new Set(prev).add(key));

    if (existingId) {
      // Item exists in DB -- update it
      const { error } = await supabase
        .from("checklist_items")
        .update({
          is_completed: !isCurrentlyCompleted,
          completed_at: !isCurrentlyCompleted ? new Date().toISOString() : null,
        })
        .eq("id", existingId)
        .eq("user_id", user.id);

      if (!error) {
        // Optimistic local update
        setChecklistItems((prev) =>
          prev.map((item) =>
            item.id === existingId
              ? {
                  ...item,
                  is_completed: !isCurrentlyCompleted,
                  completed_at: !isCurrentlyCompleted ? new Date().toISOString() : null,
                }
              : item
          )
        );
      }
    } else {
      // Item doesn't exist yet -- find the matching constant for metadata
      const checklistConst = MTD_READINESS_CHECKLIST.find((c) => c.key === key);
      if (!checklistConst) {
        setTogglingKeys((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
        return;
      }

      const { data, error } = await supabase
        .from("checklist_items")
        .insert({
          user_id: user.id,
          property_id: null,
          pillar: "mtd",
          item_key: key,
          title: checklistConst.title,
          description: checklistConst.description,
          is_completed: true,
          completed_at: new Date().toISOString(),
          due_date: null,
          priority: checklistConst.priority,
        })
        .select()
        .single();

      if (!error && data) {
        setChecklistItems((prev) => [...prev, data]);
      }
    }

    setTogglingKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  if (authLoading || loadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
        <span className="ml-3 text-gray-500">Loading MTD data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Making Tax Digital
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your MTD for Income Tax readiness, quarterly submissions, and penalty points.
        </p>
      </div>

      {/* Top Row: Readiness Score + MTD Phase Status */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Circular Readiness Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5 text-[#2563EB]" />
              MTD Readiness Score
            </CardTitle>
            <CardDescription>
              Complete all checklist items to reach 100% readiness.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {/* Circular Progress */}
            <div className="relative flex size-40 items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 160 160">
                {/* Background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  strokeWidth="12"
                  fill="none"
                  className="stroke-gray-100 dark:stroke-gray-800"
                />
                {/* Progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  className="stroke-[#2563EB] transition-all duration-500"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - readinessScore / 100)}`}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-[#1E3A5F] dark:text-white">
                  {readinessScore}%
                </span>
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {completedKeys.size} of {MTD_READINESS_CHECKLIST.length} items completed
            </p>
          </CardContent>
        </Card>

        {/* MTD Phase Status Card */}
        <Card className="border-[#2563EB]/30 bg-[#2563EB]/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-[#2563EB]" />
              Your MTD Phase
            </CardTitle>
            <CardDescription>
              Based on qualifying income, you fall under:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-white/80 p-4 dark:bg-white/5">
              <Badge className="border-0 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                {MOCK_MTD_PHASE.label}
              </Badge>
              <p className="mt-2 text-lg font-bold text-[#1E3A5F] dark:text-white">
                {MOCK_MTD_PHASE.message}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {MOCK_MTD_PHASE.description}
              </p>
            </div>
            <div className="rounded-lg border border-[#2563EB]/20 p-3">
              <p className="text-xs text-muted-foreground">
                Threshold: {"\u00A3"}{MOCK_MTD_PHASE.threshold.toLocaleString("en-GB")} | Starts:{" "}
                {formatDate(MOCK_MTD_PHASE.startDate)}
              </p>
            </div>
            <Link href="/mtd/calculator">
              <Button variant="outline" className="w-full border-[#2563EB]/30 text-[#2563EB]">
                <Calculator className="size-4" />
                Check &ldquo;Am I Affected?&rdquo;
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Readiness Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-[#2563EB]" />
            MTD Readiness Checklist
          </CardTitle>
          <CardDescription>
            Complete all items below to be fully prepared for Making Tax Digital.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {completedKeys.size}/{MTD_READINESS_CHECKLIST.length}
              </span>
            </div>
            <Progress value={readinessScore} className="mt-2" />
          </div>

          <div className="divide-y">
            {MTD_READINESS_CHECKLIST.map((item) => {
              const isCompleted = completedKeys.has(item.key);
              const isToggling = togglingKeys.has(item.key);
              return (
                <div
                  key={item.key}
                  className={`flex items-start gap-4 py-4 ${
                    isCompleted ? "opacity-70" : ""
                  }`}
                >
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => toggleItem(item.key)}
                    disabled={isToggling}
                    className="mt-0.5"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={`text-sm font-medium ${
                          isCompleted
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {item.title}
                      </p>
                      {priorityBadge(item.priority)}
                      {isToggling && (
                        <Loader2 className="size-3 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quarterly Submission Tracker Summary */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="size-5 text-[#2563EB]" />
                Quarterly Submissions — 2026/27
              </CardTitle>
              <CardDescription>
                Visual timeline of your quarterly submission deadlines.
              </CardDescription>
            </div>
            <Link href="/mtd/quarters">
              <Button variant="outline" size="sm">
                View Details
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {/* Timeline summary */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MTD_QUARTERLY_DEADLINES_2026_27.map((q) => {
              const remaining = daysUntil(q.submissionDeadline);
              const isPast = remaining < 0;
              return (
                <div
                  key={q.quarter}
                  className={`rounded-lg border p-4 ${
                    isPast
                      ? "border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10"
                      : remaining <= 60
                      ? "border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1E3A5F] dark:text-white">
                      Q{q.quarter}
                    </span>
                    {isPast ? (
                      <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Clock className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{q.submitBy}</p>
                  <p
                    className={`mt-1 text-sm font-medium ${
                      isPast
                        ? "text-green-600 dark:text-green-400"
                        : remaining <= 60
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {isPast ? "Complete" : `${remaining} days`}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Penalty Points Tracker */}
      <PenaltyTracker currentPoints={MOCK_PENALTY_POINTS} />

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/mtd/calculator">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#2563EB]/10">
                <Calculator className="size-5 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Am I Affected?</p>
                <p className="text-xs text-muted-foreground">Calculate your MTD status</p>
              </div>
              <ArrowRight className="ml-auto size-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/mtd/quarters">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#2563EB]/10">
                <CalendarDays className="size-5 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Quarter Tracker</p>
                <p className="text-xs text-muted-foreground">Track quarterly submissions</p>
              </div>
              <ArrowRight className="ml-auto size-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/mtd/software">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#2563EB]/10">
                <FileText className="size-5 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Compare Software</p>
                <p className="text-xs text-muted-foreground">HMRC-recognised MTD tools</p>
              </div>
              <ArrowRight className="ml-auto size-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Legal Disclaimer */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
        <div className="flex gap-3">
          <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
            <p className="font-semibold">Important Disclaimer</p>
            <p className="mt-1">
              The MTD information shown is based on publicly available HMRC guidance as of February
              2026. This is <strong>not</strong> tax or legal advice. Thresholds, deadlines, and
              penalty rules are subject to change. Always consult HMRC directly or a qualified tax
              adviser for advice specific to your circumstances. The readiness score is indicative
              only and based on checklist completion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
