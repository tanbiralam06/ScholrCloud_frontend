"use client";

import { useState } from "react";
import { Sidebar, TopHeader } from "@/components/dashboard";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex bg-muted/30 overflow-hidden">
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar collapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopHeader onMenuClick={() => setMobileMenuOpen(true)} showMenuButton={true} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
