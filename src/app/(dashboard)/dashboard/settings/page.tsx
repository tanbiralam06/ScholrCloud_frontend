"use client";

import { Save, Upload } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Dummy school data
const school = {
  name: "Delhi Public School",
  code: "DPS-DEL-001",
  email: "info@dpschool.edu.in",
  phone: "+91 11 2345 6789",
  address: "Sector 24, Dwarka, New Delhi - 110077",
  city: "New Delhi",
  state: "Delhi",
  country: "India",
  subscriptionPlan: "pro",
  academicYearStart: "April",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your school profile and preferences" />

      <Tabs defaultValue="school" className="space-y-6">
        <TabsList>
          <TabsTrigger value="school">School Profile</TabsTrigger>
          <TabsTrigger value="academic">Academic Settings</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="school">
          <form className="space-y-6">
            {/* Logo */}
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-4">School Logo</h3>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/school-logo.png" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    DPS
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" type="button">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 200x200px, PNG or JPG
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-card border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold">Basic Information</h3>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>School Name *</Label>
                  <Input defaultValue={school.name} />
                </div>
                <div className="space-y-2">
                  <Label>School Code</Label>
                  <Input defaultValue={school.code} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" defaultValue={school.email} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue={school.phone} />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-card border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold">Address</h3>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Street Address</Label>
                  <Input defaultValue={school.address} />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input defaultValue={school.city} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input defaultValue={school.state} />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input defaultValue={school.country} />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="academic">
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Academic Year Settings</h3>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div className="space-y-2">
                <Label>Academic Year Starts</Label>
                <Select defaultValue="april">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">January</SelectItem>
                    <SelectItem value="april">April</SelectItem>
                    <SelectItem value="june">June</SelectItem>
                    <SelectItem value="september">September</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select defaultValue="asia_kolkata">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asia_kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Current Plan</h3>
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex-1">
                <p className="font-semibold text-lg">Pro Plan</p>
                <p className="text-sm text-muted-foreground">
                  Unlimited students · Advanced reports · Priority support
                </p>
              </div>
              <Button variant="outline">Manage Subscription</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your subscription renews on April 1, 2024
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
