"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { UpgradePlanner } from "@/components/epc/UpgradePlanner";
import { CostCapTracker } from "@/components/epc/CostCapTracker";
import { ArrowLeft, AlertTriangle, Info, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { EpcRating, Property, EpcImprovement } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface PlannerProperty {
  id: string;
  address: string;
  epcRating: EpcRating | null;
  epcScore: number | null;
}

function buildAddress(p: Property): string {
  return [p.address_line1, p.address_line2, p.city, p.postcode]
    .filter(Boolean)
    .join(", ");
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function UpgradePlannerPage() {
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<PlannerProperty[]>([]);
  const [costCapSpent, setCostCapSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        // Fetch properties with their epc_records
        const { data: propertiesData, error: propError } = await supabase
          .from("properties")
          .select("*, epc_records(*)")
          .eq("user_id", user!.id);

        if (propError) throw propError;

        const propertyIds = (propertiesData ?? []).map((p: Property) => p.id);

        // Fetch improvements to calculate cost cap spending
        let improvements: EpcImprovement[] = [];
        if (propertyIds.length > 0) {
          const { data: improvementsData, error: impError } = await supabase
            .from("epc_improvements")
            .select("*")
            .in("property_id", propertyIds);

          if (impError) throw impError;
          improvements = improvementsData ?? [];
        }

        // Calculate total cost cap spending (completed improvements that count toward cap)
        const totalSpent = improvements
          .filter((imp) => imp.counts_toward_cap && imp.status === "completed")
          .reduce(
            (sum, imp) => sum + (imp.actual_cost ?? imp.estimated_cost ?? 0),
            0
          );

        setCostCapSpent(totalSpent);

        // Map to planner property shape
        const mapped: PlannerProperty[] = (propertiesData ?? []).map(
          (p: Property & { epc_records?: Array<{ current_rating: EpcRating | null; current_score: number | null }> }) => {
            const latestEpc = p.epc_records?.[0] ?? null;
            return {
              id: p.id,
              address: buildAddress(p),
              epcRating: latestEpc?.current_rating ?? null,
              epcScore: latestEpc?.current_score ?? null,
            };
          }
        );

        setProperties(mapped);
      } catch (err) {
        console.error("Failed to fetch upgrade planner data:", err);
        setError("Failed to load property data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, authLoading]);

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <Button variant="ghost" size="sm" className="mb-2" asChild>
            <Link href="/epc">
              <ArrowLeft className="mr-1 size-4" />
              Back to EPC Overview
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            EPC Upgrade Planner
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <Button variant="ghost" size="sm" className="mb-2" asChild>
          <Link href="/epc">
            <ArrowLeft className="mr-1 size-4" />
            Back to EPC Overview
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          EPC Upgrade Planner
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a property, explore improvements, and estimate the cost to
          reach Band C compliance.
        </p>
      </div>

      {/* Info alert */}
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/5">
        <Info className="size-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">
          How this works
        </AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          Select a property below, then tick the improvements you are considering.
          The planner will show estimated costs and the projected new EPC score.
          Use the budget filter to see what fits within your budget. Costs are
          indicative ranges based on typical UK prices.
        </AlertDescription>
      </Alert>

      {/* Main content: planner + sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpgradePlanner properties={properties} />
        </div>
        <div className="space-y-6">
          <CostCapTracker spent={costCapSpent} />

          {/* Disclaimer */}
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/5">
            <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">
              Estimates Only
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              All costs and point gains are indicative estimates. Actual results
              will depend on property specifics, installer quotes, and the EPC
              assessor&apos;s methodology. Always obtain professional assessments.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
