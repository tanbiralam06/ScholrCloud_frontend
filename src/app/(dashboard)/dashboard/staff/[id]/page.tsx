import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Edit,
  Briefcase,
  IndianRupee,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Dummy staff data
const staff = {
  id: "1",
  employeeId: "EMP003",
  firstName: "Amit",
  lastName: "Sharma",
  designation: "Senior Teacher",
  department: "Mathematics",
  gender: "Male",
  dateOfBirth: "1985-08-20",
  phone: "+91 98765 33333",
  email: "amit.sharma@school.com",
  status: "active",
  joiningDate: "2015-06-01",
  employmentType: "permanent",
  salary: "₹65,000",
  address: "456, Shanti Nagar, Mumbai - 400001",
  avatar: "AS",
};

const assignedClasses = [
  { class: "10-A", subject: "Mathematics" },
  { class: "10-B", subject: "Mathematics" },
  { class: "11-A", subject: "Mathematics" },
  { class: "12-A", subject: "Mathematics" },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StaffDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Details"
        actions={[
          { label: "Back", icon: ArrowLeft, href: "/dashboard/staff", variant: "ghost" },
          { label: "Edit", icon: Edit, href: `/dashboard/staff/${id}/edit` },
        ]}
      />

      {/* Profile Header */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {staff.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {staff.firstName} {staff.lastName}
                </h2>
                <p className="text-muted-foreground">
                  {staff.designation} · {staff.department}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{staff.employmentType}</Badge>
                <Badge
                  className={
                    staff.status === "active"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-amber-500/10 text-amber-600"
                  }
                >
                  {staff.status}
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                {staff.employeeId}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {staff.phone}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {staff.email}
              </span>
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
              <InfoRow label="Date of Birth" value={staff.dateOfBirth} />
              <InfoRow label="Gender" value={staff.gender} />
              <InfoRow label="Joining Date" value={staff.joiningDate} />
              <InfoRow label="Employment Type" value={staff.employmentType} />
            </div>
          </div>

          {/* Address */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Contact Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{staff.address}</span>
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
              <span className="text-2xl font-bold">{staff.salary}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>

          {/* Assigned Classes */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Assigned Classes</h3>
            <div className="space-y-2">
              {assignedClasses.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="font-medium">Class {item.class}</span>
                  <Badge variant="outline">{item.subject}</Badge>
                </div>
              ))}
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
      <p className="font-medium">{value}</p>
    </div>
  );
}
