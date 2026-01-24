import { GraduationCap, Users, Wallet, TrendingUp, Plus, Receipt, FileText } from "lucide-react";
import { StatCard, PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Dummy data
const stats = [
  {
    title: "Total Students",
    value: "1,247",
    description: "Active enrollments",
    icon: GraduationCap,
    trend: { value: 12, isPositive: true },
  },
  {
    title: "Total Staff",
    value: "86",
    description: "Teachers & staff",
    icon: Users,
    trend: { value: 3, isPositive: true },
  },
  {
    title: "Pending Fees",
    value: "₹2.4L",
    description: "From 142 students",
    icon: Wallet,
    trend: { value: 8, isPositive: false },
  },
  {
    title: "Monthly Revenue",
    value: "₹18.6L",
    description: "This month",
    icon: TrendingUp,
    trend: { value: 15, isPositive: true },
  },
];

const recentAdmissions = [
  { id: 1, name: "Rahul Sharma", class: "10A", date: "Jan 23", avatar: "RS" },
  { id: 2, name: "Priya Patel", class: "8B", date: "Jan 22", avatar: "PP" },
  { id: 3, name: "Amit Kumar", class: "6A", date: "Jan 21", avatar: "AK" },
  { id: 4, name: "Sneha Gupta", class: "9C", date: "Jan 20", avatar: "SG" },
  { id: 5, name: "Vikram Singh", class: "11A", date: "Jan 19", avatar: "VS" },
];

const recentPayments = [
  { id: 1, student: "Ananya Iyer", amount: "₹15,000", status: "paid", date: "Today" },
  { id: 2, student: "Ravi Verma", amount: "₹12,500", status: "paid", date: "Today" },
  { id: 3, student: "Meera Nair", amount: "₹8,000", status: "partial", date: "Yesterday" },
  { id: 4, student: "Karan Malhotra", amount: "₹15,000", status: "paid", date: "Yesterday" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Welcome back, Admin! 👋"
        description="Here's what's happening at your school today."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/dashboard/students/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/fees/collect">
            <Receipt className="w-4 h-4 mr-2" />
            Collect Fee
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/staff/new">
            <Users className="w-4 h-4 mr-2" />
            Add Staff
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/dashboard/fees">
            <FileText className="w-4 h-4 mr-2" />
            View Reports
          </Link>
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Admissions */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Admissions</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/students">View all</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {recentAdmissions.map((student) => (
              <div key={student.id} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/placeholder-${student.id}.jpg`} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {student.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{student.name}</p>
                  <p className="text-xs text-muted-foreground">Class {student.class}</p>
                </div>
                <span className="text-xs text-muted-foreground">{student.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Payments</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/fees/payments">View all</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{payment.student}</p>
                  <p className="text-xs text-muted-foreground">{payment.date}</p>
                </div>
                <span className="font-semibold text-sm">{payment.amount}</span>
                <Badge
                  variant={payment.status === "paid" ? "default" : "secondary"}
                  className={
                    payment.status === "paid"
                      ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                      : ""
                  }
                >
                  {payment.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
