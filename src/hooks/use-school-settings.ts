import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { SchoolProfileFormValues } from "@/lib/validators/school-settings";

export interface SchoolProfile extends SchoolProfileFormValues {
  id: string;
  code: string;
  logoUrl: string | null;
  subscriptionPlan: string;
  subscriptionStatus: string;
  createdAt: string;
  updatedAt: string | null;
}

export function useSchoolSettings() {
  const [school, setSchool] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSchool = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/schools/me");
      const data = response.data.data;
      
      // Transform API data to match strict types
      const formattedData = {
        ...data,
        academicYearStart: data.academicYearStart
          ? new Date(data.academicYearStart).toLocaleString("default", { month: "long" }).toLowerCase()
          : "april",
      };
      setSchool(formattedData);
    } catch (error) {
      console.error("Failed to fetch school profile", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load school profile.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateSchool = async (data: Partial<SchoolProfileFormValues>) => {
    try {
      setSaving(true);
      // specific transformations like month string -> date handling is done in backend controller
      // but if we need to send specific format, do it here.
      // The current backend accepts "april", "january" strings for academicYearStart update?
      // Let's check controller. Yes, controller maps month name to Date. 
      // So sending string is fine.
      
      const response = await api.put("/schools/me", data);
      setSchool(response.data.data);
      toast({
        title: "Success",
        description: "School profile updated successfully.",
      });
      return response.data.data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile.",
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSchool();
  }, [fetchSchool]);

  return {
    school,
    loading,
    saving,
    updateSchool,
    refreshSchool: fetchSchool
  };
}
