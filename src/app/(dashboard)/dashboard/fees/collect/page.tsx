"use client";

import { Receipt, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Dummy student for preview
const selectedStudent = {
  name: "Rahul Sharma",
  class: "10-A",
  admissionNo: "2024001",
  pendingAmount: "₹15,000",
  feeType: "Tuition Fee (January 2024)",
};

export default function CollectFeePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Collect Fee"
        description="Record a new fee payment"
        actions={[{ label: "Cancel", href: "/dashboard/fees", variant: "ghost" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Search */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Student Information</h3>
            <Separator />
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by name or admission number..." className="pl-9" />
              </div>
              <Button>Find Student</Button>
            </div>

            {/* Selected Student Preview */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Class {selectedStudent.class} · Adm. No: {selectedStudent.admissionNo}
                  </p>
                </div>
                <Badge variant="outline">Selected</Badge>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Payment Details</h3>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fee Type *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tuition">Tuition Fee</SelectItem>
                    <SelectItem value="lab">Lab Fee</SelectItem>
                    <SelectItem value="library">Library Fee</SelectItem>
                    <SelectItem value="transport">Transport Fee</SelectItem>
                    <SelectItem value="computer">Computer Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount Due</Label>
                <Input value="₹15,000" disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Amount Paying *</Label>
                <Input type="number" placeholder="Enter amount" defaultValue="15000" />
              </div>
              <div className="space-y-2">
                <Label>Discount</Label>
                <Input type="number" placeholder="0" defaultValue="0" />
              </div>
              <div className="space-y-2">
                <Label>Fine</Label>
                <Input type="number" placeholder="0" defaultValue="0" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Transaction ID (if online)</Label>
                <Input placeholder="Enter transaction/UPI reference ID" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Remarks</Label>
                <Input placeholder="Any additional notes..." />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <Button size="lg">
              <Receipt className="w-4 h-4 mr-2" />
              Collect Payment
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard/fees">Cancel</Link>
            </Button>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 sticky top-20">
            <h3 className="font-semibold mb-4">Payment Summary</h3>
            <Separator className="mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee Type</span>
                <span>Tuition Fee</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Due</span>
                <span>₹15,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-emerald-600">- ₹0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fine</span>
                <span className="text-red-600">+ ₹0</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Payable</span>
                <span>₹15,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
