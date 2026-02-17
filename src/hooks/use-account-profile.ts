import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface AccountProfile {
  // User fields
  id: string;
  email: string;
  role: string;
  schoolId: string | null;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  // Staff fields (null if no linked staff record)
  staffId: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  designation: string | null;
  department: string | null;
  employeeId: string | null;
  joiningDate: string | null;
  address: string | null;
  photoUrl: string | null;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
}

export function useAccountProfile() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/me");
      setProfile(response.data.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your profile.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setSaving(true);
      const response = await api.put("/auth/me", data);
      setProfile(response.data.data);
      toast({
        title: "Success",
        description: "Profile updated successfully.",
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
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    saving,
    updateProfile,
    refreshProfile: fetchProfile,
  };
}
