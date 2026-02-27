"use client";

import React, { useRef, useState, useCallback } from "react";
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
  ExternalLink,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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
  documentUrl?: string | null;
  /** Storage path for the uploaded file (used for signed URL generation) */
  documentPath?: string | null;
}

export interface CertificateTrackerProps {
  certificates: CertificateRecord[];
  /** Whether the property is an HMO (shows HMO licence row) */
  isHmo?: boolean;
  /** Authenticated user ID -- required for document uploads */
  userId?: string;
  /** Property ID -- required for document uploads */
  propertyId?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Accepted file types
// ---------------------------------------------------------------------------

const ACCEPTED_FILE_TYPES = ".pdf,.png,.jpg,.jpeg";
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
];

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
// Helper: get file extension from File
// ---------------------------------------------------------------------------

function getFileExtension(file: File): string {
  const nameParts = file.name.split(".");
  return nameParts.length > 1 ? nameParts.pop()!.toLowerCase() : "pdf";
}

// ---------------------------------------------------------------------------
// CertificateTracker component
// ---------------------------------------------------------------------------

export function CertificateTracker({
  certificates,
  isHmo = false,
  userId,
  propertyId,
  className,
}: CertificateTrackerProps) {
  // Track upload state per certificate type
  const [uploadingCerts, setUploadingCerts] = useState<
    Record<string, boolean>
  >({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  // Track newly-uploaded document paths so we can show "View" immediately
  const [uploadedPaths, setUploadedPaths] = useState<Record<string, string>>(
    {}
  );
  const [viewingCerts, setViewingCerts] = useState<Record<string, boolean>>({});

  // Refs for hidden file inputs (one per cert type)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
  const expiredCount = certificates.filter(
    (c) => c.status === "expired"
  ).length;
  const expiringCount = certificates.filter(
    (c) => c.status === "expiring_soon"
  ).length;
  const missingRequired = visibleTypes.filter((ct) => {
    if (!ct.required) return false;
    const record = certMap.get(ct.type);
    return !record || record.status === "missing";
  });

  // -------------------------------------------------------------------------
  // Upload handler
  // -------------------------------------------------------------------------
  const handleUpload = useCallback(
    async (certType: CertificateType, file: File) => {
      if (!userId || !propertyId) {
        setUploadErrors((prev) => ({
          ...prev,
          [certType]: "Authentication required. Please sign in and try again.",
        }));
        return;
      }

      // Validate file type
      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        setUploadErrors((prev) => ({
          ...prev,
          [certType]: "Invalid file type. Please upload a PDF, PNG, or JPG.",
        }));
        return;
      }

      // Validate file size (max 10 MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadErrors((prev) => ({
          ...prev,
          [certType]: "File too large. Maximum size is 10 MB.",
        }));
        return;
      }

      // Clear any previous error for this cert type
      setUploadErrors((prev) => {
        const next = { ...prev };
        delete next[certType];
        return next;
      });

      setUploadingCerts((prev) => ({ ...prev, [certType]: true }));

      try {
        const supabase = createClient();
        const ext = getFileExtension(file);
        const timestamp = Date.now();
        const storagePath = `${userId}/${propertyId}/${certType}_${timestamp}.${ext}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        // Update the certificate record in the database with the storage path
        const { error: updateError } = await supabase
          .from("certificates")
          .update({ document_url: storagePath })
          .eq("property_id", propertyId)
          .eq("cert_type", certType);

        if (updateError) {
          throw new Error(updateError.message);
        }

        // Store the path locally so the "View" button appears immediately
        setUploadedPaths((prev) => ({ ...prev, [certType]: storagePath }));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed. Please try again.";
        setUploadErrors((prev) => ({ ...prev, [certType]: message }));
      } finally {
        setUploadingCerts((prev) => ({ ...prev, [certType]: false }));
      }
    },
    [userId, propertyId]
  );

  // -------------------------------------------------------------------------
  // View handler — generates a signed URL and opens in a new tab
  // -------------------------------------------------------------------------
  const handleView = useCallback(
    async (certType: CertificateType) => {
      const record = certMap.get(certType);
      const storagePath =
        uploadedPaths[certType] ?? record?.documentPath ?? record?.documentUrl;

      if (!storagePath) return;

      setViewingCerts((prev) => ({ ...prev, [certType]: true }));

      try {
        const supabase = createClient();
        const { data, error } = await supabase.storage
          .from("documents")
          .createSignedUrl(storagePath, 3600); // 1-hour signed URL

        if (error) {
          throw new Error(error.message);
        }

        if (data?.signedUrl) {
          window.open(data.signedUrl, "_blank", "noopener,noreferrer");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not generate view link.";
        setUploadErrors((prev) => ({ ...prev, [certType]: message }));
      } finally {
        setViewingCerts((prev) => ({ ...prev, [certType]: false }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadedPaths, certificates]
  );

  // -------------------------------------------------------------------------
  // File input change handler
  // -------------------------------------------------------------------------
  const onFileSelected = useCallback(
    (certType: CertificateType, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(certType, file);
      }
      // Reset the input so the same file can be re-selected
      e.target.value = "";
    },
    [handleUpload]
  );

  // -------------------------------------------------------------------------
  // Determine whether a document exists for a cert type
  // -------------------------------------------------------------------------
  const hasDocument = (certType: CertificateType): boolean => {
    if (uploadedPaths[certType]) return true;
    const record = certMap.get(certType);
    return !!(record?.documentUrl || record?.documentPath);
  };

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
              const isUploading = !!uploadingCerts[certType.type];
              const isViewing = !!viewingCerts[certType.type];
              const errorMsg = uploadErrors[certType.type];
              const docExists = hasDocument(certType.type);

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
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5">
                        {/* View button — shown when a document exists */}
                        {docExists && (
                          <Button
                            variant="outline"
                            size="xs"
                            disabled={isViewing}
                            onClick={() => handleView(certType.type)}
                          >
                            {isViewing ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <ExternalLink className="size-3" />
                            )}
                            View
                          </Button>
                        )}

                        {/* Upload button — triggers hidden file input */}
                        <Button
                          variant="outline"
                          size="xs"
                          disabled={isUploading || !userId || !propertyId}
                          onClick={() =>
                            fileInputRefs.current[certType.type]?.click()
                          }
                        >
                          {isUploading ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <Upload className="size-3" />
                          )}
                          {isUploading
                            ? "Uploading..."
                            : docExists
                              ? "Replace"
                              : "Upload"}
                        </Button>

                        {/* Hidden file input */}
                        <input
                          ref={(el) => {
                            fileInputRefs.current[certType.type] = el;
                          }}
                          type="file"
                          accept={ACCEPTED_FILE_TYPES}
                          className="hidden"
                          onChange={(e) => onFileSelected(certType.type, e)}
                        />
                      </div>

                      {/* Error message for this row */}
                      {errorMsg && (
                        <p className="text-xs text-red-600 dark:text-red-400 max-w-[200px] text-right">
                          {errorMsg}
                        </p>
                      )}
                    </div>
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
