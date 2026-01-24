"use client";

import { Wallet, TrendingUp, AlertCircle, CheckCircle, Plus, Receipt } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Dummy data
const feeStats = [
  {
    title: "Total Collected",
    value: "₹18.6L",
    description: "This month",
    icon: TrendingUp,
    trend: { value: 15, isPositive: true },
  },
  {
    title: "Pending Fees",
    value: "₹2.4L",
    description: "From 142 students",
    icon: AlertCircle,
    trend: { value: 8, isPositive: false },
  },
  {
    title: "Collected Today",
    value: "₹45,500",
    description: "12 transactions",
    icon: CheckCircle,
  },
  {
    title: "Total Due",
    value: "₹4.2L",
    description: "This quarter",
    icon: Wallet,
  },
];

const pendingPayments = [
  {
    id: 1,
    student: "Rahul Sharma",
    class: "10-A",
    amount: "₹15,000",
    dueDate: "Jan 25",
    status: "overdue",
  },
  {
    id: 2,
    student: "Priya Patel",
    class: "10-A",
    amount: "₹15,000",
    dueDate: "Jan 28",
    status: "pending",
  },
  {
    id: 3,
    student: "Amit Kumar",
    class: "9-B",
    amount: "₹12,500",
    dueDate: "Jan 30",
    status: "pending",
  },
  {
    id: 4,
    student: "Sneha Gupta",
    class: "9-A",
    amount: "₹12,500",
    dueDate: "Feb 01",
    status: "pending",
  },
  {
    id: 5,
    student: "Vikram Singh",
    class: "11-A",
    amount: "₹18,000",
    dueDate: "Jan 22",
    status: "overdue",
  },
];

const recentTransactions = [
  {
    id: 1,
    student: "Ananya Iyer",
    class: "8-C",
    amount: "₹15,000",
    date: "Today, 2:30 PM",
    method: "UPI",
  },
  {
    id: 2,
    student: "Ravi Verma",
    class: "12-B",
    amount: "₹18,000",
    date: "Today, 11:15 AM",
    method: "Cash",
  },
  {
    id: 3,
    student: "Meera Nair",
    class: "7-A",
    amount: "₹12,500",
    date: "Yesterday",
    method: "Bank Transfer",
  },
  {
    id: 4,
    student: "Karan Malhotra",
    class: "11-C",
    amount: "₹18,000",
    date: "Yesterday",
    method: "UPI",
  },
];

export default function FeesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Management"
        description="Track payments, manage fee structures, and collect fees"
        actions={[
          { label: "Collect Fee", icon: Receipt, href: "/dashboard/fees/collect" },
          {
            label: "Add Structure",
            icon: Plus,
            href: "/dashboard/fees/structures",
            variant: "outline",
          },
        ]}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {feeStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/dashboard/fees/structures">Fee Structures</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/fees/payments">Payment History</Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Students with Pending Fees</h3>
            </div>
            <div className="divide-y">
              {pendingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30"
                >
                  <div>
                    <p className="font-medium">{payment.student}</p>
                    <p className="text-sm text-muted-foreground">Class {payment.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{payment.amount}</p>
                    <p className="text-sm text-muted-foreground">Due: {payment.dueDate}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      payment.status === "overdue"
                        ? "bg-red-500/10 text-red-600"
                        : "bg-amber-500/10 text-amber-600"
                    }
                  >
                    {payment.status}
                  </Badge>
                  <Button size="sm" asChild>
                    <Link href="/dashboard/fees/collect">Collect</Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-muted/30">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/fees/payments">View all pending →</Link>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Recent Transactions</h3>
            </div>
            <div className="divide-y">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30"
                >
                  <div>
                    <p className="font-medium">{tx.student}</p>
                    <p className="text-sm text-muted-foreground">Class {tx.class}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                    <Badge variant="outline">{tx.method}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">{tx.amount}</p>
                    <Badge className="bg-emerald-500/10 text-emerald-600">Paid</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-muted/30">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/fees/payments">View all transactions →</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
