"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Sparkles,
  Lock,
  ExternalLink,
  PawPrint,
  Home,
  PoundSterling,
  Shield,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Template data
// ---------------------------------------------------------------------------

interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  action: "download" | "generate" | "link";
  actionLabel: string;
  disabled?: boolean;
  disabledReason?: string;
  requiredPlan?: "pro" | "portfolio";
  href?: string;
}

const TEMPLATES: DocumentTemplate[] = [
  {
    id: "information-sheet",
    title: "Government Information Sheet",
    description:
      "The official government information sheet that must be provided to all existing tenants by 31 May 2026. This will be published by the government in March 2026.",
    icon: FileText,
    iconColor: "text-[#16A34A]",
    action: "link",
    actionLabel: "Coming March 2026",
    disabled: true,
    disabledReason: "Available when the government publishes the sheet",
    href: "#",
  },
  {
    id: "section13-notice",
    title: "Section 13 Rent Increase Notice",
    description:
      "Generate a Section 13 notice to increase rent. The notice must give at least 2 months before the rent increase date and can only be used once per year.",
    icon: PoundSterling,
    iconColor: "text-blue-600",
    action: "generate",
    actionLabel: "Generate Notice",
    requiredPlan: "pro",
  },
  {
    id: "section8-notice",
    title: "Section 8 Notice (Grounds for Possession)",
    description:
      "Generate a Section 8 notice with selectable grounds for possession. Includes all mandatory and discretionary grounds with the correct notice periods.",
    icon: Shield,
    iconColor: "text-red-600",
    action: "generate",
    actionLabel: "Generate Notice",
    requiredPlan: "pro",
  },
  {
    id: "pet-consent",
    title: "Pet Consent Form",
    description:
      "A consent form for tenants requesting to keep a pet. Includes conditions for pet insurance requirements. Under the new rules, landlords cannot unreasonably refuse.",
    icon: PawPrint,
    iconColor: "text-amber-600",
    action: "download",
    actionLabel: "Download Template",
  },
  {
    id: "written-statement",
    title: "Written Statement of Terms",
    description:
      "A written statement of the terms of the tenancy, required for all new tenancies from 1 May 2026. Covers rent, deposit, responsibilities, and key tenancy details.",
    icon: ScrollText,
    iconColor: "text-[#1E3A5F]",
    action: "generate",
    actionLabel: "Generate Statement",
    requiredPlan: "portfolio",
  },
];

// ---------------------------------------------------------------------------
// Plan badge
// ---------------------------------------------------------------------------

function PlanBadge({ plan }: { plan: "pro" | "portfolio" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-transparent",
        plan === "pro"
          ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
          : "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400"
      )}
    >
      <Lock className="size-3" />
      {plan === "pro" ? "Pro" : "Portfolio"}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DocumentTemplates() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {TEMPLATES.map((template) => {
        const Icon = template.icon;

        return (
          <Card
            key={template.id}
            className={cn(
              "flex flex-col transition-shadow hover:shadow-md",
              template.disabled && "opacity-70"
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg bg-muted"
                    )}
                  >
                    <Icon className={cn("size-5", template.iconColor)} />
                  </div>
                  <CardTitle className="text-sm leading-tight">
                    {template.title}
                  </CardTitle>
                </div>
                {template.requiredPlan && (
                  <PlanBadge plan={template.requiredPlan} />
                )}
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {template.description}
              </p>

              <div>
                {template.disabled ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled
                  >
                    <Home className="size-4" />
                    {template.actionLabel}
                  </Button>
                ) : template.action === "download" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Download className="size-4" />
                    {template.actionLabel}
                  </Button>
                ) : template.action === "generate" ? (
                  <Button
                    size="sm"
                    className="w-full bg-[#1E3A5F] hover:bg-[#1E3A5F]/90 text-white"
                  >
                    <Sparkles className="size-4" />
                    {template.actionLabel}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a
                      href={template.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-4" />
                      {template.actionLabel}
                    </a>
                  </Button>
                )}

                {template.disabledReason && (
                  <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
                    {template.disabledReason}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default DocumentTemplates;
