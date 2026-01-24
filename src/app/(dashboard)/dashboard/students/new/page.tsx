"use client";

import { ArrowLeft, Save } from "lucide-react";
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

export default function AddStudentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Student"
        description="Enter student details to create a new admission"
        actions={[{ label: "Cancel", href: "/dashboard/students", variant: "ghost" }]}
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
              <Label htmlFor="admissionNumber">Admission Number *</Label>
              <Input id="admissionNumber" placeholder="e.g., 2024001" />
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
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select>
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
              <Label htmlFor="class">Class *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(12)].map((_, i) => (
                    <SelectItem key={i + 1} value={`${i + 1}`}>
                      Class {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                  <SelectItem value="D">Section D</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input id="rollNumber" type="number" placeholder="e.g., 15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionDate">Admission Date</Label>
              <Input id="admissionDate" type="date" />
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
              <Input id="fatherName" placeholder="Enter father's name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherName">Mother&apos;s Name</Label>
              <Input id="motherName" placeholder="Enter mother's name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianPhone">Guardian Phone *</Label>
              <Input id="guardianPhone" placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianEmail">Guardian Email</Label>
              <Input id="guardianEmail" type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter complete address" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" size="lg">
            <Save className="w-4 h-4 mr-2" />
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
