"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  LayoutGrid,
  ArrowLeft,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  name: string;
}

interface SectionItem {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  name: string;
  maxStudents: number | null;
  classTeacherId: string | null;
  createdAt: string;
}

export default function SectionsPage() {
  const searchParams = useSearchParams();
  const filterClassId = searchParams.get("classId");

  const [sections, setSections] = useState<SectionItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionItem | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [form, setForm] = useState({ classId: "", name: "", maxStudents: "40" });

  const fetchData = useCallback(async () => {
    try {
      const [sectionsRes, classesRes] = await Promise.all([
        api.get(`/sections${filterClassId ? `?classId=${filterClassId}` : ""}`),
        api.get("/classes"),
      ]);
      setSections(sectionsRes.data.data || []);
      setClasses(classesRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, [filterClassId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateDialog = () => {
    setSelectedSection(null);
    setForm({ classId: filterClassId || "", name: "", maxStudents: "40" });
    setDialogOpen(true);
  };

  const openEditDialog = (section: SectionItem) => {
    setSelectedSection(section);
    setForm({
      classId: section.classId,
      name: section.name,
      maxStudents: section.maxStudents?.toString() || "40",
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (section: SectionItem) => {
    setSelectedSection(section);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.classId || !form.name.trim()) {
      setMessage({ type: "error", text: "Class and section name are required." });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      if (selectedSection) {
        await api.put(`/sections/${selectedSection.id}`, {
          name: form.name.trim(),
          maxStudents: form.maxStudents ? parseInt(form.maxStudents) : 40,
        });
        setMessage({ type: "success", text: "Section updated successfully!" });
      } else {
        await api.post("/sections", {
          classId: form.classId,
          name: form.name.trim(),
          maxStudents: form.maxStudents ? parseInt(form.maxStudents) : 40,
        });
        setMessage({ type: "success", text: "Section created successfully!" });
      }

      setDialogOpen(false);
      fetchData();
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
    if (!selectedSection) return;

    try {
      await api.delete(`/sections/${selectedSection.id}`);
      setMessage({ type: "success", text: "Section deleted successfully!" });
      setDeleteDialogOpen(false);
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to delete section.",
      });
      setDeleteDialogOpen(false);
    }
  };

  // Get active filter class name
  const filterClassName = filterClassId
    ? classes.find((c) => c.id === filterClassId)?.name
    : null;

  // Group sections by class
  const groupedSections = sections.reduce<Record<string, SectionItem[]>>((acc, sec) => {
    const key = sec.className || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(sec);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sections" description="Manage sections within your classes" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/academics/classes">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Classes
          </Link>
        </Button>
      </div>

      <PageHeader
        title={filterClassName ? `Sections – ${filterClassName}` : "Sections"}
        description="Manage sections within your classes"
        actions={[
          ...(filterClassId
            ? [{ label: "All Sections", icon: ArrowLeft, href: "/dashboard/academics/sections", variant: "outline" as const }]
            : []),
          { label: "Add Section", icon: Plus, onClick: openCreateDialog },
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

      {/* Sections Display */}
      {sections.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <LayoutGrid className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">No Sections Yet</h3>
            <p className="text-muted-foreground mt-1">
              {classes.length === 0
                ? "Create a class first, then add sections."
                : "Add sections to organize students within classes."}
            </p>
          </div>
          {classes.length > 0 && (
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Section
            </Button>
          )}
          {classes.length === 0 && (
            <Button asChild>
              <Link href="/dashboard/academics/classes">
                <Plus className="w-4 h-4 mr-2" />
                Create a Class First
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSections).map(([className, secs]) => (
            <div key={className}>
              {/* Class Group Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <LayoutGrid className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold">{className}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {secs.length} section{secs.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Section Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {secs.map((sec) => {
                  const capacity = sec.maxStudents ?? 40;
                  const enrolled = 0; // placeholder until student enrollment
                  const percentage = capacity > 0 ? (enrolled / capacity) * 100 : 0;

                  return (
                    <div
                      key={sec.id}
                      className="group bg-card border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 relative"
                    >
                      {/* Top Row: Icon + Actions */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <LayoutGrid className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(sec)}
                            id={`edit-section-${sec.id}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(sec)}
                            id={`delete-section-${sec.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Section Name */}
                      <h4 className="font-semibold text-lg">Section {sec.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {className} – {sec.name}
                      </p>

                      {/* Capacity Bar */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="w-3.5 h-3.5" />
                            <span>Students</span>
                          </div>
                          <span className="font-medium text-xs">
                            {enrolled} / {capacity}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary/70 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add Section Card */}
                <button
                  onClick={openCreateDialog}
                  className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300 min-h-[180px] cursor-pointer"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-sm font-medium">Add Section</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSection ? "Edit Section" : "Add New Section"}
            </DialogTitle>
            <DialogDescription>
              {selectedSection
                ? "Update the section details below."
                : "Select a class and enter a section name."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="section-class">Class *</Label>
              <Select
                value={form.classId}
                onValueChange={(v) => setForm((prev) => ({ ...prev, classId: v }))}
                disabled={!!selectedSection}
              >
                <SelectTrigger id="section-class">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section-name">Section Name *</Label>
              <Input
                id="section-name"
                placeholder="e.g. A, B, C or Rose, Lily"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Common naming: A, B, C or descriptive names like Rose, Lily.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-students">Max Students *</Label>
              <Input
                id="max-students"
                type="number"
                min="1"
                placeholder="e.g. 30, 40, 50"
                value={form.maxStudents}
                onChange={(e) => setForm((prev) => ({ ...prev, maxStudents: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of students allowed in this section.
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
              ) : selectedSection ? (
                "Update Section"
              ) : (
                "Create Section"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Section &quot;{selectedSection?.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Students in this section will need to be reassigned.
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
