"use client";

import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar handles both desktop (fixed) and mobile (Sheet) */}
      <Sidebar />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <Header title="LandlordShield" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>

        {/* Legal disclaimer footer */}
        <footer className="border-t px-4 py-3 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            This tool provides guidance only. It is not legal, tax, or financial
            advice.
          </p>
        </footer>
      </div>
    </div>
  );
}
