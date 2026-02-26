"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EPC_RATING_BANDS } from "@/lib/constants/epc-improvements";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EpcRating } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PortfolioProperty {
  id: string;
  address: string;
  epcRating: EpcRating | null;
  epcScore: number | null;
}

export interface PortfolioOverviewProps {
  properties: PortfolioProperty[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type BandKey = keyof typeof EPC_RATING_BANDS;
const BAND_ORDER: BandKey[] = ["A", "B", "C", "D", "E", "F", "G"];

function getBandColor(band: BandKey): string {
  return EPC_RATING_BANDS[band].color;
}

function countByBand(properties: PortfolioProperty[]) {
  const counts: Record<string, number> = {};
  for (const b of BAND_ORDER) counts[b] = 0;
  counts["None"] = 0;

  for (const p of properties) {
    if (p.epcRating && counts[p.epcRating] !== undefined) {
      counts[p.epcRating]++;
    } else {
      counts["None"]++;
    }
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PortfolioOverview({
  properties,
  className,
}: PortfolioOverviewProps) {
  const counts = countByBand(properties);
  const total = properties.length;
  const maxCount = Math.max(...Object.values(counts), 1);

  const compliant = (counts["A"] ?? 0) + (counts["B"] ?? 0) + (counts["C"] ?? 0);
  const needAction = (counts["D"] ?? 0) + (counts["E"] ?? 0);
  const nonCompliant = (counts["F"] ?? 0) + (counts["G"] ?? 0);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="size-5 text-[#F59E0B]" />
          EPC Portfolio Breakdown
        </CardTitle>
        <CardDescription>
          Distribution of {total} {total === 1 ? "property" : "properties"} by
          EPC band
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ---- Horizontal bar chart ---- */}
        <div className="space-y-2">
          {BAND_ORDER.map((band) => {
            const count = counts[band] ?? 0;
            const pct = total > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div key={band} className="flex items-center gap-3">
                <span
                  className="w-20 text-sm font-medium"
                  style={{ color: getBandColor(band) }}
                >
                  {EPC_RATING_BANDS[band].label}
                </span>
                <div className="flex-1">
                  <div className="relative h-6 w-full rounded bg-muted/40">
                    <div
                      className="absolute inset-y-0 left-0 rounded transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: getBandColor(band),
                        minWidth: count > 0 ? "1.5rem" : 0,
                      }}
                    />
                  </div>
                </div>
                <span className="w-6 text-right text-sm font-semibold text-foreground">
                  {count}
                </span>
              </div>
            );
          })}

          {/* No EPC */}
          {(counts["None"] ?? 0) > 0 && (
            <div className="flex items-center gap-3">
              <span className="w-20 text-sm font-medium text-muted-foreground">
                No EPC
              </span>
              <div className="flex-1">
                <div className="relative h-6 w-full rounded bg-muted/40">
                  <div
                    className="absolute inset-y-0 left-0 rounded bg-gray-400 transition-all duration-500"
                    style={{
                      width: `${((counts["None"] ?? 0) / maxCount) * 100}%`,
                      minWidth: "1.5rem",
                    }}
                  />
                </div>
              </div>
              <span className="w-6 text-right text-sm font-semibold text-foreground">
                {counts["None"]}
              </span>
            </div>
          )}
        </div>

        {/* ---- Summary stats ---- */}
        <div className="grid grid-cols-3 gap-4 border-t pt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{compliant}</p>
            <p className="text-xs text-muted-foreground">Compliant (A-C)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-500">{needAction}</p>
            <p className="text-xs text-muted-foreground">Need Action (D-E)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">{nonCompliant}</p>
            <p className="text-xs text-muted-foreground">
              Non-Compliant (F-G)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// EPC Rating Badge — shared small helper
// ---------------------------------------------------------------------------

export function EpcRatingBadge({
  rating,
  score,
}: {
  rating: EpcRating | null;
  score?: number | null;
}) {
  if (!rating) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        No EPC
      </Badge>
    );
  }

  const band = EPC_RATING_BANDS[rating];

  return (
    <Badge
      className="border-0 text-white"
      style={{ backgroundColor: band.color }}
    >
      {rating}
      {score !== undefined && score !== null && ` (${score})`}
    </Badge>
  );
}

export default PortfolioOverview;
