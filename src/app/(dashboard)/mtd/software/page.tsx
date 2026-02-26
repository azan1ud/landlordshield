import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { SoftwareComparison } from "@/components/mtd/SoftwareComparison";
import { ArrowLeft, Laptop, Info, ExternalLink } from "lucide-react";

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------
export default function MtdSoftwarePage() {
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
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#2563EB]/10">
            <Laptop className="size-5 text-[#2563EB]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              MTD Software Comparison
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Compare HMRC-recognised software options for Making Tax Digital record-keeping and
              quarterly submissions.
            </p>
          </div>
        </div>
      </div>

      {/* Info alert */}
      <Alert className="border-[#2563EB]/20 bg-[#2563EB]/5">
        <Info className="size-4 text-[#2563EB]" />
        <AlertTitle className="text-[#1E3A5F] dark:text-white">
          Choosing MTD Software
        </AlertTitle>
        <AlertDescription>
          You must use HMRC-recognised software to keep digital records and submit quarterly updates
          under MTD for Income Tax. The software options below are all approved by HMRC and designed
          for landlords. Prices and features are indicative and may change &mdash; always verify on
          the provider&apos;s website.
        </AlertDescription>
      </Alert>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Laptop className="size-5 text-[#2563EB]" />
            HMRC-Recognised Software
          </CardTitle>
          <CardDescription>
            All software listed below is approved by HMRC for MTD for Income Tax.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SoftwareComparison />
        </CardContent>
      </Card>

      {/* Additional Guidance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Things to consider when choosing software</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#2563EB]" />
              <span>
                <strong className="text-foreground">Property-specific features:</strong> Some tools
                are built specifically for landlords with features like tenant management, property
                accounting, and receipt scanning.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#2563EB]" />
              <span>
                <strong className="text-foreground">Bank feed integration:</strong> Automatic bank
                transaction imports save significant time on bookkeeping.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#2563EB]" />
              <span>
                <strong className="text-foreground">Agent access:</strong> If you use a tax agent or
                accountant, ensure the software supports multi-user or agent access.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#2563EB]" />
              <span>
                <strong className="text-foreground">Scalability:</strong> Consider whether the
                software can handle your portfolio as it grows, including multiple properties and
                complex ownership structures.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#2563EB]" />
              <span>
                <strong className="text-foreground">Free trials:</strong> Most providers offer free
                trials. Test the software before committing to ensure it meets your needs.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* HMRC Link */}
      <div className="flex justify-center">
        <a
          href="https://www.gov.uk/guidance/find-software-thats-compatible-with-making-tax-digital-for-income-tax"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="gap-2">
            <ExternalLink className="size-4" />
            View full HMRC-approved software list on GOV.UK
          </Button>
        </a>
      </div>
    </div>
  );
}
