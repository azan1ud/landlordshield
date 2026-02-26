import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { GrantsFunding } from "@/components/epc/GrantsFunding";
import { EPC_GRANTS } from "@/lib/constants/epc-improvements";
import {
  ArrowLeft,
  Info,
  Percent,
  Landmark,
  ExternalLink,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Page (server component)
// ---------------------------------------------------------------------------

export default function GrantsPage() {
  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <Button variant="ghost" size="sm" className="mb-2" asChild>
          <Link href="/epc">
            <ArrowLeft className="mr-1 size-4" />
            Back to EPC Overview
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Grants &amp; Funding Guide
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Government grants, schemes, and financial incentives to help fund EPC
          improvements.
        </p>
      </div>

      {/* Info alert */}
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/5">
        <Info className="size-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">
          Check eligibility and apply through official government schemes
        </AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          Grant availability and eligibility criteria may change. Always verify
          the latest information directly with the scheme provider or your local
          authority before making financial commitments.
        </AlertDescription>
      </Alert>

      {/* ---- Grant cards ---- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Available Grants &amp; Schemes
        </h2>
        <GrantsFunding grants={EPC_GRANTS} />
      </section>

      {/* ---- Additional info sections ---- */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* VAT reductions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Percent className="size-5 text-[#F59E0B]" />
              VAT Reductions on Energy-Saving Materials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Since April 2022, a <strong className="text-foreground">0% VAT rate</strong>{" "}
              applies to the installation of certain energy-saving materials in
              residential properties. This includes:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Insulation materials (loft, cavity wall, solid wall)</li>
              <li>Solar panels</li>
              <li>Heat pumps</li>
              <li>Draught stripping</li>
              <li>Heating controls (thermostats, TRVs)</li>
              <li>Hot water cylinder insulation</li>
            </ul>
            <p>
              The 0% rate is scheduled to remain until <strong className="text-foreground">March 2027</strong>,
              after which a 5% reduced rate will apply.
            </p>
          </CardContent>
        </Card>

        {/* Green finance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Landmark className="size-5 text-[#1E3A5F]" />
              Green Finance Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Several lenders offer specialist financing for energy efficiency
              improvements:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong className="text-foreground">Green mortgages</strong> - lower
                interest rates for energy-efficient properties (typically EPC
                A-C)
              </li>
              <li>
                <strong className="text-foreground">Green additional borrowing</strong>{" "}
                - borrow against your property specifically for energy
                improvements
              </li>
              <li>
                <strong className="text-foreground">Property Linked Finance</strong>{" "}
                - repayment linked to the property rather than the individual,
                transferring on sale
              </li>
              <li>
                <strong className="text-foreground">0% interest loans</strong>{" "}
                - some local authorities offer interest-free loans for specific
                improvements
              </li>
            </ul>
            <p>
              Check with your mortgage provider about green finance options, as
              criteria and availability vary.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ---- Helpful links ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Useful Resources</CardTitle>
          <CardDescription>
            Official sources for further information on grants and funding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-foreground">
                GOV.UK - Find Energy Grants and Ways to Save Energy
              </span>
            </li>
            <li className="flex items-center gap-2">
              <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-foreground">
                Simple Energy Advice - Free and Impartial Energy Advice
              </span>
            </li>
            <li className="flex items-center gap-2">
              <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-foreground">
                Energy Saving Trust - Grants and Loans
              </span>
            </li>
            <li className="flex items-center gap-2">
              <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-foreground">
                Ofgem - Great British Insulation Scheme
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
