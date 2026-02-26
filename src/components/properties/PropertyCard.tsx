"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MapPin,
  PoundSterling,
  Home,
  Eye,
  Pencil,
} from "lucide-react";
import type { EpcRating, TenancyType } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PropertyCardData {
  id: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  postcode: string;
  monthlyRent: number | null;
  epcRating: EpcRating | null;
  tenancyType: TenancyType | null;
  tenancyStatus: "active" | "ended" | "notice_served" | "vacant";
  /** Compliance traffic lights: true = compliant, false = non-compliant, null = not applicable */
  compliance: {
    mtd: boolean | null;
    rr: boolean | null;
    epc: boolean | null;
  };
}

export interface PropertyCardProps {
  property: PropertyCardData;
  className?: string;
}

// ---------------------------------------------------------------------------
// EPC badge colour helpers
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
      return "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400";
  }
}

// ---------------------------------------------------------------------------
// Tenancy label helpers
// ---------------------------------------------------------------------------

const TENANCY_LABELS: Record<TenancyType, string> = {
  ast_fixed: "AST Fixed Term",
  ast_periodic: "AST Periodic",
  periodic_assured: "Periodic Assured",
};

const TENANCY_STATUS_LABELS: Record<string, string> = {
  active: "Occupied",
  ended: "Ended",
  notice_served: "Notice Served",
  vacant: "Vacant",
};

function getTenancyStatusClasses(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";
    case "notice_served":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
    case "ended":
      return "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400";
    case "vacant":
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

// ---------------------------------------------------------------------------
// Compliance dot component
// ---------------------------------------------------------------------------

interface ComplianceDotProps {
  label: string;
  color: string;
  filled: boolean | null;
}

function ComplianceDot({ label, color, filled }: ComplianceDotProps) {
  if (filled === null) return null;

  return (
    <div className="flex items-center gap-1.5" title={`${label}: ${filled ? "Compliant" : "Action needed"}`}>
      <span
        className={cn(
          "inline-block size-2.5 rounded-full border-2",
          filled
            ? `${color} border-transparent`
            : `border-current bg-transparent`
        )}
        style={
          !filled
            ? { borderColor: color.includes("bg-[")
                ? color.replace("bg-[", "").replace("]", "")
                : undefined }
            : undefined
        }
        aria-hidden="true"
      />
      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PropertyCard component
// ---------------------------------------------------------------------------

export function PropertyCard({ property, className }: PropertyCardProps) {
  const {
    id,
    addressLine1,
    city,
    postcode,
    monthlyRent,
    epcRating,
    tenancyType,
    tenancyStatus,
    compliance,
  } = property;

  return (
    <Card className={cn("flex flex-col justify-between", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">{addressLine1}</CardTitle>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">
                {city}, {postcode}
              </span>
            </div>
          </div>

          {/* EPC rating badge */}
          {epcRating && (
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 border-transparent text-xs font-bold",
                getEpcBadgeClasses(epcRating)
              )}
            >
              EPC {epcRating}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Rent */}
        <div className="flex items-center gap-2 text-sm">
          <PoundSterling className="size-4 text-muted-foreground" />
          <span className="font-semibold">
            {monthlyRent != null
              ? `${monthlyRent.toLocaleString("en-GB")} /mo`
              : "No rent set"}
          </span>
        </div>

        {/* Tenancy info */}
        <div className="flex flex-wrap items-center gap-2">
          {tenancyType && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Home className="size-3.5 shrink-0" />
              <span>{TENANCY_LABELS[tenancyType]}</span>
            </div>
          )}
          <Badge
            variant="outline"
            className={cn(
              "border-transparent text-xs",
              getTenancyStatusClasses(tenancyStatus)
            )}
          >
            {TENANCY_STATUS_LABELS[tenancyStatus] ?? tenancyStatus}
          </Badge>
        </div>

        {/* Compliance traffic lights */}
        <div className="flex items-center gap-4 pt-1">
          <ComplianceDot
            label="MTD"
            color="bg-[#2563EB]"
            filled={compliance.mtd}
          />
          <ComplianceDot
            label="RR"
            color="bg-[#16A34A]"
            filled={compliance.rr}
          />
          <ComplianceDot
            label="EPC"
            color="bg-[#F59E0B]"
            filled={compliance.epc}
          />
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="default" size="sm" asChild>
          <Link href={`/properties/${id}`}>
            <Eye className="size-4" />
            View Details
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/properties/${id}?edit=true`}>
            <Pencil className="size-4" />
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PropertyCard;
