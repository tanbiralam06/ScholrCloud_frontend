"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
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
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { createStudent } from "@/lib/validators/studentsApi";

interface ClassItem {
  id: string;
  name: string;
}

interface SectionItem {
  id: string;
  name: string;
  classId: string;
}

export default function AddStudentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [allSections, setAllSections] = useState<SectionItem[]>([]);
  const [filteredSections, setFilteredSections] = useState<SectionItem[]>([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    admissionNumber: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    classId: "",
    sectionId: "",
    rollNumber: "",
    admissionDate: "",
    fatherName: "",
    motherName: "",
    guardianPhone: "",
    guardianEmail: "",
    address: "",
  });

  // Fetch classes & sections for dropdowns
  const fetchMasterData = useCallback(async () => {
    try {
      const [classRes, sectionRes] = await Promise.all([
        api.get("/classes"),
        api.get("/sections"),
      ]);
      setClasses(classRes.data.data || []);
      setAllSections(sectionRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch master data:", error);
    }
  }, []);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  // Filter sections when class changes
  useEffect(() => {
    if (form.classId) {
      setFilteredSections(allSections.filter((s) => s.classId === form.classId));
    } else {
      setFilteredSections([]);
    }
    // Reset section when class changes
    setForm((prev) => ({ ...prev, sectionId: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.classId, allSections]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      // Build payload, only send non-empty values
      const payload: Record<string, any> = {};
      for (const [key, value] of Object.entries(form)) {
        if (value !== "") {
          if (key === "rollNumber") {
            payload[key] = parseInt(value);
          } else {
            payload[key] = value;
          }
        }
      }

      await createStudent(payload as any);

      toast({
        title: "Student created",
        description: `${form.firstName} ${form.lastName} has been added successfully.`,
      });
      router.push("/dashboard/students");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create student",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Student"
        description="Enter student details to create a new admission"
        actions={[{ label: "Cancel", href: "/dashboard/students", variant: "ghost" }]}
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
              <Label htmlFor="admissionNumber">Admission Number *</Label>
              <Input
                id="admissionNumber"
                placeholder="e.g., 2024001"
                value={form.admissionNumber}
                onChange={(e) => updateField("admissionNumber", e.target.value)}
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
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select
                value={form.bloodGroup}
                onValueChange={(val) => updateField("bloodGroup", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Academic Information</h3>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select
                value={form.classId}
                onValueChange={(val) => updateField("classId", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select
                value={form.sectionId}
                onValueChange={(val) => updateField("sectionId", val)}
                disabled={!form.classId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={form.classId ? "Select section" : "Select class first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredSections.map((sec) => (
                    <SelectItem key={sec.id} value={sec.id}>
                      {sec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                type="number"
                placeholder="e.g., 15"
                value={form.rollNumber}
                onChange={(e) => updateField("rollNumber", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionDate">Admission Date</Label>
              <Input
                id="admissionDate"
                type="date"
                value={form.admissionDate}
                onChange={(e) => updateField("admissionDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Guardian Information</h3>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father&apos;s Name</Label>
              <Input
                id="fatherName"
                placeholder="Enter father's name"
                value={form.fatherName}
                onChange={(e) => updateField("fatherName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherName">Mother&apos;s Name</Label>
              <Input
                id="motherName"
                placeholder="Enter mother's name"
                value={form.motherName}
                onChange={(e) => updateField("motherName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianPhone">Guardian Phone</Label>
              <Input
                id="guardianPhone"
                placeholder="+91 98765 43210"
                value={form.guardianPhone}
                onChange={(e) => updateField("guardianPhone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianEmail">Guardian Email</Label>
              <Input
                id="guardianEmail"
                type="email"
                placeholder="email@example.com"
                value={form.guardianEmail}
                onChange={(e) => updateField("guardianEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter complete address"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
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
            Save Student
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link href="/dashboard/students">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
