"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  CheckSquare,
  Building2,
  Calendar,
  Filter,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { ChecklistItem, Property } from "@/types";

// ---------------------------------------------------------------------------
// Priority badge config
// ---------------------------------------------------------------------------

const PRIORITY_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  critical: {
    label: "Critical",
    className:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
  high: {
    label: "High",
    className:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
  },
  medium: {
    label: "Medium",
    className:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  low: {
    label: "Low",
    className:
      "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface PropertyOption {
  id: string;
  label: string;
}

function buildAddress(p: Pick<Property, "address_line1" | "address_line2" | "city" | "postcode">): string {
  return [p.address_line1, p.address_line2, p.city, p.postcode]
    .filter(Boolean)
    .join(", ");
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RentersRightsChecklistPage() {
  const { user, loading: authLoading } = useAuth();
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProperty, setSelectedProperty] = useState("all");
  const [filter, setFilter] = useState<"all" | "incomplete" | "complete">("all");

  // Fetch checklist items and properties from Supabase
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        // Fetch checklist items for renters_rights pillar
        const { data: itemsData, error: itemsError } = await supabase
          .from("checklist_items")
          .select("*")
          .eq("user_id", user!.id)
          .eq("pillar", "renters_rights");

        if (itemsError) throw itemsError;

        // Fetch properties for the property selector
        const { data: propertiesData, error: propError } = await supabase
          .from("properties")
          .select("id, address_line1, address_line2, city, postcode")
          .eq("user_id", user!.id);

        if (propError) throw propError;

        setChecklistItems(itemsData ?? []);

        const mappedProperties: PropertyOption[] = [
          { id: "all", label: "All Properties (account-wide)" },
          ...(propertiesData ?? []).map((p: Pick<Property, "id" | "address_line1" | "address_line2" | "city" | "postcode">) => ({
            id: p.id,
            label: buildAddress(p),
          })),
        ];

        setProperties(mappedProperties);
      } catch (err) {
        console.error("Failed to fetch checklist data:", err);
        setError("Failed to load checklist data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, authLoading]);

  // Filter items based on property selection
  const propertyFilteredItems = useMemo(() => {
    if (selectedProperty === "all") {
      return checklistItems;
    }
    // Show items for the selected property, plus account-wide items (property_id is null)
    return checklistItems.filter(
      (item) => item.property_id === selectedProperty || item.property_id === null
    );
  }, [selectedProperty, checklistItems]);

  // Filter by completion status
  const filteredItems = useMemo(() => {
    if (filter === "incomplete") {
      return propertyFilteredItems.filter((item) => !item.is_completed);
    }
    if (filter === "complete") {
      return propertyFilteredItems.filter((item) => item.is_completed);
    }
    return propertyFilteredItems;
  }, [propertyFilteredItems, filter]);

  // Progress calculation
  const completionCount = useMemo(
    () => checklistItems.filter((item) => item.is_completed).length,
    [checklistItems]
  );
  const totalCount = checklistItems.length;
  const completionPercentage =
    totalCount > 0 ? Math.round((completionCount / totalCount) * 100) : 0;

  // Toggle completion and update Supabase
  const toggleItem = useCallback(
    async (item: ChecklistItem) => {
      const newCompleted = !item.is_completed;

      // Optimistic update
      setChecklistItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                is_completed: newCompleted,
                completed_at: newCompleted ? new Date().toISOString() : null,
              }
            : i
        )
      );

      try {
        const supabase = createClient();
        const { error: updateError } = await supabase
          .from("checklist_items")
          .update({
            is_completed: newCompleted,
            completed_at: newCompleted ? new Date().toISOString() : null,
          })
          .eq("id", item.id);

        if (updateError) throw updateError;
      } catch (err) {
        console.error("Failed to update checklist item:", err);
        // Revert optimistic update on failure
        setChecklistItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  is_completed: item.is_completed,
                  completed_at: item.completed_at,
                }
              : i
          )
        );
      }
    },
    []
  );

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
      <div className="space-y-6">
        <div>
          <Link
            href="/renters-rights"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Renters&apos; Rights
          </Link>
          <div className="flex items-center gap-2">
            <CheckSquare className="size-6 text-[#16A34A]" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Compliance Checklist
            </h1>
          </div>
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
    <div className="space-y-6">
      {/* Back + heading */}
      <div>
        <Link
          href="/renters-rights"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Renters&apos; Rights
        </Link>
        <div className="flex items-center gap-2">
          <CheckSquare className="size-6 text-[#16A34A]" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Compliance Checklist
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Track each compliance task for the Renters&apos; Rights Act. Check off
          items as you complete them.
        </p>
      </div>

      {/* Progress overview */}
      <Card className="border-t-4 border-t-[#16A34A]">
        <CardContent className="space-y-3 pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Overall Progress
            </p>
            <p className="text-sm font-bold" style={{ color: "#16A34A" }}>
              {completionPercentage}%
            </p>
          </div>
          <Progress
            value={completionPercentage}
            className="h-3 bg-green-100 dark:bg-green-500/10"
          />
          <p className="text-xs text-muted-foreground">
            {completionCount} of {totalCount} items completed
          </p>
        </CardContent>
      </Card>

      {/* Property selector + Filter controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {/* Property dropdown */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Building2 className="size-4 text-muted-foreground" />
            Property
          </label>
          <Select
            value={selectedProperty}
            onValueChange={setSelectedProperty}
          >
            <SelectTrigger className="w-full sm:w-[340px]">
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter tabs */}
        <Tabs
          value={filter}
          onValueChange={(val) =>
            setFilter(val as "all" | "incomplete" | "complete")
          }
        >
          <TabsList>
            <TabsTrigger value="all">
              All ({propertyFilteredItems.length})
            </TabsTrigger>
            <TabsTrigger value="incomplete">
              Not Complete (
              {propertyFilteredItems.filter((i) => !i.is_completed).length})
            </TabsTrigger>
            <TabsTrigger value="complete">
              Complete (
              {propertyFilteredItems.filter((i) => i.is_completed).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {filteredItems.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Filter className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              {filter === "complete"
                ? "No completed items yet. Start checking off tasks!"
                : filter === "incomplete"
                  ? "All items are complete. Great job!"
                  : "No checklist items found."}
            </p>
          </div>
        )}

        {filteredItems.map((item) => {
          const isCompleted = item.is_completed;
          const priority = PRIORITY_CONFIG[item.priority];
          const dueDate = item.due_date ? new Date(item.due_date) : null;
          const isOverdue = !isCompleted && dueDate && dueDate < new Date();

          return (
            <Card
              key={item.id}
              className={cn(
                "transition-all",
                isCompleted && "opacity-60",
                isOverdue && "border-red-200 dark:border-red-500/20"
              )}
            >
              <CardContent className="flex items-start gap-4 py-4 px-4">
                {/* Checkbox */}
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => toggleItem(item)}
                  className="mt-0.5 data-[state=checked]:bg-[#16A34A] data-[state=checked]:border-[#16A34A]"
                  aria-label={`Mark "${item.title}" as ${isCompleted ? "incomplete" : "complete"}`}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={cn(
                        "text-sm font-medium text-foreground",
                        isCompleted && "line-through"
                      )}
                    >
                      {item.title}
                    </p>
                    {priority && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[11px]",
                          priority.className
                        )}
                      >
                        {priority.label}
                      </Badge>
                    )}
                    {item.property_id === null && (
                      <Badge
                        variant="outline"
                        className="text-[11px] border-transparent bg-muted text-muted-foreground"
                      >
                        Account-Wide
                      </Badge>
                    )}
                    {item.property_id !== null && (
                      <Badge
                        variant="outline"
                        className="text-[11px] border-transparent bg-muted text-muted-foreground"
                      >
                        Per Property
                      </Badge>
                    )}
                  </div>

                  {item.description && (
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Due date */}
                  {dueDate && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      <span
                        className={cn(
                          "text-muted-foreground",
                          isOverdue && "font-semibold text-red-600 dark:text-red-400"
                        )}
                      >
                        Due:{" "}
                        {dueDate.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {isOverdue && " (Overdue)"}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
