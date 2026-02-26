"use client";

import React from "react";
import Link from "next/link";
import { RentIncreaseCalc } from "@/components/renters-rights/RentIncreaseCalc";
import { ArrowLeft, Calculator } from "lucide-react";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RentIncreasePage() {
  return (
    <div className="space-y-6">
      {/* Back + heading */}
      <div>
        <Link
          href="/renters-rights"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Renters&apos; Rights
        </Link>
        <div className="flex items-center gap-2">
          <Calculator className="size-6 text-[#16A34A]" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Rent Increase Calculator
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Calculate rent increases and generate Section 13 notice timelines.
          Under the Renters&apos; Rights Act, rent can only be increased once per
          year with at least 2 months&apos; notice.
        </p>
      </div>

      {/* Rent Increase Calculator component */}
      <RentIncreaseCalc />
    </div>
  );
}
