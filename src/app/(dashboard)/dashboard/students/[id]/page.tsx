import { ArrowLeft, Phone, Mail, Calendar, MapPin, Edit } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Dummy student data
const student = {
  id: "1",
  admissionNumber: "2024001",
  firstName: "Rahul",
  lastName: "Sharma",
  class: "10",
  section: "A",
  rollNumber: 15,
  gender: "Male",
  dateOfBirth: "2008-05-15",
  bloodGroup: "O+",
  status: "active",
  admissionDate: "2020-04-01",
  fatherName: "Suresh Sharma",
  motherName: "Sunita Sharma",
  guardianPhone: "+91 98765 43210",
  guardianEmail: "suresh.sharma@email.com",
  address: "123, Green Park Colony, New Delhi - 110016",
  avatar: "RS",
};

const feeHistory = [
  { id: 1, type: "Tuition Fee", amount: "₹15,000", status: "paid", date: "Jan 2024" },
  { id: 2, type: "Lab Fee", amount: "₹2,500", status: "paid", date: "Jan 2024" },
  { id: 3, type: "Tuition Fee", amount: "₹15,000", status: "pending", date: "Feb 2024" },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailsPage({ params }: PageProps) {
  const { id } = await params;

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
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {student.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-muted-foreground">
                  Admission No: {student.admissionNumber} · Roll No: {student.rollNumber}
                </p>
              </div>
              <Badge
                className={
                  student.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-amber-500/10 text-amber-600"
                }
              >
                {student.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Class {student.class}-{student.section}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {student.guardianPhone}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {student.guardianEmail}
              </span>
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
                <InfoRow label="Date of Birth" value={student.dateOfBirth} />
                <InfoRow label="Gender" value={student.gender} />
                <InfoRow label="Blood Group" value={student.bloodGroup} />
                <InfoRow label="Admission Date" value={student.admissionDate} />
              </div>
            </div>

            {/* Guardian Info */}
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Guardian Information</h3>
              <div className="space-y-3">
                <InfoRow label="Father's Name" value={student.fatherName} />
                <InfoRow label="Mother's Name" value={student.motherName} />
                <InfoRow label="Phone" value={student.guardianPhone} />
                <InfoRow label="Email" value={student.guardianEmail} />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Address</h3>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5" />
              <span>{student.address}</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fees">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Fee History</h3>
            <div className="space-y-3">
              {feeHistory.map((fee) => (
                <div
                  key={fee.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{fee.type}</p>
                    <p className="text-sm text-muted-foreground">{fee.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{fee.amount}</p>
                    <Badge
                      variant="secondary"
                      className={
                        fee.status === "paid"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }
                    >
                      {fee.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
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
