"use client";

import { PageHeader } from "@/components/dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchoolProfileForm } from "@/components/dashboard/settings/SchoolProfileForm";
import { AcademicSettingsForm } from "@/components/dashboard/settings/AcademicSettingsForm";
import { BillingCard } from "@/components/dashboard/settings/BillingCard";
import { useSchoolSettings } from "@/hooks/use-school-settings";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
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

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-card border p-1 h-auto">
          <TabsTrigger value="profile" className="px-4 py-2">School Profile</TabsTrigger>
          <TabsTrigger value="academic" className="px-4 py-2">Academic & Preferences</TabsTrigger>
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
