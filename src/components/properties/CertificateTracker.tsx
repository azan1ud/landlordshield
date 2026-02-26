"use client";

import React from "react";
import { CERTIFICATE_TYPES } from "@/lib/constants/certificate-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
} from "lucide-react";
import type { CertificateStatus, CertificateType } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CertificateRecord {
  certType: CertificateType;
  status: CertificateStatus;
  issuedDate: string | null;
  expiryDate: string | null;
  provider?: string | null;
  referenceNumber?: string | null;
}

export interface CertificateTrackerProps {
  certificates: CertificateRecord[];
  /** Whether the property is an HMO (shows HMO licence row) */
  isHmo?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Status badge helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  CertificateStatus,
  { label: string; icon: React.ElementType; classes: string }
> = {
  valid: {
    label: "Valid",
    icon: CheckCircle2,
    classes:
      "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  },
  expiring_soon: {
    label: "Expiring Soon",
    icon: Clock,
    classes:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  expired: {
    label: "Expired",
    icon: XCircle,
    classes: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  },
  missing: {
    label: "Missing",
    icon: HelpCircle,
    classes:
      "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
  },
};

function StatusBadgeInline({ status }: { status: CertificateStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("border-transparent text-xs font-medium gap-1", config.classes)}
    >
      <Icon className="size-3" />
      {config.label}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Helper: format date
// ---------------------------------------------------------------------------

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "--";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// CertificateTracker component
// ---------------------------------------------------------------------------

export function CertificateTracker({
  certificates,
  isHmo = false,
  className,
}: CertificateTrackerProps) {
  // Build a map from cert type to the actual record
  const certMap = new Map<CertificateType, CertificateRecord>();
  for (const cert of certificates) {
    certMap.set(cert.certType, cert);
  }

  // Filter certificate types: skip HMO licence if not HMO
  const visibleTypes = CERTIFICATE_TYPES.filter((ct) => {
    if (ct.type === "hmo_licence" && !isHmo) return false;
    return true;
  });

  // Count warnings
  const expiredCount = certificates.filter((c) => c.status === "expired").length;
  const expiringCount = certificates.filter((c) => c.status === "expiring_soon").length;
  const missingRequired = visibleTypes.filter((ct) => {
    if (!ct.required) return false;
    const record = certMap.get(ct.type);
    return !record || record.status === "missing";
  });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Warning alerts */}
      {expiredCount > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/5">
          <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-300">
            {expiredCount} certificate{expiredCount > 1 ? "s" : ""} expired
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-400">
            Expired certificates may result in fines or prosecution. Please renew
            immediately.
          </AlertDescription>
        </Alert>
      )}

      {expiringCount > 0 && (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/5">
          <Clock className="size-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">
            {expiringCount} certificate{expiringCount > 1 ? "s" : ""} expiring
            soon
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            Book renewals now to avoid a gap in compliance.
          </AlertDescription>
        </Alert>
      )}

      {missingRequired.length > 0 && (
        <Alert className="border-gray-200 bg-gray-50 dark:border-gray-500/20 dark:bg-gray-500/5">
          <HelpCircle className="size-4 text-gray-600 dark:text-gray-400" />
          <AlertTitle className="text-gray-800 dark:text-gray-300">
            {missingRequired.length} required certificate
            {missingRequired.length > 1 ? "s" : ""} missing
          </AlertTitle>
          <AlertDescription className="text-gray-700 dark:text-gray-400">
            Upload or add details for:{" "}
            {missingRequired.map((ct) => ct.label).join(", ")}.
          </AlertDescription>
        </Alert>
      )}

      {/* Certificate table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Certificate
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                Issued
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                Expires
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Frequency
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleTypes.map((certType) => {
              const record = certMap.get(certType.type);
              const status: CertificateStatus = record?.status ?? "missing";

              return (
                <tr
                  key={certType.type}
                  className={cn(
                    "border-b last:border-b-0 transition-colors hover:bg-muted/30",
                    status === "expired" && "bg-red-50/50 dark:bg-red-500/5",
                    status === "expiring_soon" &&
                      "bg-amber-50/50 dark:bg-amber-500/5"
                  )}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{certType.label}</p>
                      {certType.required && (
                        <span className="text-xs text-red-600 dark:text-red-400">
                          Required
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadgeInline status={status} />
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {formatDate(record?.issuedDate ?? null)}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {formatDate(record?.expiryDate ?? null)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {certType.frequency}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="xs">
                      <Upload className="size-3" />
                      Upload
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CertificateTracker;
