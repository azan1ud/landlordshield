"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Building2,
  Zap,
  Calculator,
  Scale,
  CalendarDays,
  FileText,
  BookOpen,
  Settings,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// Navigation item type
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  /** Coloured dot indicating the compliance pillar */
  pillarDot?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Properties", href: "/properties", icon: Building2 },
  {
    label: "MTD",
    href: "/mtd",
    icon: Calculator,
    pillarDot: "bg-[#2563EB]", // MTD blue
  },
  {
    label: "Renters' Rights",
    href: "/renters-rights",
    icon: Scale,
    pillarDot: "bg-[#16A34A]", // Renters green
  },
  {
    label: "EPC",
    href: "/epc",
    icon: Zap,
    pillarDot: "bg-[#F59E0B]", // EPC orange
  },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Knowledge Base", href: "/knowledge", icon: BookOpen },
  { label: "Settings", href: "/settings", icon: Settings },
];

// ---------------------------------------------------------------------------
// Circular compliance score ring (SVG)
// ---------------------------------------------------------------------------

interface ComplianceScoreProps {
  score: number; // 0 - 100
}

function ComplianceScoreRing({ score }: ComplianceScoreProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colour =
    score >= 75
      ? "#16A34A" // green
      : score >= 50
        ? "#F59E0B" // amber
        : "#DC2626"; // red

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative flex items-center justify-center">
        <svg width="68" height="68" className="-rotate-90">
          {/* Background ring */}
          <circle
            cx="34"
            cy="34"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="5"
          />
          {/* Progress ring */}
          <circle
            cx="34"
            cy="34"
            r={radius}
            fill="none"
            stroke={colour}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute text-sm font-bold text-white">
          {score}%
        </span>
      </div>
      <span className="text-[11px] font-medium uppercase tracking-widest text-white/70">
        Compliance Score
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Navigation link row
// ---------------------------------------------------------------------------

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}

function NavLink({ item, isActive, onClick }: NavLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-white/15 text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon className="size-[18px] shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.pillarDot && (
        <span
          className={cn("size-2 shrink-0 rounded-full", item.pillarDot)}
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Sidebar inner content (shared between desktop & mobile)
// ---------------------------------------------------------------------------

interface SidebarContentProps {
  pathname: string;
  complianceScore: number;
  onLinkClick?: () => void;
}

function SidebarContent({
  pathname,
  complianceScore,
  onLinkClick,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col bg-[#1E3A5F]">
      {/* Brand header */}
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Link
          href="/dashboard"
          onClick={onLinkClick}
          className="flex items-center gap-2.5"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-white/15">
            <Shield className="size-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight text-white">
              LandlordShield
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/50">
              Compliance Hub
            </span>
          </div>
        </Link>
      </div>

      <Separator className="bg-white/10" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive}
              onClick={onLinkClick}
            />
          );
        })}
      </nav>

      <Separator className="bg-white/10" />

      {/* Compliance score */}
      <div className="px-3 py-5">
        <ComplianceScoreRing score={complianceScore} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exported Sidebar component
// ---------------------------------------------------------------------------

export interface SidebarProps {
  /** Overall compliance score (0 - 100) displayed at the bottom */
  complianceScore?: number;
}

export function Sidebar({ complianceScore = 72 }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Desktop sidebar -- fixed left column, hidden on small screens      */}
      {/* ------------------------------------------------------------------ */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 z-30 w-64">
          <SidebarContent
            pathname={pathname}
            complianceScore={complianceScore}
          />
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile sidebar -- Sheet overlay, visible only on small screens     */}
      {/* ------------------------------------------------------------------ */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed left-4 top-3.5 z-40"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-64 p-0 border-none [&>button]:text-white [&>button]:hover:text-white/80"
          >
            {/* Accessible title (visually hidden) */}
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>

            <SidebarContent
              pathname={pathname}
              complianceScore={complianceScore}
              onLinkClick={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default Sidebar;
