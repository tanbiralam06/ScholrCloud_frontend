import { api } from "@/lib/api";

export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string | null;
  gender: string | null;
  classId: string | null;
  className: string | null;
  sectionId: string | null;
  sectionName: string | null;
  rollNumber: number | null;
  guardianPhone: string | null;
  status: "active" | "alumni" | "transferred" | "expelled";
  photoUrl: string | null;
  createdAt: string;
}

export interface StudentDetail extends Student {
  dateOfBirth: string | null;
  bloodGroup: string | null;
  admissionDate: string | null;
  fatherName: string | null;
  motherName: string | null;
  guardianEmail: string | null;
  address: string | null;
  updatedAt: string | null;
}

export interface CreateStudentPayload {
  firstName: string;
  lastName?: string;
  admissionNumber: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  classId?: string;
  sectionId?: string;
  rollNumber?: number;
  admissionDate?: string;
  fatherName?: string;
  motherName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  address?: string;
}

export type UpdateStudentPayload = Partial<CreateStudentPayload> & {
  status?: string;
};

// ─── API Functions ───────────────────────────────────────

export async function getStudents(params?: Record<string, string>) {
  const res = await api.get("/students", { params });
  return res.data;
}

export async function getStudent(id: string) {
  const res = await api.get(`/students/${id}`);
  return res.data;
}

export async function createStudent(data: CreateStudentPayload) {
  const res = await api.post("/students", data);
  return res.data;
}

export async function updateStudent(id: string, data: UpdateStudentPayload) {
  const res = await api.put(`/students/${id}`, data);
  return res.data;
}

export async function deleteStudent(id: string) {
  const res = await api.delete(`/students/${id}`);
  return res.data;
}
