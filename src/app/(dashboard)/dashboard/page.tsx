"use client";

import React, { useMemo, useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ComplianceScoreCard } from "@/components/dashboard/ComplianceScoreCard";
import { PillarCard } from "@/components/dashboard/PillarCard";
import { DeadlineTimeline } from "@/components/dashboard/DeadlineTimeline";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { calculateOverallCompliance } from "@/lib/compliance/score-calculator";
import { getAllDeadlines } from "@/lib/compliance/deadline-engine";
import { AlertTriangle, Building2, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { MTD_READINESS_CHECKLIST } from "@/lib/constants/mtd-deadlines";
import { RENTERS_RIGHTS_CHECKLIST } from "@/lib/constants/renters-rights-timeline";
import type { ChecklistItem, Property, Certificate } from "@/types";

// ---------------------------------------------------------------------------
// Default EPC checklist items (no separate constants file exists)
// ---------------------------------------------------------------------------

const EPC_DEFAULT_CHECKLIST = [
  {
    key: "epc_checked",
    title: "Checked current EPC rating for all properties",
    description:
      "Review your EPC certificates and check ratings against the upcoming minimum C requirement.",
    priority: "high" as const,
  },
  {
    key: "gap_analysis",
    title: "Completed gap-to-C analysis",
    description:
      "Identify which properties need improvements to reach EPC C by the 2030 deadline.",
    priority: "high" as const,
  },
  {
    key: "improvement_plan",
    title: "Created improvement plan",
    description:
      "Plan the energy efficiency improvements needed, with costs and timelines.",
    priority: "medium" as const,
  },
  {
    key: "grant_research",
    title: "Researched available grants (Warm Homes, BUS, GBIS, ECO4)",
    description:
      "Check eligibility for government grants to offset improvement costs.",
    priority: "medium" as const,
  },
  {
    key: "works_started",
    title: "Started improvement works",
    description:
      "Begin carrying out the planned energy efficiency improvements.",
    priority: "medium" as const,
  },
  {
    key: "reassessment_booked",
    title: "Booked EPC reassessment",
    description:
      "After improvements, book a new EPC assessment to confirm the updated rating.",
    priority: "low" as const,
  },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasSeededRef = useRef(false);

  // -----------------------------------------------------------------------
  // Seed default checklist items if the user has none
  // -----------------------------------------------------------------------
  const seedDefaultChecklist = useCallback(
    async (userId: string) => {
      if (hasSeededRef.current) return [];
      hasSeededRef.current = true;

      const supabase = createClient();
      const itemsToInsert: Array<{
        user_id: string;
        property_id: null;
        pillar: string;
        item_key: string;
        title: string;
        description: string | null;
        is_completed: boolean;
        priority: string;
        due_date: string | null;
      }> = [];

      // MTD items
      for (const item of MTD_READINESS_CHECKLIST) {
        itemsToInsert.push({
          user_id: userId,
          property_id: null,
          pillar: "mtd",
          item_key: item.key,
          title: item.title,
          description: item.description,
          is_completed: false,
          priority: item.priority,
          due_date: null,
        });
      }

      // Renters' Rights items
      for (const item of RENTERS_RIGHTS_CHECKLIST) {
        itemsToInsert.push({
          user_id: userId,
          property_id: null,
          pillar: "renters_rights",
          item_key: item.key,
          title: item.title,
          description: item.description,
          is_completed: false,
          priority: item.priority,
          due_date: item.dueDate ?? null,
        });
      }

      // EPC items
      for (const item of EPC_DEFAULT_CHECKLIST) {
        itemsToInsert.push({
          user_id: userId,
          property_id: null,
          pillar: "epc",
          item_key: item.key,
          title: item.title,
          description: item.description,
          is_completed: false,
          priority: item.priority,
          due_date: null,
        });
      }

      const { data, error: insertError } = await supabase
        .from("checklist_items")
        .insert(itemsToInsert)
        .select();

      if (insertError) {
        console.error("Failed to seed default checklist:", insertError);
        return [];
      }

      return (data as ChecklistItem[]) ?? [];
    },
    []
  );

  // -----------------------------------------------------------------------
  // Fetch all dashboard data
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setDataLoading(false);
      return;
    }

    let cancelled = false;
    const supabase = createClient();

    async function fetchData() {
      try {
        // Fetch checklist items, properties, and certificates in parallel
        const [checklistResult, propertiesResult] = await Promise.all([
          supabase
            .from("checklist_items")
            .select("*")
            .eq("user_id", user!.id)
            .order("created_at", { ascending: true }),
          supabase
            .from("properties")
            .select("*, epc_records(*), tenancies(*), certificates(*)")
            .eq("user_id", user!.id)
            .order("created_at", { ascending: false }),
        ]);

        if (cancelled) return;

        if (checklistResult.error) {
          setError(checklistResult.error.message);
          setDataLoading(false);
          return;
        }

        if (propertiesResult.error) {
          setError(propertiesResult.error.message);
          setDataLoading(false);
          return;
        }

        let items = (checklistResult.data as ChecklistItem[]) ?? [];
        const props = (propertiesResult.data as Property[]) ?? [];

        // Extract certificates from properties
        const allCerts: Certificate[] = [];
        for (const p of props) {
          if (p.certificates && p.certificates.length > 0) {
            allCerts.push(...p.certificates);
          }
        }

        // If no checklist items exist, auto-seed defaults
        if (items.length === 0) {
          items = await seedDefaultChecklist(user!.id);
        }

        if (cancelled) return;

        setChecklistItems(items);
        setProperties(props);
        setCertificates(allCerts);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load dashboard data. Please try again.");
          console.error("Dashboard fetch error:", err);
        }
      } finally {
        if (!cancelled) {
          setDataLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, seedDefaultChecklist]);

  // -----------------------------------------------------------------------
  // Computed values
  // -----------------------------------------------------------------------
  const compliance = useMemo(
    () => calculateOverallCompliance(checklistItems),
    [checklistItems]
  );

  const deadlines = useMemo(
    () => getAllDeadlines(properties, certificates),
    [properties, certificates]
  );

  const totalProperties = properties.length;
  const totalTenancies = properties.reduce(
    (sum, p) => sum + (p.tenancies?.filter((t) => t.status === "active").length ?? 0),
    0
  );

  // EPC compliance stats
  const epcCompliant = properties.filter((p) => {
    const latestEpc = p.epc_records?.[0];
    if (!latestEpc?.current_rating) return false;
    return ["A", "B", "C"].includes(latestEpc.current_rating);
  }).length;

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------
  if (authLoading || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Error state
  // -----------------------------------------------------------------------
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="size-12 text-red-500" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Empty state (no properties yet)
  // -----------------------------------------------------------------------
  if (totalProperties === 0 && checklistItems.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your compliance overview across all three regulatory pillars.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <Building2 className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            Welcome to LandlordShield
          </h3>
          <p className="mt-1 max-w-md text-center text-sm text-muted-foreground">
            Add your first property to start tracking compliance across Making
            Tax Digital, Renters&apos; Rights, and EPC regulations.
          </p>
          <Button asChild className="mt-4">
            <Link href="/properties/new">
              <Plus className="size-4" />
              Add Your First Property
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Main dashboard
  // -----------------------------------------------------------------------
  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your compliance overview across all three regulatory pillars.
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Quick Stats row                                                    */}
      {/* ----------------------------------------------------------------- */}
      <QuickStats
        totalProperties={totalProperties}
        totalTenancies={totalTenancies}
        mtdThresholdStatus={totalProperties > 0 ? "Phase 1" : "N/A"}
        mtdSubtext={totalProperties > 0 ? "Check your threshold" : "Add a property to start"}
        epcCompliant={epcCompliant}
        epcTotal={totalProperties}
      />

      {/* ----------------------------------------------------------------- */}
      {/* Overall Compliance Score + Pillar Cards                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Large circular score card */}
        <ComplianceScoreCard
          score={compliance.overallScore}
          className="lg:row-span-1"
        />

        {/* Three pillar cards */}
        <PillarCard
          pillar="mtd"
          score={compliance.mtd.score}
          status={compliance.mtd.status}
          nextDeadline={compliance.mtd.nextDeadline}
          daysUntilDeadline={compliance.mtd.daysUntilDeadline}
          outstandingActions={compliance.mtd.outstandingActions}
        />

        <PillarCard
          pillar="renters_rights"
          score={compliance.rentersRights.score}
          status={compliance.rentersRights.status}
          nextDeadline={compliance.rentersRights.nextDeadline}
          daysUntilDeadline={compliance.rentersRights.daysUntilDeadline}
          outstandingActions={compliance.rentersRights.outstandingActions}
        />

        <PillarCard
          pillar="epc"
          score={compliance.epc.score}
          status={compliance.epc.status}
          nextDeadline={compliance.epc.nextDeadline}
          daysUntilDeadline={compliance.epc.daysUntilDeadline}
          outstandingActions={compliance.epc.outstandingActions}
        />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Upcoming Deadlines Timeline                                       */}
      {/* ----------------------------------------------------------------- */}
      <DeadlineTimeline deadlines={deadlines} limit={8} />

      {/* ----------------------------------------------------------------- */}
      {/* Legal disclaimer                                                   */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
        <div className="flex gap-3">
          <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
            <p className="font-semibold">Important Disclaimer</p>
            <p className="mt-1">
              LandlordShield provides guidance based on publicly available information from
              HMRC, MHCLG, and DESNZ. It is <strong>not</strong> legal, tax, or financial
              advice. Always consult a qualified professional for advice specific to your
              situation. The compliance scores shown are indicative and based on checklist
              completion; they do not guarantee regulatory compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
