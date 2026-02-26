"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { EPC_EXEMPTIONS } from "@/lib/constants/epc-improvements";
import {
  ArrowLeft,
  Info,
  ShieldCheck,
  Clock,
  Plus,
  FileCheck2,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Property } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PropertyOption {
  id: string;
  address: string;
}

// TODO: Exemptions should be persisted to a dedicated `epc_exemptions` table in Supabase.
// For now, they are stored in local state for the session. A future migration should
// create an epc_exemptions table with columns: id, property_id, user_id, exemption_type,
// registration_date, expiry_date, prs_reference, created_at.
interface RegisteredExemption {
  id: string;
  propertyId: string;
  propertyAddress: string;
  exemptionType: string;
  exemptionLabel: string;
  registrationDate: string;
  expiryDate: string;
  prsReference: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildAddress(p: Pick<Property, "address_line1" | "address_line2" | "city" | "postcode">): string {
  return [p.address_line1, p.address_line2, p.city, p.postcode]
    .filter(Boolean)
    .join(", ");
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ExemptionsPage() {
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [registeredExemptions, setRegisteredExemptions] = useState<
    RegisteredExemption[]
  >([]);

  // Form state
  const [formPropertyId, setFormPropertyId] = useState("");
  const [formExemptionType, setFormExemptionType] = useState("");
  const [formRegDate, setFormRegDate] = useState("");
  const [formExpiryDate, setFormExpiryDate] = useState("");
  const [formPrsRef, setFormPrsRef] = useState("");

  // Fetch real properties from Supabase
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchProperties() {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        const { data, error: fetchError } = await supabase
          .from("properties")
          .select("id, address_line1, address_line2, city, postcode")
          .eq("user_id", user!.id);

        if (fetchError) throw fetchError;

        const mapped: PropertyOption[] = (data ?? []).map((p: { id: string; address_line1: string; address_line2: string | null; city: string; postcode: string }) => ({
          id: p.id,
          address: buildAddress(p),
        }));

        setProperties(mapped);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError("Failed to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [user, authLoading]);

  function handleRegister() {
    if (
      !formPropertyId ||
      !formExemptionType ||
      !formRegDate ||
      !formExpiryDate ||
      !formPrsRef
    ) {
      return;
    }

    const property = properties.find((p) => p.id === formPropertyId);
    const exemption = EPC_EXEMPTIONS.find(
      (e) => e.type === formExemptionType
    );

    if (!property || !exemption) return;

    // TODO: Save to Supabase epc_exemptions table when it exists
    const newExemption: RegisteredExemption = {
      id: `ex-${Date.now()}`,
      propertyId: formPropertyId,
      propertyAddress: property.address,
      exemptionType: formExemptionType,
      exemptionLabel: exemption.label,
      registrationDate: formRegDate,
      expiryDate: formExpiryDate,
      prsReference: formPrsRef,
    };

    setRegisteredExemptions((prev) => [...prev, newExemption]);

    // Reset form
    setFormPropertyId("");
    setFormExemptionType("");
    setFormRegDate("");
    setFormExpiryDate("");
    setFormPrsRef("");
  }

  function handleRemove(id: string) {
    // TODO: Delete from Supabase epc_exemptions table when it exists
    setRegisteredExemptions((prev) => prev.filter((e) => e.id !== id));
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <Button variant="ghost" size="sm" className="mb-2" asChild>
            <Link href="/epc">
              <ArrowLeft className="mr-1 size-4" />
              Back to EPC Overview
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            EPC Exemption Manager
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

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
          EPC Exemption Manager
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Understand exemption types and track registered exemptions for your
          properties.
        </p>
      </div>

      {/* Info alert */}
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/5">
        <Info className="size-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">
          About EPC Exemptions
        </AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          If your property cannot meet the minimum EPC Band C requirement, you
          may be eligible for an exemption. Exemptions must be registered on the{" "}
          <strong>PRS Exemptions Register</strong> and are time-limited. You
          will need to provide supporting evidence when registering. An
          exemption does not remove the obligation to make reasonable
          improvements.
        </AlertDescription>
      </Alert>

      {/* ---- Exemption types ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-5 text-[#1E3A5F]" />
            Exemption Types
          </CardTitle>
          <CardDescription>
            Available exemption categories under the proposed EPC regulations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {EPC_EXEMPTIONS.map((exemption) => (
              <div
                key={exemption.type}
                className="flex items-start gap-4 rounded-lg border p-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/10">
                  <FileCheck2 className="size-5 text-[#F59E0B]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-foreground">
                      {exemption.label}
                    </h3>
                    <Badge
                      variant="outline"
                      className="shrink-0 gap-1 text-xs"
                    >
                      <Clock className="size-3" />
                      {exemption.duration}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {exemption.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ---- Register new exemption form ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="size-5 text-[#F59E0B]" />
            Register an Exemption
          </CardTitle>
          <CardDescription>
            Record an exemption that has been registered on the PRS Exemptions
            Register.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Property select */}
            <div className="space-y-2">
              <Label htmlFor="exemption-property">Property</Label>
              <Select
                value={formPropertyId}
                onValueChange={setFormPropertyId}
              >
                <SelectTrigger id="exemption-property" className="w-full">
                  <SelectValue placeholder="Select property..." />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exemption type select */}
            <div className="space-y-2">
              <Label htmlFor="exemption-type">Exemption Type</Label>
              <Select
                value={formExemptionType}
                onValueChange={setFormExemptionType}
              >
                <SelectTrigger id="exemption-type" className="w-full">
                  <SelectValue placeholder="Select exemption type..." />
                </SelectTrigger>
                <SelectContent>
                  {EPC_EXEMPTIONS.map((e) => (
                    <SelectItem key={e.type} value={e.type}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Registration date */}
            <div className="space-y-2">
              <Label htmlFor="reg-date">Registration Date</Label>
              <Input
                id="reg-date"
                type="date"
                value={formRegDate}
                onChange={(e) => setFormRegDate(e.target.value)}
              />
            </div>

            {/* Expiry date */}
            <div className="space-y-2">
              <Label htmlFor="expiry-date">Expiry Date</Label>
              <Input
                id="expiry-date"
                type="date"
                value={formExpiryDate}
                onChange={(e) => setFormExpiryDate(e.target.value)}
              />
            </div>

            {/* PRS reference */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="prs-ref">
                PRS Exemptions Register Reference
              </Label>
              <Input
                id="prs-ref"
                value={formPrsRef}
                onChange={(e) => setFormPrsRef(e.target.value)}
                placeholder="e.g. PRS-EX-2025-001234"
              />
            </div>
          </div>

          <Button
            className="mt-4 bg-[#1E3A5F] hover:bg-[#1E3A5F]/90"
            onClick={handleRegister}
            disabled={
              !formPropertyId ||
              !formExemptionType ||
              !formRegDate ||
              !formExpiryDate ||
              !formPrsRef
            }
          >
            <Plus className="mr-1 size-4" />
            Register Exemption
          </Button>
        </CardContent>
      </Card>

      {/* ---- Currently registered exemptions ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCheck2 className="size-5 text-[#1E3A5F]" />
            Registered Exemptions
          </CardTitle>
          <CardDescription>
            {registeredExemptions.length === 0
              ? "No exemptions registered yet."
              : `${registeredExemptions.length} exemption${
                  registeredExemptions.length === 1 ? "" : "s"
                } registered.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registeredExemptions.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No exemptions have been registered. Use the form above to record
              an exemption.
            </p>
          ) : (
            <div className="space-y-3">
              {registeredExemptions.map((ex) => {
                const isExpired = new Date(ex.expiryDate) < new Date();

                return (
                  <div
                    key={ex.id}
                    className="flex items-start gap-4 rounded-lg border p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-medium text-foreground">
                          {ex.propertyAddress}
                        </h3>
                        <Badge
                          variant="outline"
                          className={
                            isExpired
                              ? "border-red-200 text-red-600"
                              : "border-green-200 text-green-600"
                          }
                        >
                          {isExpired ? "Expired" : "Active"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {ex.exemptionLabel}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>
                          Registered:{" "}
                          {new Date(ex.registrationDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </span>
                        <span>
                          Expires:{" "}
                          {new Date(ex.expiryDate).toLocaleDateString("en-GB")}
                        </span>
                        <span>Ref: {ex.prsReference}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-muted-foreground hover:text-red-600"
                      onClick={() => handleRemove(ex.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---- Process info ---- */}
      <Alert className="border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/5">
        <Info className="size-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-800 dark:text-amber-300">
          Exemption Registration Process
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-400">
          <ol className="mt-1 list-inside list-decimal space-y-1">
            <li>
              Determine which exemption category applies to your property.
            </li>
            <li>
              Gather supporting evidence (e.g. quotes exceeding the cost cap,
              written tenant refusal, surveyor report).
            </li>
            <li>
              Register the exemption on the{" "}
              <strong>PRS Exemptions Register</strong> through the official
              government portal.
            </li>
            <li>Record the reference number above for your records.</li>
            <li>
              Note the expiry date -- most exemptions last 5 years and must be
              re-registered if still applicable.
            </li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );
}
