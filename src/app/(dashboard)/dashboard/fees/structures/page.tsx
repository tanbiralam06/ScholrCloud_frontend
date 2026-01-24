"use client";

import { Plus, MoreHorizontal, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { PageHeader, DataTable } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface FeeStructure {
  id: string;
  name: string;
  class: string;
  amount: string;
  frequency: string;
  isActive: boolean;
}

// Dummy data
const feeStructures: FeeStructure[] = [
  {
    id: "1",
    name: "Tuition Fee",
    class: "All Classes",
    amount: "₹15,000",
    frequency: "Monthly",
    isActive: true,
  },
  {
    id: "2",
    name: "Lab Fee",
    class: "Class 9-12",
    amount: "₹2,500",
    frequency: "Quarterly",
    isActive: true,
  },
  {
    id: "3",
    name: "Library Fee",
    class: "All Classes",
    amount: "₹500",
    frequency: "Yearly",
    isActive: true,
  },
  {
    id: "4",
    name: "Sports Fee",
    class: "All Classes",
    amount: "₹1,500",
    frequency: "Half Yearly",
    isActive: true,
  },
  {
    id: "5",
    name: "Computer Fee",
    class: "Class 6-12",
    amount: "₹1,000",
    frequency: "Monthly",
    isActive: true,
  },
  {
    id: "6",
    name: "Admission Fee",
    class: "New Students",
    amount: "₹25,000",
    frequency: "One Time",
    isActive: true,
  },
  {
    id: "7",
    name: "Transport Fee",
    class: "Optional",
    amount: "₹3,000",
    frequency: "Monthly",
    isActive: true,
  },
  {
    id: "8",
    name: "Exam Fee",
    class: "Class 10, 12",
    amount: "₹2,000",
    frequency: "Half Yearly",
    isActive: false,
  },
];

// Table columns
const columns: ColumnDef<FeeStructure>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Fee Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "class",
    header: "Applicable To",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("class")}</Badge>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <span className="font-semibold">{row.getValue("amount")}</span>,
  },
  {
    accessorKey: "frequency",
    header: "Frequency",
    cell: ({ row }) => <Badge variant="secondary">{row.getValue("frequency")}</Badge>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={
          row.getValue("isActive")
            ? "bg-emerald-500/10 text-emerald-600"
            : "bg-muted text-muted-foreground"
        }
      >
        {row.getValue("isActive") ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function FeeStructuresPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Structures"
        description="Manage fee templates and pricing"
        actions={[{ label: "Add Structure", icon: Plus }]}
      />

      <DataTable
        columns={columns}
        data={feeStructures}
        searchKey="name"
        searchPlaceholder="Search fee structures..."
      />
    </div>
  );
}
