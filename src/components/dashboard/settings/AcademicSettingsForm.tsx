"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { schoolProfileSchema, SchoolProfileFormValues } from "@/lib/validators/school-settings";

// Extend or pick from the main schema if needed, or just use partial
// For simplicity, we can use the same schema but only render relevant fields.
// Or better, creating a specific schema for this form to avoid validation errors on hidden fields?
// No, the update is partial.

interface AcademicSettingsFormProps {
  initialData?: SchoolProfileFormValues;
  onSubmit: (data: Partial<SchoolProfileFormValues>) => Promise<void>;
  isLoading: boolean;
}

export function AcademicSettingsForm({ initialData, onSubmit, isLoading }: AcademicSettingsFormProps) {
  const form = useForm<SchoolProfileFormValues>({
    resolver: zodResolver(schoolProfileSchema) as any,
    defaultValues: initialData || {
      academicYearStart: "april",
      timezone: "Asia/Kolkata",
    },
  });

  const { isSubmitting } = form.formState;

  // We only want to submit the fields we are editing
  const handleSubmit = async (data: SchoolProfileFormValues) => {
    // Filter to only academic fields
    await onSubmit({
      academicYearStart: data.academicYearStart,
      timezone: data.timezone,
    });
  };

  return (
    <div className="bg-card border rounded-xl p-6 space-y-4">
      <h3 className="font-semibold">Academic Year Settings</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="academicYearStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year Starts</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "april"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="january">January</SelectItem>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="june">June</SelectItem>
                      <SelectItem value="september">September</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "Asia/Kolkata"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (US)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
