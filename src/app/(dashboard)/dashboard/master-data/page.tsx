"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Calendar,
  Building2,
  BadgeCheck,
  BookOpen,
  Star,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

// ───────── Interfaces ─────────
interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface Department {
  id: string;
  name: string;
  code: string | null;
}

interface Designation {
  id: string;
  title: string;
  description: string | null;
}

interface Subject {
  id: string;
  name: string;
  code: string | null;
  type: string;
}

// ───────── Main Component ─────────
export default function MasterDataPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Data"
        description="Manage your institution's core configuration — Academic Years, Departments, Designations, and Subjects."
      />

      <Tabs defaultValue="academic-years" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="academic-years" className="gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Academic Years</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Departments</span>
          </TabsTrigger>
          <TabsTrigger value="designations" className="gap-2">
            <BadgeCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Designations</span>
          </TabsTrigger>
          <TabsTrigger value="subjects" className="gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Subjects</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="academic-years">
          <AcademicYearsTab />
        </TabsContent>
        <TabsContent value="departments">
          <DepartmentsTab />
        </TabsContent>
        <TabsContent value="designations">
          <DesignationsTab />
        </TabsContent>
        <TabsContent value="subjects">
          <SubjectsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ═══════════════════════════════════════════
//  Academic Years Tab
// ═══════════════════════════════════════════
function AcademicYearsTab() {
  const [items, setItems] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<AcademicYear | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", startDate: "", endDate: "", isCurrent: false });

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/academic-years");
      setItems(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch academic years:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: "", startDate: "", endDate: "", isCurrent: false });
    setDialogOpen(true);
  };

  const openEdit = (item: AcademicYear) => {
    setEditItem(item);
    setForm({
      name: item.name,
      startDate: item.startDate?.split("T")[0] || "",
      endDate: item.endDate?.split("T")[0] || "",
      isCurrent: item.isCurrent,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editItem) {
        await api.put(`/academic-years/${editItem.id}`, form);
      } else {
        await api.post("/academic-years", form);
      }
      setDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      alert(error.response?.data?.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/academic-years/${deleteId}`);
      setDeleteId(null);
      fetchItems();
    } catch (error: any) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative border rounded-xl p-5 bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
              </div>
              {item.isCurrent && (
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <Star className="w-3 h-3" /> Current
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {item.startDate?.split("T")[0]} → {item.endDate?.split("T")[0]}
            </p>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add Card */}
        <button
          onClick={openCreate}
          className="border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors min-h-[120px]"
        >
          <Plus className="w-8 h-8" />
          <span className="font-medium">Add Academic Year</span>
        </button>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit" : "Add"} Academic Year</DialogTitle>
            <DialogDescription>
              {editItem ? "Update academic year details." : "Create a new academic year."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="ay-name">Name</Label>
              <Input id="ay-name" placeholder="e.g. 2025-26" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ay-start">Start Date</Label>
                <Input id="ay-start" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ay-end">End Date</Label>
                <Input id="ay-end" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="ay-current" type="checkbox" checked={form.isCurrent} onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })} className="rounded" />
              <Label htmlFor="ay-current">Set as current academic year</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Academic Year?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ═══════════════════════════════════════════
//  Departments Tab
// ═══════════════════════════════════════════
function DepartmentsTab() {
  const [items, setItems] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Department | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "" });

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/departments");
      setItems(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: "", code: "" });
    setDialogOpen(true);
  };

  const openEdit = (item: Department) => {
    setEditItem(item);
    setForm({ name: item.name, code: item.code || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editItem) {
        await api.put(`/departments/${editItem.id}`, form);
      } else {
        await api.post("/departments", form);
      }
      setDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      alert(error.response?.data?.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/departments/${deleteId}`);
      setDeleteId(null);
      fetchItems();
    } catch (error: any) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative border rounded-xl p-5 bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                {item.code && <p className="text-xs text-muted-foreground">Code: {item.code}</p>}
              </div>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <button
          onClick={openCreate}
          className="border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors min-h-[100px]"
        >
          <Plus className="w-8 h-8" />
          <span className="font-medium">Add Department</span>
        </button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit" : "Add"} Department</DialogTitle>
            <DialogDescription>{editItem ? "Update department details." : "Create a new department."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="dept-name">Name</Label>
              <Input id="dept-name" placeholder="e.g. Science" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-code">Code (Optional)</Label>
              <Input id="dept-code" placeholder="e.g. SCI" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ═══════════════════════════════════════════
//  Designations Tab
// ═══════════════════════════════════════════
function DesignationsTab() {
  const [items, setItems] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Designation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/designations");
      setItems(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch designations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: "", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (item: Designation) => {
    setEditItem(item);
    setForm({ title: item.title, description: item.description || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editItem) {
        await api.put(`/designations/${editItem.id}`, form);
      } else {
        await api.post("/designations", form);
      }
      setDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      alert(error.response?.data?.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/designations/${deleteId}`);
      setDeleteId(null);
      fetchItems();
    } catch (error: any) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative border rounded-xl p-5 bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <BadgeCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
              </div>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <button
          onClick={openCreate}
          className="border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors min-h-[100px]"
        >
          <Plus className="w-8 h-8" />
          <span className="font-medium">Add Designation</span>
        </button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit" : "Add"} Designation</DialogTitle>
            <DialogDescription>{editItem ? "Update designation details." : "Create a new designation."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="desig-title">Title</Label>
              <Input id="desig-title" placeholder="e.g. PGT Teacher" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desig-desc">Description (Optional)</Label>
              <Input id="desig-desc" placeholder="e.g. Post Graduate Teacher" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Designation?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ═══════════════════════════════════════════
//  Subjects Tab
// ═══════════════════════════════════════════
function SubjectsTab() {
  const [items, setItems] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Subject | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "", type: "theory" });

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/subjects");
      setItems(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: "", code: "", type: "theory" });
    setDialogOpen(true);
  };

  const openEdit = (item: Subject) => {
    setEditItem(item);
    setForm({ name: item.name, code: item.code || "", type: item.type || "theory" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editItem) {
        await api.put(`/subjects/${editItem.id}`, form);
      } else {
        await api.post("/subjects", form);
      }
      setDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      alert(error.response?.data?.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/subjects/${deleteId}`);
      setDeleteId(null);
      fetchItems();
    } catch (error: any) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const typeColors: Record<string, string> = {
    theory: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    practical: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    both: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative border rounded-xl p-5 bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                {item.code && <p className="text-xs text-muted-foreground">Code: {item.code}</p>}
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${typeColors[item.type] || ""}`}>
                {item.type}
              </span>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <button
          onClick={openCreate}
          className="border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors min-h-[100px]"
        >
          <Plus className="w-8 h-8" />
          <span className="font-medium">Add Subject</span>
        </button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit" : "Add"} Subject</DialogTitle>
            <DialogDescription>{editItem ? "Update subject details." : "Create a new subject."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="subj-name">Name</Label>
              <Input id="subj-name" placeholder="e.g. Physics" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subj-code">Code (Optional)</Label>
              <Input id="subj-code" placeholder="e.g. PHY" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subj-type">Type</Label>
              <Select value={form.type} onValueChange={(val) => setForm({ ...form, type: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theory">Theory</SelectItem>
                  <SelectItem value="practical">Practical</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
