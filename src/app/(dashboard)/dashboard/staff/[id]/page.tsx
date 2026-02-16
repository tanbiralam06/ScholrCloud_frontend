"use client";

import { useEffect, useState, useCallback, use } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  IndianRupee,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";

interface StaffMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string | null;
  designation: string | null;
  department: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  joiningDate: string | null;
  employmentType: string | null;
  salary: string | null;
  address: string | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StaffDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/staff/${id}`);
      setStaff(res.data.data);
    } catch (error) {
      console.error("Failed to fetch staff member:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Staff Details"
          actions={[{ label: "Back", icon: ArrowLeft, href: "/dashboard/staff", variant: "ghost" }]}
        />
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Staff Details"
          actions={[{ label: "Back", icon: ArrowLeft, href: "/dashboard/staff", variant: "ghost" }]}
        />
        <div className="text-center py-12 text-muted-foreground">Staff member not found.</div>
      </div>
    );
  }

  const initials =
    `${staff.firstName?.[0] || ""}${staff.lastName?.[0] || ""}`.toUpperCase();

  const statusColor =
    staff.status === "active"
      ? "bg-emerald-500/10 text-emerald-600"
      : staff.status === "on_leave"
      ? "bg-blue-500/10 text-blue-600"
      : "bg-amber-500/10 text-amber-600";

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = (s: string | null) => {
    if (!s) return "—";
    return `₹${Number(s).toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Details"
        actions={[
          { label: "Back", icon: ArrowLeft, href: "/dashboard/staff", variant: "ghost" },
        ]}
      />

      {/* Profile Header */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {staff.firstName} {staff.lastName || ""}
                </h2>
                <p className="text-muted-foreground">
                  {staff.designation || "No designation"} · {staff.department || "No department"}
                </p>
              </div>
              <div className="flex gap-2">
                {staff.employmentType && (
                  <Badge variant="outline" className="capitalize">
                    {staff.employmentType.replace("_", " ")}
                  </Badge>
                )}
                <Badge className={statusColor}>{staff.status.replace("_", " ")}</Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                {staff.employeeId}
              </span>
              {staff.phone && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {staff.phone}
                </span>
              )}
              {staff.email && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {staff.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Date of Birth" value={formatDate(staff.dateOfBirth)} />
              <InfoRow label="Gender" value={staff.gender || "—"} />
              <InfoRow label="Joining Date" value={formatDate(staff.joiningDate)} />
              <InfoRow
                label="Employment Type"
                value={staff.employmentType?.replace("_", " ") || "—"}
              />
            </div>
          </div>

          {/* Address */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Contact Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{staff.address || "No address provided"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Salary Card */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Salary Information</h3>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{formatSalary(staff.salary)}</span>
              {staff.salary && <span className="text-muted-foreground">/month</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-sm text-muted-foreground">{label}</span>
      <p className="font-medium capitalize">{value}</p>
    </div>
  );
}
