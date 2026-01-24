"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Pencil, Trash2, Mail, ArrowUpDown } from "lucide-react";
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

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "disabled";
  lastLogin: string;
  avatar: string;
}

// Dummy data
const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@school.com",
    role: "school_admin",
    status: "active",
    lastLogin: "Today",
    avatar: "AU",
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    email: "rajesh@school.com",
    role: "principal",
    status: "active",
    lastLogin: "Today",
    avatar: "RK",
  },
  {
    id: "3",
    name: "Sunita Verma",
    email: "sunita@school.com",
    role: "vice_principal",
    status: "active",
    lastLogin: "Yesterday",
    avatar: "SV",
  },
  {
    id: "4",
    name: "Amit Sharma",
    email: "amit@school.com",
    role: "teacher",
    status: "active",
    lastLogin: "Jan 22",
    avatar: "AS",
  },
  {
    id: "5",
    name: "Priya Patel",
    email: "priya@school.com",
    role: "teacher",
    status: "active",
    lastLogin: "Jan 21",
    avatar: "PP",
  },
  {
    id: "6",
    name: "Arun Desai",
    email: "arun@school.com",
    role: "accountant",
    status: "active",
    lastLogin: "Today",
    avatar: "AD",
  },
  {
    id: "7",
    name: "Kavita Nair",
    email: "kavita@school.com",
    role: "librarian",
    status: "active",
    lastLogin: "Jan 20",
    avatar: "KN",
  },
  {
    id: "8",
    name: "New Teacher",
    email: "newteacher@school.com",
    role: "teacher",
    status: "invited",
    lastLogin: "-",
    avatar: "NT",
  },
];

const roleLabels: Record<string, string> = {
  school_admin: "School Admin",
  principal: "Principal",
  vice_principal: "Vice Principal",
  teacher: "Teacher",
  accountant: "Accountant",
  librarian: "Librarian",
};

// Table columns
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        User
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={`/placeholder-user-${row.original.id}.jpg`} />
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline">
        {roleLabels[row.getValue("role") as string] || row.getValue("role")}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={
            status === "active"
              ? "bg-emerald-500/10 text-emerald-600"
              : status === "invited"
                ? "bg-blue-500/10 text-blue-600"
                : "bg-muted text-muted-foreground"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("lastLogin")}</span>,
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
            Edit Role
          </DropdownMenuItem>
          {row.original.status === "invited" && (
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Resend Invite
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Remove User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage user accounts and permissions"
        actions={[{ label: "Invite User", icon: Plus }]}
      />

      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search users..."
      />
    </div>
  );
}
