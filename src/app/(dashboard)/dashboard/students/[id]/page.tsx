"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, Phone, Mail, Calendar, MapPin, Edit, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStudent, type StudentDetail } from "@/lib/validators/studentsApi";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await getStudent(id);
        setStudent(res.data);
      } catch (error) {
        console.error("Failed to fetch student:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Student Details"
          actions={[
            { label: "Back", icon: ArrowLeft, href: "/dashboard/students", variant: "ghost" },
          ]}
        />
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Student Details"
          actions={[
            { label: "Back", icon: ArrowLeft, href: "/dashboard/students", variant: "ghost" },
          ]}
        />
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Student not found</p>
        </div>
      </div>
    );
  }

  const getInitials = (first: string, last: string | null) =>
    `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600";
      case "alumni":
        return "bg-blue-500/10 text-blue-600";
      case "transferred":
        return "bg-amber-500/10 text-amber-600";
      case "expelled":
        return "bg-red-500/10 text-red-600";
      default:
        return "";
    }
  };

  const classDisplay = student.className
    ? student.sectionName
      ? `${student.className}-${student.sectionName}`
      : student.className
    : "—";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Details"
        actions={[
          { label: "Back", icon: ArrowLeft, href: "/dashboard/students", variant: "ghost" },
          { label: "Edit", icon: Edit, href: `/dashboard/students/${id}/edit` },
        ]}
      />

      {/* Profile Header */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {getInitials(student.firstName, student.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {student.firstName} {student.lastName || ""}
                </h2>
                <p className="text-muted-foreground">
                  Admission No: {student.admissionNumber}
                  {student.rollNumber ? ` · Roll No: ${student.rollNumber}` : ""}
                </p>
              </div>
              <Badge className={getStatusColor(student.status)}>
                {student.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Class {classDisplay}
              </span>
              {student.guardianPhone && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {student.guardianPhone}
                </span>
              )}
              {student.guardianEmail && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {student.guardianEmail}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="fees">Fee History</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Personal Information</h3>
              <div className="space-y-3">
                <InfoRow label="Date of Birth" value={student.dateOfBirth || "—"} />
                <InfoRow label="Gender" value={student.gender || "—"} />
                <InfoRow label="Blood Group" value={student.bloodGroup || "—"} />
                <InfoRow label="Admission Date" value={student.admissionDate || "—"} />
              </div>
            </div>

            {/* Guardian Info */}
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Guardian Information</h3>
              <div className="space-y-3">
                <InfoRow label="Father's Name" value={student.fatherName || "—"} />
                <InfoRow label="Mother's Name" value={student.motherName || "—"} />
                <InfoRow label="Phone" value={student.guardianPhone || "—"} />
                <InfoRow label="Email" value={student.guardianEmail || "—"} />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Address</h3>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5" />
              <span>{student.address || "Not provided"}</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fees">
          <div className="bg-card border rounded-xl p-6 text-center py-12">
            <p className="text-muted-foreground">Fee history will be available after fee module integration</p>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="bg-card border rounded-xl p-6 text-center py-12">
            <p className="text-muted-foreground">Attendance tracking coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
