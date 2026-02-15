"use client";

import { useEffect, useState } from "react";
import { Save, Upload, Loader2 } from "lucide-react";
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
import { api } from "@/lib/api";

interface SchoolProfile {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  logoUrl: string | null;
  subscriptionPlan: string;
  subscriptionStatus: string;
  academicYearStart: string | null;
  timezone: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export default function SettingsPage() {
  const [school, setSchool] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    timezone: "Asia/Kolkata",
    academicYearStart: "april",
  });

  useEffect(() => {
    fetchSchool();
  }, []);

  const fetchSchool = async () => {
    try {
      const response = await api.get("/schools/me");
      const data = response.data.data;
      setSchool(data);
      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "India",
        timezone: data.timezone || "Asia/Kolkata",
        academicYearStart: data.academicYearStart ? "april" : "april",
      });
    } catch (error) {
      console.error("Failed to fetch school profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await api.put("/schools/me", form);
      setSchool(response.data.data);
      setMessage({ type: "success", text: "School profile updated successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update school profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" description="Manage your school profile and preferences" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const schoolInitials = school?.name
    ? school.name.split(" ").map((w) => w[0]).join("").substring(0, 3).toUpperCase()
    : "SCH";

  const planLabel = school?.subscriptionPlan
    ? school.subscriptionPlan.charAt(0).toUpperCase() + school.subscriptionPlan.slice(1) + " Plan"
    : "Basic Plan";

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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Message */}
            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === "success"
                    ? "bg-green-500/10 text-green-600 border border-green-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Logo */}
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-4">School Logo</h3>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={school?.logoUrl || "/school-logo.png"} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {schoolInitials}
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
                  <Input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>School Code</Label>
                  <Input value={school?.code || ""} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
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
                  <Input
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    value={form.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
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
                <Select
                  value={form.academicYearStart}
                  onValueChange={(v) => handleChange("academicYearStart", v)}
                >
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
                <Select
                  value={form.timezone}
                  onValueChange={(v) => handleChange("timezone", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Current Plan</h3>
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex-1">
                <p className="font-semibold text-lg">{planLabel}</p>
                <p className="text-sm text-muted-foreground">
                  {school?.subscriptionPlan === "pro"
                    ? "Unlimited students · Advanced reports · Priority support"
                    : school?.subscriptionPlan === "enterprise"
                      ? "Everything in Pro · Custom integrations · Dedicated support"
                      : "Up to 500 students · Basic reports · Email support"}
                </p>
              </div>
              <Button variant="outline">Manage Subscription</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Status: <span className="font-medium capitalize">{school?.subscriptionStatus}</span>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
