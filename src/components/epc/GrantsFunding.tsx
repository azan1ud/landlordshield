import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Banknote, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GrantItem {
  name: string;
  description: string;
  amount: string;
  eligibility: string;
}

export interface GrantsFundingProps {
  grants: readonly GrantItem[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GrantsFunding({ grants, className }: GrantsFundingProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {grants.map((grant) => (
        <Card key={grant.name} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base">{grant.name}</CardTitle>
              <Badge
                variant="outline"
                className="shrink-0 border-[#F59E0B] text-[#F59E0B]"
              >
                <Banknote className="mr-1 size-3" />
                {grant.amount}
              </Badge>
            </div>
            <CardDescription>{grant.description}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto space-y-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Eligibility
              </p>
              <p className="text-sm text-foreground">{grant.eligibility}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default GrantsFunding;
