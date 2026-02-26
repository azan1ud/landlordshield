"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  PortfolioOverview,
  EpcRatingBadge,
} from "@/components/epc/PortfolioOverview";
import { CostCapTracker } from "@/components/epc/CostCapTracker";
import { EPC_KEY_DATES } from "@/lib/constants/epc-improvements";
import {
  Zap,
  CalendarClock,
  AlertTriangle,
  ArrowRight,
  Building2,
  TrendingUp,
  FileCheck2,
  HandCoins,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { EpcRating, Property, EpcImprovement } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmt = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
});

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Sort worst-first: G, F, E, D, C, B, A, then null
const RATING_SORT_ORDER: Record<string, number> = {
  G: 0,
  F: 1,
  E: 2,
  D: 3,
  C: 4,
  B: 5,
  A: 6,
};

interface PropertyWithEpc {
  id: string;
  address: string;
  epcRating: EpcRating | null;
  epcScore: number | null;
  estimatedUpgradeCost: number;
}

function sortWorstFirst(a: PropertyWithEpc, b: PropertyWithEpc): number {
  const aOrder = a.epcRating ? (RATING_SORT_ORDER[a.epcRating] ?? -1) : -1;
  const bOrder = b.epcRating ? (RATING_SORT_ORDER[b.epcRating] ?? -1) : -1;
  return aOrder - bOrder;
}

function buildAddress(p: Property): string {
  return [p.address_line1, p.address_line2, p.city, p.postcode]
    .filter(Boolean)
    .join(", ");
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function EpcOverviewPage() {
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<PropertyWithEpc[]>([]);
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

        // Fetch all epc_improvements for the user's properties to calculate cost cap spending
        const propertyIds = (propertiesData ?? []).map((p: Property) => p.id);

        let improvements: EpcImprovement[] = [];
        if (propertyIds.length > 0) {
          const { data: improvementsData, error: impError } = await supabase
            .from("epc_improvements")
            .select("*")
            .in("property_id", propertyIds);

          if (impError) throw impError;
          improvements = improvementsData ?? [];
        }

        // Calculate total cost cap spending (only completed improvements that count toward cap)
        const totalSpent = improvements
          .filter((imp) => imp.counts_toward_cap && imp.status === "completed")
          .reduce((sum, imp) => sum + (imp.actual_cost ?? imp.estimated_cost ?? 0), 0);

        setCostCapSpent(totalSpent);

        // Map properties to the shape we need
        const mapped: PropertyWithEpc[] = (propertiesData ?? []).map(
          (p: Property & { epc_records?: Array<{ current_rating: EpcRating | null; current_score: number | null }> }) => {
            const latestEpc = p.epc_records?.[0] ?? null;
            // Calculate estimated upgrade cost from planned improvements for this property
            const propImprovements = improvements.filter(
              (imp) => imp.property_id === p.id && imp.status !== "completed"
            );
            const estimatedUpgradeCost = propImprovements.reduce(
              (sum, imp) => sum + (imp.estimated_cost ?? 0),
              0
            );

            return {
              id: p.id,
              address: buildAddress(p),
              epcRating: latestEpc?.current_rating ?? null,
              epcScore: latestEpc?.current_score ?? null,
              estimatedUpgradeCost,
            };
          }
        );

        setProperties(mapped);
      } catch (err) {
        console.error("Failed to fetch EPC data:", err);
        setError("Failed to load EPC data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, authLoading]);

  const totalUpgradeCost = useMemo(
    () => properties.reduce((sum, p) => sum + p.estimatedUpgradeCost, 0),
    [properties]
  );

  const sorted = useMemo(
    () => [...properties].sort(sortWorstFirst),
    [properties]
  );

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            EPC Compliance
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

  // Empty state
  if (properties.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              EPC Compliance
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Portfolio energy performance overview and compliance tracker.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="size-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No properties yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first property to start tracking EPC compliance.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/properties">Add Property</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            EPC Compliance
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Portfolio energy performance overview and compliance tracker.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/epc/upgrade-planner">
              <TrendingUp className="mr-1 size-4" />
              Upgrade Planner
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/epc/grants">
              <HandCoins className="mr-1 size-4" />
              Grants
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/epc/exemptions">
              <FileCheck2 className="mr-1 size-4" />
              Exemptions
            </Link>
          </Button>
        </div>
      </div>

      {/* ---- Portfolio chart + Cost cap side-by-side ---- */}
      <div className="grid gap-6 lg:grid-cols-3">
        <PortfolioOverview
          properties={properties}
          className="lg:col-span-2"
        />
        <div className="space-y-6">
          <CostCapTracker spent={costCapSpent} />

          {/* Total estimated upgrade cost */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="size-5 text-[#F59E0B]" />
                Total Upgrade Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {fmt.format(totalUpgradeCost)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Estimated cost to bring all non-compliant properties to Band C.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ---- Key Dates ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="size-5 text-[#1E3A5F]" />
            Key EPC Dates
          </CardTitle>
          <CardDescription>
            Important deadlines for EPC compliance under the proposed
            regulations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Spending Cap Start
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {formatDate(EPC_KEY_DATES.spendingCapStart)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs font-medium text-muted-foreground">
                New HEM Methodology
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {formatDate(EPC_KEY_DATES.newHemMethodology)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Final Compliance Deadline
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {formatDate(EPC_KEY_DATES.finalDeadline)}
              </p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-500/20 dark:bg-red-500/5">
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                Non-Compliance Fine
              </p>
              <p className="mt-1 text-sm font-semibold text-red-700 dark:text-red-300">
                Up to {fmt.format(EPC_KEY_DATES.nonComplianceFine)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---- Property list ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="size-5 text-[#1E3A5F]" />
            Properties by EPC Rating
          </CardTitle>
          <CardDescription>
            Sorted worst-first so you can prioritise the properties that need
            the most attention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {sorted.map((property) => {
              const isCompliant =
                property.epcRating === "A" ||
                property.epcRating === "B" ||
                property.epcRating === "C";

              return (
                <div
                  key={property.id}
                  className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <EpcRatingBadge
                    rating={property.epcRating}
                    score={property.epcScore}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {property.address}
                    </p>
                    {!isCompliant && property.estimatedUpgradeCost > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Est. upgrade: {fmt.format(property.estimatedUpgradeCost)}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {isCompliant ? (
                      <Badge
                        variant="outline"
                        className="border-green-200 text-green-700 dark:border-green-500/30 dark:text-green-400"
                      >
                        Compliant
                      </Badge>
                    ) : (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/epc/upgrade-planner">
                          Plan Upgrade
                          <ArrowRight className="ml-1 size-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ---- Disclaimer ---- */}
      <Alert className="border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/5">
        <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-800 dark:text-amber-300">
          Important Disclaimer
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-400">
          EPC compliance requirements are based on proposed government
          regulations which may change. Costs are estimates only. Always obtain
          professional assessments and quotes for improvement works.
        </AlertDescription>
      </Alert>
    </div>
  );
}
