"use client";

import { useEffect, useState, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Eye, Trash2, ArrowUpDown, Loader2 } from "lucide-react";
import { PageHeader, DataTable } from "@/components/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  getStudents,
  deleteStudent as deleteStudentApi,
  type Student,
} from "@/lib/validators/studentsApi";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getStudents();
      setStudents(res.data || []);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteStudentApi(deleteId);
      toast({
        title: "Student deleted",
        description: "The student record has been removed.",
      });
      setDeleteId(null);
      fetchStudents();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.response?.data?.message || "Failed to delete student",
      });
    }
  };

  const getInitials = (first: string, last: string | null) => {
    return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600";
      case "alumni":
        return "bg-blue-500/10 text-blue-600";
      case "transferred":
        return "bg-amber-500/10 text-amber-600";
      case "expelled":
        return "bg-red-500/10 text-red-600";
      default:
        return "";
    }
  };

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
      id: "name",
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
      accessorFn: (row) => `${row.firstName} ${row.lastName || ""}`.trim(),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {getInitials(row.original.firstName, row.original.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {row.original.firstName} {row.original.lastName || ""}
            </p>
            <p className="text-xs text-muted-foreground">{row.original.gender || "—"}</p>
          </div>
        </div>
      ),
    },
    {
      id: "class",
      header: "Class",
      accessorFn: (row) => row.className || "",
      cell: ({ row }) => {
        const cls = row.original.className;
        const sec = row.original.sectionName;
        if (!cls) return "—";
        return sec ? `${cls}-${sec}` : cls;
      },
    },
    {
      accessorKey: "rollNumber",
      header: "Roll No.",
      cell: ({ row }) => row.getValue("rollNumber") ?? "—",
    },
    {
      accessorKey: "guardianPhone",
      header: "Guardian Phone",
      cell: ({ row }) => row.getValue("guardianPhone") || "—",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant="secondary" className={getStatusColor(status)}>
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
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteId(row.original.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Students"
          description="Manage student admissions, profiles, and records"
          actions={[{ label: "Add Student", icon: Plus, href: "/dashboard/students/new" }]}
        />
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Manage student admissions, profiles, and records"
        actions={[{ label: "Add Student", icon: Plus, href: "/dashboard/students/new" }]}
      />

      <DataTable
        columns={columns}
        data={students}
        searchKey="name"
        searchPlaceholder="Search by student name..."
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the student record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
