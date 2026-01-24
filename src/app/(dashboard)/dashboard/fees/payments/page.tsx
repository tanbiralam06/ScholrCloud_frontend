"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download, ArrowUpDown } from "lucide-react";
import { PageHeader, DataTable } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Types
interface Payment {
  id: string;
  receiptNo: string;
  student: string;
  class: string;
  feeType: string;
  amount: string;
  method: string;
  date: string;
  status: "paid" | "partial";
}

// Dummy data
const payments: Payment[] = [
  {
    id: "1",
    receiptNo: "RCP-2024-001",
    student: "Rahul Sharma",
    class: "10-A",
    feeType: "Tuition Fee",
    amount: "₹15,000",
    method: "UPI",
    date: "2024-01-23",
    status: "paid",
  },
  {
    id: "2",
    receiptNo: "RCP-2024-002",
    student: "Priya Patel",
    class: "10-A",
    feeType: "Tuition Fee",
    amount: "₹15,000",
    method: "Cash",
    date: "2024-01-23",
    status: "paid",
  },
  {
    id: "3",
    receiptNo: "RCP-2024-003",
    student: "Amit Kumar",
    class: "9-B",
    feeType: "Lab Fee",
    amount: "₹2,500",
    method: "Bank Transfer",
    date: "2024-01-22",
    status: "paid",
  },
  {
    id: "4",
    receiptNo: "RCP-2024-004",
    student: "Sneha Gupta",
    class: "9-A",
    feeType: "Tuition Fee",
    amount: "₹8,000",
    method: "UPI",
    date: "2024-01-22",
    status: "partial",
  },
  {
    id: "5",
    receiptNo: "RCP-2024-005",
    student: "Vikram Singh",
    class: "11-A",
    feeType: "Tuition Fee",
    amount: "₹18,000",
    method: "Cheque",
    date: "2024-01-21",
    status: "paid",
  },
  {
    id: "6",
    receiptNo: "RCP-2024-006",
    student: "Ananya Iyer",
    class: "8-C",
    feeType: "Computer Fee",
    amount: "₹1,000",
    method: "UPI",
    date: "2024-01-21",
    status: "paid",
  },
  {
    id: "7",
    receiptNo: "RCP-2024-007",
    student: "Ravi Verma",
    class: "12-B",
    feeType: "Tuition Fee",
    amount: "₹18,000",
    method: "Cash",
    date: "2024-01-20",
    status: "paid",
  },
  {
    id: "8",
    receiptNo: "RCP-2024-008",
    student: "Meera Nair",
    class: "7-A",
    feeType: "Tuition Fee",
    amount: "₹12,500",
    method: "Bank Transfer",
    date: "2024-01-20",
    status: "paid",
  },
];

// Table columns
const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "receiptNo",
    header: "Receipt No.",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-primary">{row.getValue("receiptNo")}</span>
    ),
  },
  {
    accessorKey: "student",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Student
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.getValue("student")}</p>
        <p className="text-xs text-muted-foreground">Class {row.original.class}</p>
      </div>
    ),
  },
  {
    accessorKey: "feeType",
    header: "Fee Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <span className="font-semibold">{row.getValue("amount")}</span>,
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("method")}</Badge>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("date")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={
            status === "paid"
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-amber-500/10 text-amber-600"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Download className="h-4 w-4" />
      </Button>
    ),
  },
];

export default function PaymentHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment History"
        description="View all fee payment transactions"
        actions={[{ label: "Export", icon: Download, variant: "outline" }]}
      />

      <DataTable
        columns={columns}
        data={payments}
        searchKey="student"
        searchPlaceholder="Search by student name..."
      />
    </div>
  );
}
