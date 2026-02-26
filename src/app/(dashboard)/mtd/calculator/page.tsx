"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThresholdCalculator } from "@/components/mtd/ThresholdCalculator";
import { ArrowLeft } from "lucide-react";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function MtdCalculatorPage() {
  return (
    <div className="space-y-6">
      {/* Back nav + heading */}
      <div>
        <Link href="/mtd">
          <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground">
            <ArrowLeft className="size-4" />
            Back to MTD Overview
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Am I Affected by MTD?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your income details below to find out whether Making Tax Digital for Income Tax
          applies to you, and which phase you fall under.
        </p>
      </div>

      {/* Calculator Component */}
      <ThresholdCalculator />
    </div>
  );
}
