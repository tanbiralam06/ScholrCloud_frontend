"use client";

import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchoolProfileForm } from "@/components/dashboard/settings/SchoolProfileForm";
import { AcademicSettingsForm } from "@/components/dashboard/settings/AcademicSettingsForm";
import { BillingCard } from "@/components/dashboard/settings/BillingCard";
import { useSchoolSettings } from "@/hooks/use-school-settings";
import { Loader2, Sun, Moon, Monitor } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const options = [
    { value: "light", label: "Light", icon: Sun, description: "Classic light interface" },
    { value: "dark", label: "Dark", icon: Moon, description: "Easy on the eyes" },
    { value: "system", label: "System", icon: Monitor, description: "Match your device settings" },
  ];

  return (
    <div className="bg-card border rounded-xl p-6 space-y-4">
      <div>
        <h3 className="font-semibold">Appearance</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how the application looks for you
        </p>
      </div>
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = theme === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                ${isActive
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-transparent bg-muted/50 hover:bg-muted hover:border-muted-foreground/20"
                }`}
            >
              <div className={`p-2.5 rounded-lg ${isActive ? "bg-primary/10" : "bg-background"}`}>
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <span className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}>{opt.label}</span>
              <span className="text-xs text-muted-foreground text-center">{opt.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // Map query param values to tab values
  const defaultTab = tabParam === "school" ? "profile"
    : tabParam === "profile" ? "preferences"
    : "profile";

  const { school, loading, saving, updateSchool } = useSchoolSettings();

  if (loading && !school) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your school profile, academic preferences, and billing."
      />

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="bg-card border p-1 h-auto">
          <TabsTrigger value="profile" className="px-4 py-2">School Profile</TabsTrigger>
          <TabsTrigger value="preferences" className="px-4 py-2">Preferences</TabsTrigger>
          <TabsTrigger value="academic" className="px-4 py-2">Academic</TabsTrigger>
          <TabsTrigger value="billing" className="px-4 py-2">Billing & Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SchoolProfileForm
                initialData={school || undefined}
                onSubmit={updateSchool}
                isLoading={saving}
              />
            </div>
            <div className="space-y-6">
              <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Profile Tips
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-disc pl-4">
                  <li>Ensure your school code is shared with new staff/students correctly.</li>
                  <li>Upload a high-quality logo for documentation.</li>
                  <li>Keep contact information up to date for notifications.</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="max-w-2xl space-y-6">
            <ThemeSelector />
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
               <AcademicSettingsForm
                initialData={school || undefined}
                onSubmit={updateSchool}
                isLoading={saving}
              />
            </div>
             <div className="space-y-6">
              <div className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900 p-4 rounded-xl">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  Academic Cycle
                </h4>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Changing the academic year start month will affect how semesters and financial years are calculated in reports.
                </p>
              </div>
            </div>
           </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="max-w-2xl">
            <BillingCard
              plan={school?.subscriptionPlan || "basic"}
              status={school?.subscriptionStatus || "active"}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
