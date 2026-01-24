"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { PageHeader, DataTable } from "@/components/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Types
interface Staff {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  status: "active" | "on_leave" | "resigned";
  avatar: string;
}

// Dummy data
const staffMembers: Staff[] = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "Dr. Rajesh Kumar",
    designation: "Principal",
    department: "Administration",
    phone: "+91 98765 11111",
    email: "rajesh@school.com",
    status: "active",
    avatar: "RK",
  },
  {
    id: "2",
    employeeId: "EMP002",
    name: "Sunita Verma",
    designation: "Vice Principal",
    department: "Administration",
    phone: "+91 98765 22222",
    email: "sunita@school.com",
    status: "active",
    avatar: "SV",
  },
  {
    id: "3",
    employeeId: "EMP003",
    name: "Amit Sharma",
    designation: "Senior Teacher",
    department: "Mathematics",
    phone: "+91 98765 33333",
    email: "amit@school.com",
    status: "active",
    avatar: "AS",
  },
  {
    id: "4",
    employeeId: "EMP004",
    name: "Priya Patel",
    designation: "Teacher",
    department: "Science",
    phone: "+91 98765 44444",
    email: "priya@school.com",
    status: "active",
    avatar: "PP",
  },
  {
    id: "5",
    employeeId: "EMP005",
    name: "Ravi Gupta",
    designation: "Teacher",
    department: "English",
    phone: "+91 98765 55555",
    email: "ravi@school.com",
    status: "on_leave",
    avatar: "RG",
  },
  {
    id: "6",
    employeeId: "EMP006",
    name: "Meera Joshi",
    designation: "Teacher",
    department: "Hindi",
    phone: "+91 98765 66666",
    email: "meera@school.com",
    status: "active",
    avatar: "MJ",
  },
  {
    id: "7",
    employeeId: "EMP007",
    name: "Vikram Singh",
    designation: "Lab Assistant",
    department: "Science",
    phone: "+91 98765 77777",
    email: "vikram@school.com",
    status: "active",
    avatar: "VS",
  },
  {
    id: "8",
    employeeId: "EMP008",
    name: "Kavita Nair",
    designation: "Librarian",
    department: "Library",
    phone: "+91 98765 88888",
    email: "kavita@school.com",
    status: "active",
    avatar: "KN",
  },
  {
    id: "9",
    employeeId: "EMP009",
    name: "Arun Desai",
    designation: "Accountant",
    department: "Accounts",
    phone: "+91 98765 99999",
    email: "arun@school.com",
    status: "active",
    avatar: "AD",
  },
  {
    id: "10",
    employeeId: "EMP010",
    name: "Neha Reddy",
    designation: "Teacher",
    department: "Social Science",
    phone: "+91 98765 00000",
    email: "neha@school.com",
    status: "resigned",
    avatar: "NR",
  },
];

// Table columns
const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "employeeId",
    header: "Emp. ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground">{row.getValue("employeeId")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Staff Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={`/placeholder-staff-${row.original.id}.jpg`} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
            {row.original.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{row.getValue("name")}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("department")}</Badge>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="secondary"
          className={
            status === "active"
              ? "bg-emerald-500/10 text-emerald-600"
              : status === "on_leave"
                ? "bg-blue-500/10 text-blue-600"
                : "bg-red-500/10 text-red-600"
          }
        >
          {status.replace("_", " ")}
        </Badge>
      );
    },
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
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/staff/${row.original.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/staff/${row.original.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
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

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff"
        description="Manage teachers and staff members"
        actions={[
          {
            label: "Add Staff",
            icon: Plus,
            href: "/dashboard/staff/new",
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={staffMembers}
        searchKey="name"
        searchPlaceholder="Search by staff name..."
      />
    </div>
  );
}
