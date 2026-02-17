"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Wallet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  School,
  BookOpen,
  ChevronDown,
  Layers,
  Database,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  roles?: string[]; // if undefined, visible to all authenticated users
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/schools", label: "Schools", icon: School, roles: ["super_admin"] },
  {
    href: "/dashboard/academics",
    label: "Academics",
    icon: BookOpen,
    roles: ["school_admin", "principal"],
    children: [
      { href: "/dashboard/academics/classes", label: "Classes", icon: School },
      { href: "/dashboard/academics/sections", label: "Sections", icon: Layers },
    ],
  },
  { href: "/dashboard/master-data", label: "Master Data", icon: Database, roles: ["school_admin"] },
  { href: "/dashboard/students", label: "Students", icon: GraduationCap, roles: ["school_admin", "principal", "teacher"] },
  { href: "/dashboard/staff", label: "Staff", icon: Users, roles: ["school_admin", "principal"] },
  { href: "/dashboard/fees", label: "Fees", icon: Wallet, roles: ["school_admin", "accountant"] },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["school_admin", "super_admin"] },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = true, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUserRole(user.role);
        setUserEmail(user.email || "");
      } catch { /* ignore parse errors */ }
    }
  }, []);

  // Expand active submenu on mount/navigation
  useEffect(() => {
    const activeParent = navItems.find(
      (item) =>
        item.children &&
        item.children.some((child) => pathname.startsWith(child.href))
    );
    if (activeParent && !openItems.includes(activeParent.label)) {
      setOpenItems((prev) => [...prev, activeParent.label]);
    }
  }, [pathname, openItems]);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  const toggleItem = (label: string) => {
    setOpenItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true; // visible to all
    if (!userRole) return false; // hide role-restricted items if role unknown
    return item.roles.includes(userRole);
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const userInitials = userEmail ? userEmail.substring(0, 2).toUpperCase() : "AD";
  const displayRole = userRole
    ? userRole.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
    : "User";

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "h-screen bg-card border-r flex flex-col transition-all duration-300",
          collapsed ? "w-14" : "w-52"
        )}
      >
        {/* Logo + Expand Button */}
        <div
          className={cn(
            "h-12 flex items-center border-b",
            collapsed ? "justify-center px-1" : "justify-between px-3"
          )}
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            {!collapsed && (
              <span className="text-base font-bold bg-gradient-to-r from-primary to-[var(--accent-teal)] bg-clip-text text-transparent">
                Scholrcloud
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
        <nav className="flex-1 py-1.5 px-1.5 space-y-0.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const isOpen = openItems.includes(item.label);
            const hasChildren = item.children && item.children.length > 0;

            // Collapsed State Logic
            if (collapsed) {
              if (hasChildren) {
                return (
                  <DropdownMenu key={item.href}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full h-9 justify-center relative",
                          active && "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-48 ml-2">
                      <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {item.children!.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link href={child.href} className="flex items-center cursor-pointer">
                            {child.icon && <child.icon className="w-4 h-4 mr-2" />}
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center h-9 rounded-lg transition-all duration-200",
                        active
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            // Expanded State Logic
            if (hasChildren) {
              return (
                <Collapsible
                  key={item.href}
                  open={isOpen}
                  onOpenChange={() => toggleItem(item.label)}
                  className="space-y-1"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between h-9 px-2.5 text-sm",
                        active ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isOpen ? "rotate-180" : ""
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    {item.children!.map((child) => {
                      const childActive = isActive(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center h-8 pl-9 pr-3 rounded-lg text-[13px] transition-colors",
                            childActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-sm transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="py-1.5 px-1.5 space-y-0.5 border-t">
          {/* Expand Button (when collapsed) */}
          {collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full h-9"
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

          {/* Profile */}
          <DropdownMenu>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full h-9 p-0">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {userInitials}
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
                <Button variant="ghost" className="w-full h-9 justify-start gap-2.5 px-2.5">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-xs font-medium">{displayRole}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
            )}
            <DropdownMenuContent side="right" align="start" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{displayRole}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings?tab=account" className="flex items-center cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              {userRole !== "super_admin" && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings?tab=school" className="flex items-center cursor-pointer">
                    <School className="w-4 h-4 mr-2" />
                    School Settings
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </TooltipProvider>
  );
}
