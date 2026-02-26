"use client";

import React from "react";
import Link from "next/link";
import { Section8Reference } from "@/components/renters-rights/Section8Reference";
import { ArrowLeft, Scale } from "lucide-react";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Section8Page() {
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
          <Scale className="size-6 text-red-600" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Section 8 Grounds for Possession
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Reference guide to all available grounds for possession under the
          Renters&apos; Rights Act 2025. Use these instead of Section 21.
        </p>
      </div>

      {/* Section 8 Reference component */}
      <Section8Reference />
    </div>
  );
}
