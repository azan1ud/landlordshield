"use client";

import React, { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  CertificateTracker,
  type CertificateRecord,
} from "@/components/properties/CertificateTracker";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Pencil,
  MapPin,
  Home,
  Bed,
  PoundSterling,
  Zap,
  Users,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Calendar,
  FileText,
  TrendingUp,
  Landmark,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type {
  Property,
  ChecklistItem,
  EpcRating,
  TenancyType,
  CertificateStatus,
  CertificateType,
  Pillar,
  ComplianceStatus,
} from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getEpcBadgeClasses(rating: EpcRating): string {
  switch (rating) {
    case "A":
    case "B":
    case "C":
      return "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400";
    case "D":
      return "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400";
    case "E":
      return "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-400";
    case "F":
    case "G":
      return "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function getScoreColor(score: number): string {
  if (score >= 75) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getStatusFromScore(score: number): ComplianceStatus {
  if (score >= 80) return "ready";
  if (score >= 40) return "partial";
  return "not_ready";
}

function getStatusBadge(status: ComplianceStatus) {
  const config = {
    ready: {
      label: "Ready",
      classes: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    },
    partial: {
      label: "Partial",
      classes: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    },
    not_ready: {
      label: "Not Ready",
      classes: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    },
  };
  const c = config[status];
  return (
    <Badge variant="outline" className={cn("border-transparent text-xs", c.classes)}>
      {c.label}
    </Badge>
  );
}

const TENANCY_LABELS: Record<TenancyType, string> = {
  ast_fixed: "AST Fixed Term",
  ast_periodic: "AST Periodic",
  periodic_assured: "Periodic Assured",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "--";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const PILLAR_LABELS: Record<Pillar, { label: string; color: string }> = {
  mtd: { label: "Making Tax Digital", color: "bg-blue-600" },
  renters_rights: { label: "Renters' Rights", color: "bg-green-600" },
  epc: { label: "EPC Compliance", color: "bg-amber-500" },
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house: "House",
  flat: "Flat",
  hmo: "HMO",
  studio: "Studio",
  bungalow: "Bungalow",
  maisonette: "Maisonette",
  other: "Other",
};

const FURNISHED_LABELS: Record<string, string> = {
  furnished: "Furnished",
  part_furnished: "Part-furnished",
  unfurnished: "Unfurnished",
};

const OWNERSHIP_LABELS: Record<string, string> = {
  sole: "Sole Owner",
  joint: "Joint Owner",
  limited_company: "Limited Company",
};

// ---------------------------------------------------------------------------
// Property Detail Page
// ---------------------------------------------------------------------------

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const [property, setProperty] = useState<Property | null>(null);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Fetch property and related data
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setDataLoading(false);
      return;
    }

    let cancelled = false;
    const supabase = createClient();

    async function fetchPropertyData() {
      try {
        // Fetch property with joined data
        const { data: propData, error: propError } = await supabase
          .from("properties")
          .select("*, tenancies(*), epc_records(*), certificates(*)")
          .eq("id", propertyId)
          .eq("user_id", user!.id)
          .single();

        if (cancelled) return;

        if (propError) {
          if (propError.code === "PGRST116") {
            // No rows found
            setNotFound(true);
          } else {
            setError(propError.message);
          }
          setDataLoading(false);
          return;
        }

        if (!propData) {
          setNotFound(true);
          setDataLoading(false);
          return;
        }

        // Fetch checklist items for this user (both property-specific and global)
        const { data: checklistData, error: checklistError } = await supabase
          .from("checklist_items")
          .select("*")
          .eq("user_id", user!.id)
          .or(`property_id.eq.${propertyId},property_id.is.null`)
          .order("created_at", { ascending: true });

        if (cancelled) return;

        setProperty(propData as Property);
        setChecklistItems(
          checklistError ? [] : ((checklistData as ChecklistItem[]) ?? [])
        );
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load property details. Please try again.");
          console.error("Property detail fetch error:", err);
        }
      } finally {
        if (!cancelled) {
          setDataLoading(false);
        }
      }
    }

    fetchPropertyData();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, propertyId]);

  // -----------------------------------------------------------------------
  // Derived data
  // -----------------------------------------------------------------------
  const latestEpc = property?.epc_records?.[0] ?? null;
  const activeTenancy =
    property?.tenancies?.find((t) => t.status === "active") ??
    property?.tenancies?.[0] ??
    null;

  const certificates: CertificateRecord[] = useMemo(() => {
    if (!property?.certificates) return [];
    return property.certificates.map((cert) => ({
      certType: cert.cert_type as CertificateType,
      status: cert.status as CertificateStatus,
      issuedDate: cert.issued_date,
      expiryDate: cert.expiry_date,
      provider: cert.provider,
      referenceNumber: cert.reference_number,
      documentUrl: cert.document_url,
      documentPath: cert.document_url,
    }));
  }, [property?.certificates]);

  // Compute compliance scores from checklist items
  const pillarScores = useMemo(() => {
    const pillars: Pillar[] = ["mtd", "renters_rights", "epc"];
    const scores: Record<Pillar, { score: number; status: ComplianceStatus }> = {
      mtd: { score: 0, status: "not_ready" },
      renters_rights: { score: 0, status: "not_ready" },
      epc: { score: 0, status: "not_ready" },
    };

    for (const pillar of pillars) {
      const items = checklistItems.filter((i) => i.pillar === pillar);
      if (items.length === 0) continue;
      const completed = items.filter((i) => i.is_completed).length;
      const score = Math.round((completed / items.length) * 100);
      scores[pillar] = { score, status: getStatusFromScore(score) };
    }

    return scores;
  }, [checklistItems]);

  const overallComplianceScore = useMemo(() => {
    const { mtd, renters_rights, epc } = pillarScores;
    return Math.round(mtd.score * 0.35 + renters_rights.score * 0.4 + epc.score * 0.25);
  }, [pillarScores]);

  const completedItems = checklistItems.filter((i) => i.is_completed).length;
  const totalItems = checklistItems.length;

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------
  if (authLoading || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading property details...
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
  // Not found state
  // -----------------------------------------------------------------------
  if (notFound || !property) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Building2 className="size-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Property not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The property you are looking for does not exist or has been removed.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/properties">
            <ArrowLeft className="size-4" />
            Back to Properties
          </Link>
        </Button>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Derived display values
  // -----------------------------------------------------------------------
  const epcRating = (latestEpc?.current_rating as EpcRating) ?? null;
  const propertyType = property.property_type
    ? PROPERTY_TYPE_LABELS[property.property_type] ?? property.property_type
    : "Unknown";
  const bedrooms = property.bedrooms ?? 0;
  const monthlyRent = property.monthly_rent ?? 0;
  const furnishedStatus = property.is_furnished
    ? FURNISHED_LABELS[property.is_furnished] ?? property.is_furnished
    : "Not specified";
  const ownershipType = property.ownership_type
    ? OWNERSHIP_LABELS[property.ownership_type] ?? property.ownership_type
    : "Not specified";
  const tenancyType = (activeTenancy?.tenancy_type as TenancyType) ?? null;
  const tenancyStatus = (activeTenancy?.status ?? "vacant") as
    | "active"
    | "ended"
    | "notice_served"
    | "vacant";
  const tenantNames = activeTenancy?.tenant_name ?? "No tenant";
  const mortgageMonthly = property.mortgage_monthly ?? 0;

  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* Page header                                                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/properties">
                <ArrowLeft className="size-4" />
                Back to Properties
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {property.address_line1}
          </h1>
          {property.address_line2 && (
            <p className="text-sm text-muted-foreground">
              {property.address_line2}
            </p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {property.city}, {property.postcode}
            </span>
            <span className="flex items-center gap-1">
              <Home className="size-3.5" />
              {propertyType}
            </span>
            <span className="flex items-center gap-1">
              <Bed className="size-3.5" />
              {bedrooms} bed{bedrooms !== 1 ? "s" : ""}
            </span>
            {epcRating && (
              <Badge
                variant="outline"
                className={cn(
                  "border-transparent text-xs font-bold",
                  getEpcBadgeClasses(epcRating)
                )}
              >
                EPC {epcRating}
              </Badge>
            )}
          </div>
        </div>

        <Button asChild variant="outline">
          <Link href={`/properties/new?edit=${propertyId}`}>
            <Pencil className="size-4" />
            Edit Property
          </Link>
        </Button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Tabs                                                               */}
      {/* ----------------------------------------------------------------- */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="tenancy">Tenancy</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* OVERVIEW TAB                                                    */}
        {/* ============================================================== */}
        <TabsContent value="overview" className="space-y-6 pt-4">
          {/* Compliance score summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Overall score */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Property Compliance Score</CardDescription>
                <CardTitle
                  className={cn("text-3xl font-bold", getScoreColor(overallComplianceScore))}
                >
                  {overallComplianceScore}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all",
                      overallComplianceScore >= 75
                        ? "bg-green-500"
                        : overallComplianceScore >= 50
                          ? "bg-amber-500"
                          : "bg-red-500"
                    )}
                    style={{ width: `${overallComplianceScore}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {completedItems} of {totalItems} checklist items completed
                </p>
              </CardContent>
            </Card>

            {/* Pillar scores */}
            {(["mtd", "renters_rights", "epc"] as Pillar[]).map((pillar) => {
              const ps = pillarScores[pillar];
              return (
                <Card key={pillar}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "size-2.5 rounded-full",
                          PILLAR_LABELS[pillar].color
                        )}
                      />
                      <CardDescription>{PILLAR_LABELS[pillar].label}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <CardTitle
                        className={cn("text-2xl font-bold", getScoreColor(ps.score))}
                      >
                        {ps.score}%
                      </CardTitle>
                      {getStatusBadge(ps.status)}
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Property info summary */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="size-4" />
                  Property Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-medium">{propertyType}</dd>

                  <dt className="text-muted-foreground">Bedrooms</dt>
                  <dd className="font-medium">{bedrooms}</dd>

                  <dt className="text-muted-foreground">Furnished</dt>
                  <dd className="font-medium">{furnishedStatus}</dd>

                  <dt className="text-muted-foreground">Ownership</dt>
                  <dd className="font-medium">{ownershipType}</dd>

                  <dt className="text-muted-foreground">HMO Licence</dt>
                  <dd className="font-medium">
                    {property.hmo_licence_required ? "Required" : "Not Required"}
                  </dd>

                  <dt className="text-muted-foreground">Managing Agent</dt>
                  <dd className="font-medium">
                    {property.managing_agent ?? "Self-managed"}
                  </dd>
                </dl>
              </CardContent>
            </Card>

            {/* Quick actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="size-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => setActiveTab("certificates")}>
                  <FileText className="size-4" />
                  Upload Certificate
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => router.push("/mtd/income-expenses")}>
                  <TrendingUp className="size-4" />
                  Record Income / Expense
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => setActiveTab("tenancy")}>
                  <Users className="size-4" />
                  Update Tenant Details
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => setActiveTab("compliance")}>
                  <ShieldCheck className="size-4" />
                  Run Compliance Check
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* COMPLIANCE TAB                                                  */}
        {/* ============================================================== */}
        <TabsContent value="compliance" className="space-y-6 pt-4">
          {checklistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
              <ShieldCheck className="size-12 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">
                No compliance checklist items found. Visit the Dashboard to set
                up your checklist.
              </p>
            </div>
          ) : (
            /* Group by pillar */
            (["mtd", "renters_rights", "epc"] as Pillar[]).map((pillar) => {
              const items = checklistItems.filter((i) => i.pillar === pillar);
              if (items.length === 0) return null;
              const done = items.filter((i) => i.is_completed).length;

              return (
                <Card key={pillar}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "size-3 rounded-full",
                            PILLAR_LABELS[pillar].color
                          )}
                        />
                        <CardTitle className="text-base">
                          {PILLAR_LABELS[pillar].label}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {done}/{items.length} complete
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-start gap-3">
                          {item.is_completed ? (
                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                          ) : (
                            <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm font-medium",
                                item.is_completed && "line-through text-muted-foreground"
                              )}
                            >
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            )}
                            {item.due_date && !item.is_completed && (
                              <p className="mt-1 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                                <Calendar className="size-3" />
                                Due: {formatDate(item.due_date)}
                              </p>
                            )}
                          </div>
                          {!item.is_completed && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "shrink-0 border-transparent text-[10px]",
                                item.priority === "critical" &&
                                  "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
                                item.priority === "high" &&
                                  "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
                                item.priority === "medium" &&
                                  "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
                                item.priority === "low" &&
                                  "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400"
                              )}
                            >
                              {item.priority}
                            </Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* ============================================================== */}
        {/* CERTIFICATES TAB                                                */}
        {/* ============================================================== */}
        <TabsContent value="certificates" className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Certificates & Documents</h2>
              <p className="text-sm text-muted-foreground">
                Track all required and recommended certificates for this property.
              </p>
            </div>
            <Button size="sm">
              <FileText className="size-4" />
              Add Certificate
            </Button>
          </div>

          <CertificateTracker
            certificates={certificates}
            isHmo={property.hmo_licence_required}
            userId={user?.id}
            propertyId={propertyId}
          />
        </TabsContent>

        {/* ============================================================== */}
        {/* TENANCY TAB                                                     */}
        {/* ============================================================== */}
        <TabsContent value="tenancy" className="space-y-6 pt-4">
          {activeTenancy ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="size-4" />
                  Current Tenancy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Tenancy Type</dt>
                    <dd className="mt-0.5 font-medium">
                      {tenancyType ? TENANCY_LABELS[tenancyType] : "Not specified"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="mt-0.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-transparent text-xs",
                          tenancyStatus === "active" &&
                            "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
                          tenancyStatus === "notice_served" &&
                            "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
                          tenancyStatus === "ended" &&
                            "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
                          tenancyStatus === "vacant" &&
                            "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                        )}
                      >
                        {tenancyStatus === "active"
                          ? "Active"
                          : tenancyStatus === "notice_served"
                            ? "Notice Served"
                            : tenancyStatus === "ended"
                              ? "Ended"
                              : "Vacant"}
                      </Badge>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">Start Date</dt>
                    <dd className="mt-0.5 font-medium">
                      {formatDate(activeTenancy.start_date)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">Monthly Rent</dt>
                    <dd className="mt-0.5 font-medium">
                      £{(activeTenancy.current_rent ?? monthlyRent).toLocaleString("en-GB")}
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Tenant(s)</dt>
                    <dd className="mt-0.5 font-medium">
                      {tenantNames}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
              <Users className="size-12 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">
                No tenancy records found for this property.
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                <Users className="size-4" />
                Add Tenancy
              </Button>
            </div>
          )}

          {tenancyStatus === "notice_served" && (
            <Alert className="border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/5">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">
                Notice Served
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                A notice has been served on this tenancy. Ensure you follow the
                correct process under the Renters&apos; Rights Bill. Section 21
                (no-fault eviction) notices are being abolished.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* ============================================================== */}
        {/* FINANCES TAB                                                    */}
        {/* ============================================================== */}
        <TabsContent value="finances" className="space-y-6 pt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Monthly Rent</CardDescription>
                <CardTitle className="text-2xl font-bold">
                  £{monthlyRent.toLocaleString("en-GB")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  £{(monthlyRent * 12).toLocaleString("en-GB")} / year
                </p>
              </CardContent>
            </Card>

            {property.has_mortgage && mortgageMonthly > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>
                    <span className="flex items-center gap-1">
                      <Landmark className="size-3" />
                      Mortgage
                    </span>
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    £{mortgageMonthly.toLocaleString("en-GB")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    £{(mortgageMonthly * 12).toLocaleString("en-GB")} / year
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Net Monthly Income</CardDescription>
                <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                  £
                  {(monthlyRent - mortgageMonthly).toLocaleString("en-GB")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Before other expenses
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PoundSterling className="size-4" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Income and expenses for this property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <PoundSterling className="size-12 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No transactions recorded yet for this property.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  <TrendingUp className="size-4" />
                  Record Transaction
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
