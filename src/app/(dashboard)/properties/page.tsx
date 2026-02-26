"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyCard, type PropertyCardData } from "@/components/properties/PropertyCard";
import {
  Plus,
  Search,
  Building2,
  SlidersHorizontal,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { EpcRating, TenancyType, Property } from "@/types";

// ---------------------------------------------------------------------------
// Helper: transform Supabase property row to PropertyCardData
// ---------------------------------------------------------------------------

function toPropertyCardData(p: Property): PropertyCardData {
  const latestEpc = p.epc_records?.[0] ?? null;
  const activeTenancy = p.tenancies?.find((t) => t.status === "active") ?? p.tenancies?.[0] ?? null;

  // Determine tenancy status
  let tenancyStatus: "active" | "ended" | "notice_served" | "vacant" = "vacant";
  if (activeTenancy) {
    tenancyStatus = activeTenancy.status as "active" | "ended" | "notice_served";
  }

  // Determine EPC compliance (A, B, C = compliant)
  const epcRating = (latestEpc?.current_rating as EpcRating) ?? null;
  const epcCompliant = epcRating ? ["A", "B", "C"].includes(epcRating) : null;

  return {
    id: p.id,
    addressLine1: p.address_line1,
    addressLine2: p.address_line2,
    city: p.city,
    postcode: p.postcode,
    monthlyRent: p.monthly_rent,
    epcRating,
    tenancyType: (activeTenancy?.tenancy_type as TenancyType) ?? null,
    tenancyStatus,
    compliance: {
      mtd: null, // Will be determined by checklist items - null means not applicable at property card level
      rr: null,
      epc: epcCompliant,
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PropertiesPage() {
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [epcFilter, setEpcFilter] = useState<EpcRating | "all">("all");
  const [tenancyFilter, setTenancyFilter] = useState<TenancyType | "all">("all");

  // -----------------------------------------------------------------------
  // Fetch properties from Supabase
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setDataLoading(false);
      return;
    }

    let cancelled = false;
    const supabase = createClient();

    async function fetchProperties() {
      try {
        const { data, error: fetchError } = await supabase
          .from("properties")
          .select("*, epc_records(*), tenancies(*)")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false });

        if (cancelled) return;

        if (fetchError) {
          setError(fetchError.message);
          setDataLoading(false);
          return;
        }

        setProperties((data as Property[]) ?? []);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load properties. Please try again.");
          console.error("Properties fetch error:", err);
        }
      } finally {
        if (!cancelled) {
          setDataLoading(false);
        }
      }
    }

    fetchProperties();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  // -----------------------------------------------------------------------
  // Transform and filter properties
  // -----------------------------------------------------------------------
  const propertyCards = useMemo(
    () => properties.map(toPropertyCardData),
    [properties]
  );

  const filteredProperties = useMemo(() => {
    return propertyCards.filter((p) => {
      // Search by address, city, or postcode
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          p.addressLine1.toLowerCase().includes(q) ||
          (p.addressLine2 && p.addressLine2.toLowerCase().includes(q)) ||
          p.city.toLowerCase().includes(q) ||
          p.postcode.toLowerCase().replace(/\s/g, "").includes(q.replace(/\s/g, ""));
        if (!matchesSearch) return false;
      }

      // EPC rating filter
      if (epcFilter !== "all" && p.epcRating !== epcFilter) return false;

      // Tenancy type filter
      if (tenancyFilter !== "all" && p.tenancyType !== tenancyFilter) return false;

      return true;
    });
  }, [propertyCards, searchQuery, epcFilter, tenancyFilter]);

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------
  if (authLoading || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading properties...
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

  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* Page header                                                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Properties
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your property portfolio and track compliance for each property.
          </p>
        </div>
        <Button asChild>
          <Link href="/properties/new">
            <Plus className="size-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Search & filter bar                                               */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by address, city or postcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="hidden size-4 text-muted-foreground sm:block" />

          <Select
            value={epcFilter}
            onValueChange={(val) => setEpcFilter(val as EpcRating | "all")}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="EPC Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All EPC</SelectItem>
              {(["A", "B", "C", "D", "E", "F", "G"] as EpcRating[]).map((r) => (
                <SelectItem key={r} value={r}>
                  EPC {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={tenancyFilter}
            onValueChange={(val) =>
              setTenancyFilter(val as TenancyType | "all")
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tenancy Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tenancies</SelectItem>
              <SelectItem value="ast_fixed">AST Fixed Term</SelectItem>
              <SelectItem value="ast_periodic">AST Periodic</SelectItem>
              <SelectItem value="periodic_assured">Periodic Assured</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Property grid / empty state                                       */}
      {/* ----------------------------------------------------------------- */}
      {filteredProperties.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <Building2 className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            {searchQuery || epcFilter !== "all" || tenancyFilter !== "all"
              ? "No properties match your filters"
              : "No properties yet"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery || epcFilter !== "all" || tenancyFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Add your first property to start tracking compliance."}
          </p>
          {!searchQuery && epcFilter === "all" && tenancyFilter === "all" && (
            <Button asChild className="mt-4">
              <Link href="/properties/new">
                <Plus className="size-4" />
                Add Property
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Results count */}
      {filteredProperties.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing {filteredProperties.length} of {propertyCards.length}{" "}
          {propertyCards.length === 1 ? "property" : "properties"}
        </p>
      )}
    </div>
  );
}
