"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { ChangeTimeline } from "@/components/renters-rights/ChangeTimeline";
import {
  AlertTriangle,
  ArrowRight,
  CheckSquare,
  Scale,
  Calculator,
  FileText,
  Shield,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { ChecklistItem } from "@/types";

// ---------------------------------------------------------------------------
// Quick links
// ---------------------------------------------------------------------------

const QUICK_LINKS = [
  {
    title: "Compliance Checklist",
    description: "Track your compliance tasks per property",
    href: "/renters-rights/checklist",
    icon: CheckSquare,
    color: "text-[#16A34A]",
  },
  {
    title: "Section 8 Reference",
    description: "Grounds for possession guide",
    href: "/renters-rights/section8",
    icon: Scale,
    color: "text-red-600",
  },
  {
    title: "Rent Increase Calculator",
    description: "Section 13 notice timeline and calculator",
    href: "/renters-rights/rent-increase",
    icon: Calculator,
    color: "text-blue-600",
  },
  {
    title: "Document Templates",
    description: "Notices, forms, and statements",
    href: "/renters-rights/templates",
    icon: FileText,
    color: "text-[#1E3A5F]",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getScoreColor(score: number): string {
  if (score >= 80) return "#16A34A";
  if (score >= 40) return "#F59E0B";
  return "#DC2626";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 40) return "Needs Work";
  return "At Risk";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RentersRightsPage() {
  const { user, loading: authLoading } = useAuth();
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchChecklist() {
      try {
        setLoading(true);
        const supabase = createClient();

        const { data, error } = await supabase
          .from("checklist_items")
          .select("*")
          .eq("user_id", user!.id)
          .eq("pillar", "renters_rights");

        if (error) throw error;
        setChecklistItems(data ?? []);
      } catch (err) {
        console.error("Failed to fetch renters rights checklist:", err);
        // Gracefully fall back to zero scores if fetch fails
        setChecklistItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchChecklist();
  }, [user, authLoading]);

  const totalCount = checklistItems.length;
  const completedCount = checklistItems.filter((item) => item.is_completed).length;
  const score = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const scoreColor = useMemo(() => getScoreColor(score), [score]);
  const scoreLabel = useMemo(() => getScoreLabel(score), [score]);

  // Key dates
  const section21AbolishedDate = new Date("2026-05-01");
  const infoSheetDeadline = new Date("2026-05-31");

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <div className="flex items-center gap-2">
          <Shield className="size-6 text-[#16A34A]" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Renters&apos; Rights Act
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your compliance with the Renters&apos; Rights Act 2025. Phase 1
          takes effect on 1 May 2026.
        </p>
      </div>

      {/* Compliance Score + Key Countdowns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Compliance Score Card */}
        <Card className="border-t-4 border-t-[#16A34A]">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Renters&apos; Rights Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p
              className="text-5xl font-bold leading-none"
              style={{ color: scoreColor }}
            >
              {score}%
            </p>
            <Badge
              variant="outline"
              className={cn(
                "border-transparent",
                score >= 80
                  ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : score >= 40
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                    : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
              )}
            >
              {scoreLabel}
            </Badge>
            <p className="text-xs text-muted-foreground">
              {completedCount} of {totalCount} checklist items complete
            </p>
            <Link href="/renters-rights/checklist">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between px-0 text-xs font-medium text-[#16A34A]"
              >
                View Checklist
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Section 21 Countdown */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Section 21 Abolished
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              1 May 2026
            </p>
            <CountdownTimer
              targetDate={section21AbolishedDate}
              label="Days until Section 21 is abolished"
              showIcon
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              All existing Section 21 notices become invalid. ASTs convert to
              periodic assured tenancies.
            </p>
          </CardContent>
        </Card>

        {/* Information Sheet Countdown */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Information Sheet Deadline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              31 May 2026
            </p>
            <CountdownTimer
              targetDate={infoSheetDeadline}
              label="Days until Information Sheet deadline"
              showIcon
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Government Information Sheet must be provided to all existing
              tenants by this date.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Quick Links
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                  <CardContent className="flex items-start gap-3 py-4 px-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Icon className={cn("size-5", link.color)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {link.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Interactive Timeline */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Implementation Timeline
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          The Renters&apos; Rights Act is being implemented in 3 phases. Click
          each phase to view the changes.
        </p>
        <ChangeTimeline />
      </section>

      {/* Legal Disclaimer */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
        <div className="flex gap-3">
          <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
            <p className="font-semibold">Important Disclaimer</p>
            <p className="mt-1">
              This page provides guidance based on publicly available information
              from MHCLG about the Renters&apos; Rights Act 2025. It is{" "}
              <strong>not</strong> legal advice. The Act is still being
              implemented and secondary legislation may change specific
              requirements. Always consult a qualified solicitor or legal
              professional for advice specific to your situation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
