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
interface Student {
  id: string;
  admissionNumber: string;
  name: string;
  class: string;
  section: string;
  gender: string;
  guardianPhone: string;
  status: "active" | "alumni" | "transferred";
  avatar: string;
}

// Dummy data
const students: Student[] = [
  {
    id: "1",
    admissionNumber: "2024001",
    name: "Rahul Sharma",
    class: "10",
    section: "A",
    gender: "Male",
    guardianPhone: "+91 98765 43210",
    status: "active",
    avatar: "RS",
  },
  {
    id: "2",
    admissionNumber: "2024002",
    name: "Priya Patel",
    class: "10",
    section: "A",
    gender: "Female",
    guardianPhone: "+91 98765 43211",
    status: "active",
    avatar: "PP",
  },
  {
    id: "3",
    admissionNumber: "2024003",
    name: "Amit Kumar",
    class: "9",
    section: "B",
    gender: "Male",
    guardianPhone: "+91 98765 43212",
    status: "active",
    avatar: "AK",
  },
  {
    id: "4",
    admissionNumber: "2024004",
    name: "Sneha Gupta",
    class: "9",
    section: "A",
    gender: "Female",
    guardianPhone: "+91 98765 43213",
    status: "active",
    avatar: "SG",
  },
  {
    id: "5",
    admissionNumber: "2024005",
    name: "Vikram Singh",
    class: "11",
    section: "A",
    gender: "Male",
    guardianPhone: "+91 98765 43214",
    status: "active",
    avatar: "VS",
  },
  {
    id: "6",
    admissionNumber: "2024006",
    name: "Ananya Iyer",
    class: "8",
    section: "C",
    gender: "Female",
    guardianPhone: "+91 98765 43215",
    status: "active",
    avatar: "AI",
  },
  {
    id: "7",
    admissionNumber: "2024007",
    name: "Ravi Verma",
    class: "12",
    section: "B",
    gender: "Male",
    guardianPhone: "+91 98765 43216",
    status: "active",
    avatar: "RV",
  },
  {
    id: "8",
    admissionNumber: "2024008",
    name: "Meera Nair",
    class: "7",
    section: "A",
    gender: "Female",
    guardianPhone: "+91 98765 43217",
    status: "active",
    avatar: "MN",
  },
  {
    id: "9",
    admissionNumber: "2024009",
    name: "Karan Malhotra",
    class: "11",
    section: "C",
    gender: "Male",
    guardianPhone: "+91 98765 43218",
    status: "transferred",
    avatar: "KM",
  },
  {
    id: "10",
    admissionNumber: "2024010",
    name: "Pooja Reddy",
    class: "6",
    section: "B",
    gender: "Female",
    guardianPhone: "+91 98765 43219",
    status: "active",
    avatar: "PR",
  },
  {
    id: "11",
    admissionNumber: "2023015",
    name: "Arjun Desai",
    class: "12",
    section: "A",
    gender: "Male",
    guardianPhone: "+91 98765 43220",
    status: "alumni",
    avatar: "AD",
  },
  {
    id: "12",
    admissionNumber: "2024012",
    name: "Kavya Menon",
    class: "10",
    section: "B",
    gender: "Female",
    guardianPhone: "+91 98765 43221",
    status: "active",
    avatar: "KM",
  },
];

// Table columns
const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "admissionNumber",
    header: "Adm. No.",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground">
        {row.getValue("admissionNumber")}
      </span>
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
        Student Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={`/placeholder-${row.original.id}.jpg`} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
            {row.original.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{row.getValue("name")}</p>
          <p className="text-xs text-muted-foreground">{row.original.gender}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => (
      <span>
        {row.getValue("class")}-{row.original.section}
      </span>
    ),
  },
  {
    accessorKey: "guardianPhone",
    header: "Guardian Phone",
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
              : status === "alumni"
                ? "bg-blue-500/10 text-blue-600"
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
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/students/${row.original.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/students/${row.original.id}/edit`}>
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

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Manage student admissions, profiles, and records"
        actions={[
          {
            label: "Add Student",
            icon: Plus,
            href: "/dashboard/students/new",
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={students}
        searchKey="name"
        searchPlaceholder="Search by student name..."
      />
    </div>
  );
}
