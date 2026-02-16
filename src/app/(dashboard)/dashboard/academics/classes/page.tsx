"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  BookOpen,
  ChevronRight,
  Hash,
  LayoutGrid,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { api } from "@/lib/api";
import Link from "next/link";

interface ClassItem {
  id: string;
  schoolId: string;
  name: string;
  numericLevel: number | null;
  createdAt: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [form, setForm] = useState({ name: "", numericLevel: "" });

  const fetchClasses = useCallback(async () => {
    try {
      const response = await api.get("/classes");
      setClasses(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const openCreateDialog = () => {
    setSelectedClass(null);
    setForm({ name: "", numericLevel: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (cls: ClassItem) => {
    setSelectedClass(cls);
    setForm({
      name: cls.name,
      numericLevel: cls.numericLevel?.toString() || "",
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (cls: ClassItem) => {
    setSelectedClass(cls);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Class name is required." });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        name: form.name.trim(),
        numericLevel: form.numericLevel ? parseInt(form.numericLevel) : null,
      };

      if (selectedClass) {
        await api.put(`/classes/${selectedClass.id}`, payload);
        setMessage({ type: "success", text: "Class updated successfully!" });
      } else {
        await api.post("/classes", payload);
        setMessage({ type: "success", text: "Class created successfully!" });
      }

      setDialogOpen(false);
      fetchClasses();
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClass) return;

    try {
      await api.delete(`/classes/${selectedClass.id}`);
      setMessage({ type: "success", text: "Class deleted successfully!" });
      setDeleteDialogOpen(false);
      fetchClasses();
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to delete class.",
      });
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Classes" description="Manage your school's academic classes" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        description="Manage your school's academic classes"
        actions={[
          { label: "Add Class", icon: Plus, onClick: openCreateDialog },
        ]}
      />

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

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">No Classes Yet</h3>
            <p className="text-muted-foreground mt-1">
              Start by adding your first class to organize students and sections.
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Class
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="group bg-card border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(cls)}
                    id={`edit-class-${cls.id}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => openDeleteDialog(cls)}
                    id={`delete-class-${cls.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold text-lg">{cls.name}</h3>

              {cls.numericLevel && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                  <Hash className="w-3.5 h-3.5" />
                  <span>Level {cls.numericLevel}</span>
                </div>
              )}

              <Link
                href={`/dashboard/academics/sections?classId=${cls.id}`}
                className="flex items-center gap-1 text-sm text-primary mt-4 group/link"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>View Sections</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClass ? "Edit Class" : "Add New Class"}</DialogTitle>
            <DialogDescription>
              {selectedClass
                ? "Update the class details below."
                : "Enter the details for the new class."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="class-name">Class Name *</Label>
              <Input
                id="class-name"
                placeholder="e.g. Grade 1, Class 10, Nursery"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeric-level">Numeric Level (Optional)</Label>
              <Input
                id="numeric-level"
                type="number"
                placeholder="e.g. 1, 2, 10"
                value={form.numericLevel}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, numericLevel: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Used for sorting classes in the correct order.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : selectedClass ? (
                "Update Class"
              ) : (
                "Create Class"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{selectedClass?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All sections under this class must be removed first.
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
