"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
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
import {
  getStudent,
  updateStudent,
  type StudentDetail,
  type UpdateStudentPayload,
} from "@/lib/validators/studentsApi";

interface ClassItem {
  id: string;
  name: string;
}

interface SectionItem {
  id: string;
  name: string;
  classId: string;
}

export default function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
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
    status: "",
  });

  // Fetch student data + master data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentRes, classRes, sectionRes] = await Promise.all([
        getStudent(id),
        api.get("/classes"),
        api.get("/sections"),
      ]);

      const student: StudentDetail = studentRes.data;
      const classList = classRes.data.data || [];
      const sectionList = sectionRes.data.data || [];

      setClasses(classList);
      setAllSections(sectionList);

      // Pre-populate form
      setForm({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        admissionNumber: student.admissionNumber || "",
        dateOfBirth: student.dateOfBirth
          ? student.dateOfBirth.substring(0, 10)
          : "",
        gender: student.gender || "",
        bloodGroup: student.bloodGroup || "",
        classId: student.classId || "",
        sectionId: student.sectionId || "",
        rollNumber: student.rollNumber?.toString() || "",
        admissionDate: student.admissionDate
          ? student.admissionDate.substring(0, 10)
          : "",
        fatherName: student.fatherName || "",
        motherName: student.motherName || "",
        guardianPhone: student.guardianPhone || "",
        guardianEmail: student.guardianEmail || "",
        address: student.address || "",
        status: student.status || "active",
      });

      // Pre-filter sections for the student's class
      if (student.classId) {
        setFilteredSections(
          sectionList.filter((s: SectionItem) => s.classId === student.classId)
        );
      }
    } catch (error) {
      console.error("Failed to fetch student:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load student data.",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Re-filter sections when class changes (user interaction only)
  const handleClassChange = (val: string) => {
    setForm((prev) => ({ ...prev, classId: val, sectionId: "" }));
    setFilteredSections(allSections.filter((s) => s.classId === val));
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      const payload: UpdateStudentPayload = {};
      for (const [key, value] of Object.entries(form)) {
        if (value !== "") {
          if (key === "rollNumber") {
            (payload as any)[key] = parseInt(value);
          } else {
            (payload as any)[key] = value;
          }
        }
      }

      await updateStudent(id, payload);

      toast({
        title: "Student updated",
        description: `${form.firstName} ${form.lastName} has been updated successfully.`,
      });
      router.push(`/dashboard/students/${id}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update student",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Student"
          description="Loading student details..."
          actions={[
            { label: "Cancel", href: `/dashboard/students/${id}`, variant: "ghost" },
          ]}
        />
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Student"
        description={`Update details for ${form.firstName} ${form.lastName}`}
        actions={[
          { label: "Cancel", href: `/dashboard/students/${id}`, variant: "ghost" },
        ]}
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
                onChange={(e) =>
                  updateField("admissionNumber", e.target.value)
                }
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
              <Select
                value={form.gender}
                onValueChange={(val) => updateField("gender", val)}
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
                onValueChange={handleClassChange}
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
                  <SelectValue
                    placeholder={
                      form.classId ? "Select section" : "Select class first"
                    }
                  />
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

        {/* Status */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Status</h3>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Student Status</Label>
              <Select
                value={form.status}
                onValueChange={(val) => updateField("status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                  <SelectItem value="expelled">Expelled</SelectItem>
                </SelectContent>
              </Select>
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
                onChange={(e) =>
                  updateField("guardianEmail", e.target.value)
                }
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
            Update Student
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link href={`/dashboard/students/${id}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
