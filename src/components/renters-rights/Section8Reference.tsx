"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { SECTION_8_GROUNDS } from "@/lib/constants/section8-grounds";
import {
  Search,
  Info,
  Shield,
  Scale,
  Clock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Section8Reference() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGrounds = useMemo(() => {
    if (!searchQuery.trim()) return SECTION_8_GROUNDS;

    const query = searchQuery.toLowerCase();
    return SECTION_8_GROUNDS.filter(
      (g) =>
        g.title.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query) ||
        `ground ${g.ground}`.includes(query) ||
        g.evidence.some((e) => e.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const mandatoryGrounds = useMemo(
    () => filteredGrounds.filter((g) => g.type === "mandatory"),
    [filteredGrounds]
  );

  const discretionaryGrounds = useMemo(
    () => filteredGrounds.filter((g) => g.type === "discretionary"),
    [filteredGrounds]
  );

  return (
    <div className="space-y-6">
      {/* Info alert */}
      <Alert className="border-[#16A34A]/30 bg-green-50 dark:border-green-500/20 dark:bg-green-500/5">
        <Info className="size-4 text-[#16A34A]" />
        <AlertTitle className="text-green-800 dark:text-green-300">
          Section 8 Replaces Section 21
        </AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-400">
          <p className="text-xs leading-relaxed">
            With the abolition of Section 21 (&quot;no-fault&quot; evictions) from 1 May
            2026, landlords must now use <strong>Section 8</strong> grounds for
            possession. These grounds require a valid reason and, in most cases,
            evidence to present to the court. Mandatory grounds must be granted
            by the court if proven; discretionary grounds are at the court&apos;s
            judgment.
          </p>
        </AlertDescription>
      </Alert>

      {/* Search bar */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search grounds by title, description, or evidence..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Mandatory Grounds */}
      {mandatoryGrounds.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Shield className="size-5 text-red-600" />
            <h2 className="text-lg font-semibold text-foreground">
              Mandatory Grounds
            </h2>
            <Badge
              variant="outline"
              className="border-transparent bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
            >
              Court must grant possession
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {mandatoryGrounds.map((ground) => (
              <GroundCard key={ground.ground} ground={ground} />
            ))}
          </div>
        </section>
      )}

      {/* Discretionary Grounds */}
      {discretionaryGrounds.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Scale className="size-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-foreground">
              Discretionary Grounds
            </h2>
            <Badge
              variant="outline"
              className="border-transparent bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
            >
              Court may grant possession
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {discretionaryGrounds.map((ground) => (
              <GroundCard key={ground.ground} ground={ground} />
            ))}
          </div>
        </section>
      )}

      {/* No results */}
      {filteredGrounds.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Search className="mx-auto size-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            No grounds found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ground Card sub-component
// ---------------------------------------------------------------------------

interface GroundCardProps {
  ground: (typeof SECTION_8_GROUNDS)[number];
}

function GroundCard({ ground }: GroundCardProps) {
  const isMandatory = ground.type === "mandatory";

  return (
    <Card
      className={cn(
        "border-l-4",
        isMandatory ? "border-l-red-500" : "border-l-amber-500"
      )}
    >
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-md text-xs font-bold text-white",
                isMandatory ? "bg-red-600" : "bg-amber-600"
              )}
            >
              {ground.ground % 1 === 0
                ? ground.ground
                : ground.ground.toFixed(1)}
            </span>
            <CardTitle className="text-sm">{ground.title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 border-transparent text-[11px]",
              isMandatory
                ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
            )}
          >
            {isMandatory ? "Mandatory" : "Discretionary"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {ground.description}
        </p>

        {/* Notice period */}
        <div className="flex items-center gap-1.5 text-xs">
          <Clock className="size-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Notice period:</span>
          <span className="font-medium text-foreground">
            {ground.noticePeriod}
          </span>
        </div>

        {/* Required evidence */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
            <FileText className="size-3.5" />
            <span>Required evidence:</span>
          </div>
          <ul className="space-y-1 pl-5">
            {ground.evidence.map((item, index) => (
              <li
                key={index}
                className="list-disc text-xs text-muted-foreground leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default Section8Reference;
