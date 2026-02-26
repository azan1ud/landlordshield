"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Home,
  Zap,
  PoundSterling,
  Users,
  Building2,
  Landmark,
  Sofa,
  ShieldCheck,
  UserCog,
  Save,
  ArrowLeft,
} from "lucide-react";
import type {
  PropertyType,
  EpcRating,
  TenancyType,
  OwnershipType,
  FurnishedStatus,
} from "@/types";

// ---------------------------------------------------------------------------
// Form data shape
// ---------------------------------------------------------------------------

export interface PropertyFormData {
  // Address
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  postcode: string;

  // Property details
  propertyType: PropertyType | "";
  bedrooms: string;

  // EPC
  epcRating: EpcRating | "";
  epcExpiryDate: string;
  epcCertificateNumber: string;

  // Rent
  monthlyRent: string;

  // Tenancy
  tenancyType: TenancyType | "";
  tenancyStartDate: string;
  tenantNames: string;

  // Ownership
  ownershipType: OwnershipType | "";
  jointOwnershipPercentage: string;

  // Mortgage
  hasMortgage: boolean;
  mortgageLender: string;
  mortgageMonthlyPayment: string;

  // Furnished
  furnishedStatus: FurnishedStatus | "";

  // HMO
  hmoLicenceRequired: boolean;

  // Managing agent
  hasManagingAgent: boolean;
  managingAgentName: string;

  // Notes
  notes: string;
}

export const EMPTY_FORM_DATA: PropertyFormData = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  county: "",
  postcode: "",
  propertyType: "",
  bedrooms: "",
  epcRating: "",
  epcExpiryDate: "",
  epcCertificateNumber: "",
  monthlyRent: "",
  tenancyType: "",
  tenancyStartDate: "",
  tenantNames: "",
  ownershipType: "",
  jointOwnershipPercentage: "",
  hasMortgage: false,
  mortgageLender: "",
  mortgageMonthlyPayment: "",
  furnishedStatus: "",
  hmoLicenceRequired: false,
  hasManagingAgent: false,
  managingAgentName: "",
  notes: "",
};

// ---------------------------------------------------------------------------
// Validation errors
// ---------------------------------------------------------------------------

export interface PropertyFormErrors {
  [key: string]: string | undefined;
}

export function validatePropertyForm(data: PropertyFormData): PropertyFormErrors {
  const errors: PropertyFormErrors = {};

  if (!data.addressLine1.trim()) errors.addressLine1 = "Address line 1 is required";
  if (!data.city.trim()) errors.city = "City is required";
  if (!data.postcode.trim()) errors.postcode = "Postcode is required";
  if (data.postcode.trim() && !/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(data.postcode.trim())) {
    errors.postcode = "Enter a valid UK postcode";
  }
  if (!data.propertyType) errors.propertyType = "Property type is required";
  if (data.bedrooms && (isNaN(Number(data.bedrooms)) || Number(data.bedrooms) < 0)) {
    errors.bedrooms = "Enter a valid number of bedrooms";
  }
  if (data.monthlyRent && (isNaN(Number(data.monthlyRent)) || Number(data.monthlyRent) < 0)) {
    errors.monthlyRent = "Enter a valid rent amount";
  }
  if (data.ownershipType === "joint" && !data.jointOwnershipPercentage) {
    errors.jointOwnershipPercentage = "Enter your ownership percentage";
  }
  if (
    data.jointOwnershipPercentage &&
    (isNaN(Number(data.jointOwnershipPercentage)) ||
      Number(data.jointOwnershipPercentage) < 1 ||
      Number(data.jointOwnershipPercentage) > 100)
  ) {
    errors.jointOwnershipPercentage = "Enter a value between 1 and 100";
  }
  if (data.hasMortgage && !data.mortgageLender.trim()) {
    errors.mortgageLender = "Enter the mortgage lender name";
  }
  if (
    data.hasMortgage &&
    data.mortgageMonthlyPayment &&
    (isNaN(Number(data.mortgageMonthlyPayment)) || Number(data.mortgageMonthlyPayment) < 0)
  ) {
    errors.mortgageMonthlyPayment = "Enter a valid mortgage payment";
  }
  if (data.hasManagingAgent && !data.managingAgentName.trim()) {
    errors.managingAgentName = "Enter the agent name";
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface PropertyFormProps {
  /** Form data (controlled) */
  data: PropertyFormData;
  /** Called when a field changes */
  onChange: (data: PropertyFormData) => void;
  /** Validation errors to display */
  errors?: PropertyFormErrors;
  /** Called on form submit */
  onSubmit: (data: PropertyFormData) => void;
  /** Called on cancel */
  onCancel: () => void;
  /** Submit button label */
  submitLabel?: string;
  /** Whether the form is currently submitting */
  isSubmitting?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "house", label: "House" },
  { value: "flat", label: "Flat" },
  { value: "hmo", label: "HMO" },
  { value: "studio", label: "Studio" },
  { value: "bungalow", label: "Bungalow" },
  { value: "maisonette", label: "Maisonette" },
  { value: "other", label: "Other" },
];

const EPC_RATINGS: EpcRating[] = ["A", "B", "C", "D", "E", "F", "G"];

const TENANCY_TYPES: { value: TenancyType; label: string }[] = [
  { value: "ast_fixed", label: "AST Fixed Term" },
  { value: "ast_periodic", label: "AST Periodic" },
  { value: "periodic_assured", label: "Periodic Assured" },
];

const OWNERSHIP_TYPES: { value: OwnershipType; label: string }[] = [
  { value: "sole", label: "Sole Owner" },
  { value: "joint", label: "Joint Owner" },
  { value: "limited_company", label: "Limited Company" },
];

const FURNISHED_STATUSES: { value: FurnishedStatus; label: string }[] = [
  { value: "furnished", label: "Furnished" },
  { value: "part_furnished", label: "Part-furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];

// ---------------------------------------------------------------------------
// Field error component
// ---------------------------------------------------------------------------

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>;
}

// ---------------------------------------------------------------------------
// PropertyForm component
// ---------------------------------------------------------------------------

export function PropertyForm({
  data,
  onChange,
  errors = {},
  onSubmit,
  onCancel,
  submitLabel = "Save Property",
  isSubmitting = false,
}: PropertyFormProps) {
  function update(partial: Partial<PropertyFormData>) {
    onChange({ ...data, ...partial });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ================================================================= */}
      {/* SECTION: Address                                                   */}
      {/* ================================================================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="size-4" />
            Property Address
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="addressLine1">
              Address Line 1 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="addressLine1"
              placeholder="e.g. 42 Acacia Avenue"
              value={data.addressLine1}
              onChange={(e) => update({ addressLine1: e.target.value })}
              aria-invalid={!!errors.addressLine1}
            />
            <FieldError error={errors.addressLine1} />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input
              id="addressLine2"
              placeholder="Flat number, building name, etc."
              value={data.addressLine2}
              onChange={(e) => update({ addressLine2: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="city">
              City / Town <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              placeholder="e.g. Manchester"
              value={data.city}
              onChange={(e) => update({ city: e.target.value })}
              aria-invalid={!!errors.city}
            />
            <FieldError error={errors.city} />
          </div>

          <div>
            <Label htmlFor="county">County</Label>
            <Input
              id="county"
              placeholder="e.g. Greater Manchester"
              value={data.county}
              onChange={(e) => update({ county: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="postcode">
              Postcode <span className="text-red-500">*</span>
            </Label>
            <Input
              id="postcode"
              placeholder="e.g. M1 2AB"
              value={data.postcode}
              onChange={(e) => update({ postcode: e.target.value.toUpperCase() })}
              aria-invalid={!!errors.postcode}
              className="uppercase"
            />
            <FieldError error={errors.postcode} />
          </div>
        </CardContent>
      </Card>

      {/* ================================================================= */}
      {/* SECTION: Property Details                                          */}
      {/* ================================================================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Home className="size-4" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="propertyType">
              Property Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.propertyType}
              onValueChange={(val) =>
                update({ propertyType: val as PropertyType })
              }
            >
              <SelectTrigger id="propertyType" className="w-full" aria-invalid={!!errors.propertyType}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((pt) => (
                  <SelectItem key={pt.value} value={pt.value}>
                    {pt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError error={errors.propertyType} />
          </div>

          <div>
            <Label htmlFor="bedrooms">Number of Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              max="20"
              placeholder="e.g. 3"
              value={data.bedrooms}
              onChange={(e) => update({ bedrooms: e.target.value })}
              aria-invalid={!!errors.bedrooms}
            />
            <FieldError error={errors.bedrooms} />
          </div>
        </CardContent>
      </Card>

      {/* ================================================================= */}
      {/* SECTION: EPC                                                       */}
      {/* ================================================================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="size-4" />
            Energy Performance Certificate (EPC)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="epcRating">Current EPC Rating</Label>
            <Select
              value={data.epcRating}
              onValueChange={(val) => update({ epcRating: val as EpcRating })}
            >
              <SelectTrigger id="epcRating" className="w-full">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {EPC_RATINGS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="epcExpiryDate">EPC Expiry Date</Label>
            <Input
              id="epcExpiryDate"
              type="date"
              value={data.epcExpiryDate}
              onChange={(e) => update({ epcExpiryDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="epcCertificateNumber">Certificate Number</Label>
            <Input
              id="epcCertificateNumber"
              placeholder="Optional"
              value={data.epcCertificateNumber}
              onChange={(e) => update({ epcCertificateNumber: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* ================================================================= */}
      {/* SECTION: Rent & Tenancy                                            */}
      {/* ================================================================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PoundSterling className="size-4" />
            Rent & Tenancy
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="monthlyRent">Monthly Rent (£)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                £
              </span>
              <Input
                id="monthlyRent"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 1200"
                value={data.monthlyRent}
                onChange={(e) => update({ monthlyRent: e.target.value })}
                className="pl-7"
                aria-invalid={!!errors.monthlyRent}
              />
            </div>
            <FieldError error={errors.monthlyRent} />
          </div>

          <div>
            <Label htmlFor="tenancyType">Tenancy Type</Label>
            <Select
              value={data.tenancyType}
              onValueChange={(val) =>
                update({ tenancyType: val as TenancyType })
              }
            >
              <SelectTrigger id="tenancyType" className="w-full">
                <SelectValue placeholder="Select tenancy type" />
              </SelectTrigger>
              <SelectContent>
                {TENANCY_TYPES.map((tt) => (
                  <SelectItem key={tt.value} value={tt.value}>
                    {tt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tenancyStartDate">Tenancy Start Date</Label>
            <Input
              id="tenancyStartDate"
              type="date"
              value={data.tenancyStartDate}
              onChange={(e) => update({ tenancyStartDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="tenantNames">Tenant Name(s)</Label>
            <Input
              id="tenantNames"
              placeholder="e.g. John Smith, Jane Doe"
              value={data.tenantNames}
              onChange={(e) => update({ tenantNames: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* ================================================================= */}
      {/* SECTION: Ownership & Mortgage                                      */}
      {/* ================================================================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="size-4" />
            Ownership & Mortgage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ownershipType">Ownership Structure</Label>
              <Select
                value={data.ownershipType}
                onValueChange={(val) =>
                  update({ ownershipType: val as OwnershipType })
                }
              >
                <SelectTrigger id="ownershipType" className="w-full">
                  <SelectValue placeholder="Select ownership type" />
                </SelectTrigger>
                <SelectContent>
                  {OWNERSHIP_TYPES.map((ot) => (
                    <SelectItem key={ot.value} value={ot.value}>
                      {ot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {data.ownershipType === "joint" && (
              <div>
                <Label htmlFor="jointOwnershipPercentage">
                  Your Ownership % <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="jointOwnershipPercentage"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g. 50"
                    value={data.jointOwnershipPercentage}
                    onChange={(e) =>
                      update({ jointOwnershipPercentage: e.target.value })
                    }
                    className="pr-8"
                    aria-invalid={!!errors.jointOwnershipPercentage}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    %
                  </span>
                </div>
                <FieldError error={errors.jointOwnershipPercentage} />
              </div>
            )}
          </div>

          <Separator />

          {/* Mortgage toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="hasMortgage" className="text-sm font-medium">
                  <Landmark className="mr-1.5 inline size-4" />
                  Mortgage on this property?
                </Label>
              </div>
              <Switch
                id="hasMortgage"
                checked={data.hasMortgage}
                onCheckedChange={(checked) =>
                  update({ hasMortgage: checked === true })
                }
              />
            </div>

            {data.hasMortgage && (
              <div className="grid gap-4 sm:grid-cols-2 pl-0 sm:pl-2">
                <div>
                  <Label htmlFor="mortgageLender">
                    Lender <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mortgageLender"
                    placeholder="e.g. NatWest"
                    value={data.mortgageLender}
                    onChange={(e) => update({ mortgageLender: e.target.value })}
                    aria-invalid={!!errors.mortgageLender}
                  />
                  <FieldError error={errors.mortgageLender} />
                </div>
                <div>
                  <Label htmlFor="mortgageMonthlyPayment">
                    Monthly Payment (£)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      £
                    </span>
                    <Input
                      id="mortgageMonthlyPayment"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 850"
                      value={data.mortgageMonthlyPayment}
                      onChange={(e) =>
                        update({ mortgageMonthlyPayment: e.target.value })
                      }
                      className="pl-7"
                      aria-invalid={!!errors.mortgageMonthlyPayment}
                    />
                  </div>
                  <FieldError error={errors.mortgageMonthlyPayment} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ================================================================= */}
      {/* SECTION: Additional Details                                        */}
      {/* ================================================================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sofa className="size-4" />
            Additional Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Furnished status */}
            <div>
              <Label htmlFor="furnishedStatus">Furnished Status</Label>
              <Select
                value={data.furnishedStatus}
                onValueChange={(val) =>
                  update({ furnishedStatus: val as FurnishedStatus })
                }
              >
                <SelectTrigger id="furnishedStatus" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {FURNISHED_STATUSES.map((fs) => (
                    <SelectItem key={fs.value} value={fs.value}>
                      {fs.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* HMO licence */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hmoLicenceRequired" className="text-sm font-medium">
                <ShieldCheck className="mr-1.5 inline size-4" />
                HMO Licence Required?
              </Label>
              <p className="text-xs text-muted-foreground">
                Required for houses with 3+ tenants from 2+ households
              </p>
            </div>
            <Switch
              id="hmoLicenceRequired"
              checked={data.hmoLicenceRequired}
              onCheckedChange={(checked) =>
                update({ hmoLicenceRequired: checked === true })
              }
            />
          </div>

          <Separator />

          {/* Managing agent */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="hasManagingAgent" className="text-sm font-medium">
                  <UserCog className="mr-1.5 inline size-4" />
                  Using a Managing Agent?
                </Label>
              </div>
              <Switch
                id="hasManagingAgent"
                checked={data.hasManagingAgent}
                onCheckedChange={(checked) =>
                  update({ hasManagingAgent: checked === true })
                }
              />
            </div>

            {data.hasManagingAgent && (
              <div className="pl-0 sm:pl-2">
                <Label htmlFor="managingAgentName">
                  Agent Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="managingAgentName"
                  placeholder="e.g. Foxtons"
                  value={data.managingAgentName}
                  onChange={(e) =>
                    update({ managingAgentName: e.target.value })
                  }
                  aria-invalid={!!errors.managingAgentName}
                />
                <FieldError error={errors.managingAgentName} />
              </div>
            )}
          </div>

          <Separator />

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this property..."
              value={data.notes}
              onChange={(e) => update({ notes: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* ================================================================= */}
      {/* ACTIONS                                                            */}
      {/* ================================================================= */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <ArrowLeft className="size-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="size-4" />
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default PropertyForm;
