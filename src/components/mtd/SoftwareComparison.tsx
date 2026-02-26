import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { MTD_SOFTWARE_COMPARISON } from "@/lib/constants/mtd-deadlines";

// ---------------------------------------------------------------------------
// Component (Server Component — no "use client")
// ---------------------------------------------------------------------------
export function SoftwareComparison() {
  return (
    <div className="relative w-full overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#1E3A5F]/5 dark:bg-[#1E3A5F]/20">
            <TableHead className="min-w-[140px] font-semibold">Software</TableHead>
            <TableHead className="min-w-[120px] font-semibold">Pricing</TableHead>
            <TableHead className="min-w-[240px] font-semibold">Key Features</TableHead>
            <TableHead className="min-w-[100px] text-center font-semibold">
              HMRC Approved
            </TableHead>
            <TableHead className="min-w-[200px] font-semibold">Best For</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MTD_SOFTWARE_COMPARISON.map((software) => (
            <TableRow key={software.name}>
              <TableCell className="font-medium text-[#1E3A5F] dark:text-white">
                <div className="flex items-center gap-1.5">
                  {software.name}
                  <ExternalLink className="size-3 text-muted-foreground" />
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{software.pricing}</span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  {software.keyFeatures.map((feature) => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {software.hmrcApproved ? (
                  <div className="flex items-center justify-center">
                    <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">--</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{software.bestFor}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
