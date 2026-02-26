"use client";

import React from "react";
import Link from "next/link";
import { DocumentTemplates } from "@/components/renters-rights/DocumentTemplates";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, FileText, Info } from "lucide-react";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TemplatesPage() {
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
          <FileText className="size-6 text-[#1E3A5F]" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Document Templates
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Download and generate compliant notices, forms, and statements for the
          Renters&apos; Rights Act.
        </p>
      </div>

      {/* Info about templates */}
      <Alert className="border-[#1E3A5F]/20 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/5">
        <Info className="size-4 text-[#1E3A5F]" />
        <AlertTitle className="text-[#1E3A5F] dark:text-blue-300">
          About These Templates
        </AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          <p className="text-xs leading-relaxed">
            These templates are designed to help you comply with the Renters&apos;
            Rights Act 2025. Some templates require a <strong>Pro</strong> or{" "}
            <strong>Portfolio</strong> subscription. Generated documents
            should be reviewed by a qualified legal professional before use.
          </p>
        </AlertDescription>
      </Alert>

      {/* Template cards */}
      <DocumentTemplates />
    </div>
  );
}
