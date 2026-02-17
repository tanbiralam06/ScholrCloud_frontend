"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Save, Pencil, X, User, Mail, Briefcase, Phone, MapPin, Calendar, Shield, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AccountProfile, UpdateProfileData } from "@/hooks/use-account-profile";

interface AccountProfileCardProps {
  profile: AccountProfile;
  onSubmit: (data: UpdateProfileData) => Promise<void>;
  isLoading: boolean;
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="p-2 rounded-lg bg-muted/60">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function formatRole(role: string) {
  return role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function AccountProfileCard({ profile, onSubmit, isLoading }: AccountProfileCardProps) {
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<UpdateProfileData>({
    defaultValues: {
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phone: profile.phone || "",
      gender: profile.gender || "",
      dateOfBirth: profile.dateOfBirth || "",
      address: profile.address || "",
    },
  });

  const hasStaffProfile = !!profile.staffId;
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.email;
  const initials = profile.firstName
    ? `${profile.firstName[0]}${profile.lastName?.[0] || ""}`.toUpperCase()
    : profile.email.substring(0, 2).toUpperCase();

  const onFormSubmit = async (data: UpdateProfileData) => {
    await onSubmit(data);
    setEditing(false);
  };

  const handleCancel = () => {
    reset({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phone: profile.phone || "",
      gender: profile.gender || "",
      dateOfBirth: profile.dateOfBirth || "",
      address: profile.address || "",
    });
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <div className="px-6 pb-6 -mt-10">
          <div className="flex items-end gap-4">
            <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
              <AvatarImage src={profile.photoUrl || undefined} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 pb-1">
              <h2 className="text-lg font-semibold truncate">{fullName}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  {formatRole(profile.role)}
                </Badge>
                {profile.designation && (
                  <Badge variant="outline" className="text-xs">
                    {profile.designation}
                  </Badge>
                )}
              </div>
            </div>
            {hasStaffProfile && !editing && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="shrink-0">
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      {!editing ? (
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-1">Personal Details</h3>
          <p className="text-sm text-muted-foreground mb-4">Your account information</p>
          <Separator className="mb-2" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <InfoRow icon={Mail} label="Email" value={profile.email} />
            <InfoRow icon={Phone} label="Phone" value={profile.phone} />
            <InfoRow icon={User} label="Gender" value={profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : null} />
            <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
            <InfoRow icon={Briefcase} label="Department" value={profile.department} />
            <InfoRow icon={Hash} label="Employee ID" value={profile.employeeId} />
            <InfoRow icon={Calendar} label="Joining Date" value={formatDate(profile.joiningDate)} />
            <InfoRow icon={MapPin} label="Address" value={profile.address} />
          </div>

          {!hasStaffProfile && (
            <div className="mt-4 p-4 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Your account doesn&apos;t have a linked staff profile yet. Contact your administrator to set one up.
              </p>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onFormSubmit)} className="bg-card border rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Edit Personal Details</h3>
              <p className="text-sm text-muted-foreground">Update your personal information</p>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input {...register("firstName")} placeholder="First name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input {...register("lastName")} placeholder="Last name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input {...register("phone")} placeholder="Phone number" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select
                defaultValue={profile.gender || ""}
                onValueChange={(val) => setValue("gender", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <Input type="date" {...register("dateOfBirth")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Address</label>
              <Textarea {...register("address")} placeholder="Full address" rows={3} />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
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
          </div>
        </form>
      )}
    </div>
  );
}
