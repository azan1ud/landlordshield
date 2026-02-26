"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  PropertyForm,
  EMPTY_FORM_DATA,
  validatePropertyForm,
  type PropertyFormData,
  type PropertyFormErrors,
} from "@/components/properties/PropertyForm";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// ---------------------------------------------------------------------------
// Add Property Page
// ---------------------------------------------------------------------------

export default function NewPropertyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<PropertyFormData>(EMPTY_FORM_DATA);
  const [errors, setErrors] = useState<PropertyFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = useCallback((data: PropertyFormData) => {
    setFormData(data);
    // Clear specific field errors as the user types
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        const k = key as keyof PropertyFormData;
        if (data[k] !== undefined && data[k] !== "") {
          delete next[key];
        }
      }
      return next;
    });
    // Clear submit error when user makes changes
    setSubmitError(null);
  }, []);

  const handleSubmit = useCallback(
    async (data: PropertyFormData) => {
      // Validate
      const validationErrors = validatePropertyForm(data);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        // Scroll to first error
        const firstErrorKey = Object.keys(validationErrors)[0];
        const el = document.getElementById(firstErrorKey);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
        return;
      }

      if (!user) {
        setSubmitError("You must be logged in to add a property.");
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const supabase = createClient();

        // Insert property into Supabase
        const { data: newProperty, error: insertError } = await supabase
          .from("properties")
          .insert({
            user_id: user.id,
            address_line1: data.addressLine1.trim(),
            address_line2: data.addressLine2.trim() || null,
            city: data.city.trim(),
            county: data.county.trim() || null,
            postcode: data.postcode.trim().toUpperCase(),
            property_type: data.propertyType || null,
            bedrooms: data.bedrooms ? parseInt(data.bedrooms, 10) : null,
            monthly_rent: data.monthlyRent ? parseFloat(data.monthlyRent) : null,
            ownership_type: data.ownershipType || null,
            joint_ownership_percentage: data.jointOwnershipPercentage
              ? parseFloat(data.jointOwnershipPercentage)
              : null,
            is_furnished: data.furnishedStatus || null,
            has_mortgage: data.hasMortgage,
            mortgage_monthly: data.mortgageMonthlyPayment
              ? parseFloat(data.mortgageMonthlyPayment)
              : null,
            managing_agent: data.hasManagingAgent
              ? data.managingAgentName.trim() || null
              : null,
            hmo_licence_required: data.hmoLicenceRequired,
            notes: data.notes.trim() || null,
          })
          .select()
          .single();

        if (insertError) {
          setSubmitError(insertError.message);
          setIsSubmitting(false);
          return;
        }

        // If EPC data was provided, insert an EPC record
        if (data.epcRating && newProperty) {
          await supabase.from("epc_records").insert({
            property_id: newProperty.id,
            current_rating: data.epcRating,
            certificate_number: data.epcCertificateNumber.trim() || null,
            expiry_date: data.epcExpiryDate || null,
            status: "valid",
          });
        }

        // If tenancy data was provided, insert a tenancy record
        if (data.tenantNames.trim() && newProperty) {
          await supabase.from("tenancies").insert({
            property_id: newProperty.id,
            tenant_name: data.tenantNames.trim(),
            tenancy_type: data.tenancyType || null,
            start_date: data.tenancyStartDate || null,
            current_rent: data.monthlyRent ? parseFloat(data.monthlyRent) : null,
            status: "active",
          });
        }

        // On success, navigate to the property detail page
        if (newProperty) {
          router.push(`/properties/${newProperty.id}`);
        } else {
          router.push("/properties");
        }
      } catch (err) {
        console.error("Failed to create property:", err);
        setSubmitError("Failed to save property. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, router]
  );

  const handleCancel = useCallback(() => {
    router.push("/properties");
  }, [router]);

  // Loading auth
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Add Property
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details below to add a new property to your portfolio.
        </p>
      </div>

      {/* Submit error alert */}
      {submitError && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/5">
          <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-300">
            Failed to save property
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-400">
            {submitError}
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <div className="max-w-3xl">
        <PropertyForm
          data={formData}
          onChange={handleChange}
          errors={errors}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Add Property"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
