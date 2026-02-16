"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
}

interface Designation {
  id: string;
  title: string;
}

const roles = [
  { value: "teacher", label: "Teacher" },
  { value: "principal", label: "Principal" },
  { value: "vice_principal", label: "Vice Principal" },
  { value: "accountant", label: "Accountant" },
  { value: "librarian", label: "Librarian" },
];

export default function AddStaffPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);

  // Success dialog state
  const [successData, setSuccessData] = useState<{
    email: string;
    password: string;
    name: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    employeeId: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    department: "",
    designation: "",
    employmentType: "permanent",
    joiningDate: "",
    salary: "",
    address: "",
    role: "teacher",
    password: "",
  });

  // Fetch master data for dropdowns
  const fetchMasterData = useCallback(async () => {
    try {
      const [deptRes, desigRes] = await Promise.all([
        api.get("/departments"),
        api.get("/designations"),
      ]);
      setDepartments(deptRes.data.data || []);
      setDesignations(desigRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch master data:", error);
    }
  }, []);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      // Build payload, only send non-empty values
      const payload: Record<string, string> = {};
      for (const [key, value] of Object.entries(form)) {
        if (value) payload[key] = value;
      }

      const res = await api.post("/staff", payload);

      // If default password was generated, show the credentials dialog
      if (res.data.data?.defaultPassword) {
        setSuccessData({
          email: form.email,
          password: res.data.data.defaultPassword,
          name: `${form.firstName} ${form.lastName}`.trim(),
        });
      } else {
        // No default password — just show toast and redirect
        toast({
          title: "Staff member created",
          description: `${form.firstName} ${form.lastName} has been added successfully.`,
        });
        router.push("/dashboard/staff");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create staff",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!successData) return;
    navigator.clipboard.writeText(
      `Email: ${successData.email}\nPassword: ${successData.password}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSuccessClose = () => {
    setSuccessData(null);
    router.push("/dashboard/staff");
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Staff"
        description="Enter staff member details"
        actions={[{ label: "Cancel", href: "/dashboard/staff", variant: "ghost" }]}
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Personal Information</h3>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input
                id="employeeId"
                placeholder="e.g., EMP001"
                value={form.employeeId}
                onChange={(e) => updateField("employeeId", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={form.gender} onValueChange={(val) => updateField("gender", val)}>
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
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@school.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Employment Information</h3>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">System Role *</Label>
              <Select value={form.role} onValueChange={(val) => updateField("role", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={form.department} onValueChange={(val) => updateField("department", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Select
                value={form.designation}
                onValueChange={(val) => updateField("designation", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {designations.map((des) => (
                    <SelectItem key={des.id} value={des.title}>
                      {des.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select
                value={form.employmentType}
                onValueChange={(val) => updateField("employmentType", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="joiningDate">Joining Date</Label>
              <Input
                id="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={(e) => updateField("joiningDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Monthly Salary (₹)</Label>
              <Input
                id="salary"
                type="number"
                placeholder="e.g., 50000"
                value={form.salary}
                onChange={(e) => updateField("salary", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Login Credentials */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Login Credentials</h3>
          <Separator />
          <p className="text-sm text-muted-foreground">
            A user account will be created automatically. If no password is set, the Employee ID will
            be used as the default password.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loginEmail">Login Email</Label>
              <Input id="loginEmail" type="email" value={form.email} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (Optional)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Leave blank for default (Employee ID)"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Address</h3>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              placeholder="Enter complete address"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Staff
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link href="/dashboard/staff">Cancel</Link>
          </Button>
        </div>
      </form>

      {/* ── Success Credentials Dialog ── */}
      <Dialog open={!!successData} onOpenChange={(open) => !open && handleSuccessClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <DialogTitle className="text-center">Staff Member Created!</DialogTitle>
            <DialogDescription className="text-center">
              <strong>{successData?.name}</strong> has been added successfully. Share the login
              credentials below with the staff member.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium font-mono">{successData?.email}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Password</span>
              <span className="font-medium font-mono">{successData?.password}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Please ask the staff member to change their password after first login.
          </p>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleCopyCredentials}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Credentials
                </>
              )}
            </Button>
            <Button className="w-full sm:w-auto" onClick={handleSuccessClose}>
              Go to Staff List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
