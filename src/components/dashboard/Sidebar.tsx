"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Wallet,
  Settings,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/common";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/schools", label: "Schools", icon: School },
  { href: "/dashboard/students", label: "Students", icon: GraduationCap },
  { href: "/dashboard/staff", label: "Staff", icon: Users },
  { href: "/dashboard/fees", label: "Fees", icon: Wallet },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = true, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "h-screen bg-card border-r flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-56"
        )}
      >
        {/* Logo + Expand Button */}
        <div
          className={cn(
            "h-14 flex items-center border-b",
            collapsed ? "justify-center px-2" : "justify-between px-3"
          )}
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-[var(--accent-teal)] bg-clip-text text-transparent">
                SMS
              </span>
            )}
          </Link>
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onCollapsedChange?.(true)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center h-10 rounded-lg transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed ? "justify-center w-full" : "gap-3 px-3"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="py-2 px-2 space-y-1 border-t">
          {/* Expand Button (when collapsed) */}
          {collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full h-10"
                  onClick={() => onCollapsedChange?.(false)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          )}

          {/* Theme Toggle */}
          <div className={cn("flex", collapsed ? "justify-center" : "px-1")}>
            <ThemeToggle />
          </div>

          {/* Notifications */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full h-10 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-3 w-2 h-2 bg-destructive rounded-full" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                Notifications
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button variant="ghost" className="w-full h-10 justify-start gap-3 px-3 relative">
              <Bell className="w-5 h-5" />
              <span className="font-medium">Notifications</span>
              <span className="absolute top-2 left-7 w-2 h-2 bg-destructive rounded-full" />
            </Button>
          )}

          {/* Profile */}
          <DropdownMenu>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full h-10 p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          AD
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  Profile
                </TooltipContent>
              </Tooltip>
            ) : (
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full h-10 justify-start gap-3 px-3">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">Admin</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
            )}
            <DropdownMenuContent side="right" align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@school.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">School Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
                <Link href="/login">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </TooltipProvider>
  );
}
