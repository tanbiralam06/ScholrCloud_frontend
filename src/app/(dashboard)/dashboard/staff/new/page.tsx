"use client";

import { Save } from "lucide-react";
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

const departments = [
  "Administration",
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Science",
  "Computer Science",
  "Physical Education",
  "Arts",
  "Library",
  "Accounts",
];

const designations = [
  "Principal",
  "Vice Principal",
  "Senior Teacher",
  "Teacher",
  "Lab Assistant",
  "Librarian",
  "Accountant",
  "Clerk",
  "Peon",
  "Security",
];

export default function AddStaffPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Staff"
        description="Enter staff member details"
        actions={[{ label: "Cancel", href: "/dashboard/staff", variant: "ghost" }]}
      />

      <form className="space-y-8">
        {/* Personal Information */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Personal Information</h3>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" placeholder="Enter first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter last name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input id="employeeId" placeholder="e.g., EMP001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select>
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
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="email@school.com" />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Employment Information</h3>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept.toLowerCase().replace(" ", "_")}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {designations.map((des) => (
                    <SelectItem key={des} value={des.toLowerCase().replace(" ", "_")}>
                      {des}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select>
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
              <Input id="joiningDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Monthly Salary (₹)</Label>
              <Input id="salary" type="number" placeholder="e.g., 50000" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Address</h3>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Input id="address" placeholder="Enter complete address" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" size="lg">
            <Save className="w-4 h-4 mr-2" />
            Save Staff
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link href="/dashboard/staff">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
