"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/students", label: "Students", icon: "👨‍🎓" },
  { href: "/dashboard/staff", label: "Staff", icon: "👥" },
  { href: "/dashboard/fees", label: "Fees", icon: "💰" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">SMS Dashboard</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Link href="/login" className="text-sm text-muted-foreground hover:underline">
            Logout
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-6">
          <h2 className="text-lg font-semibold">
            {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
          </h2>
        </header>
        <div className="flex-1 p-6 bg-muted/30">{children}</div>
      </main>
    </div>
  );
}
