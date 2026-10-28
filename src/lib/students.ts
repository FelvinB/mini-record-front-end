import { api } from "@/lib/api";
import type {
  DashboardStats,
  Paginated,
  Student,
  StudentPayload,
} from "@/types/student";

export function fetchStudents(search: string, page: number) {
  const params = new URLSearchParams();
  if (search.trim() !== "") params.set("search", search.trim());
  if (page > 1) params.set("page", String(page));

  const query = params.toString();

  return api.get<Paginated<Student>>(`/students${query ? `?${query}` : ""}`);
}

export function fetchStudent(id: number | string) {
  return api.get<{ data: Student }>(`/students/${id}`);
}

export function createStudent(payload: StudentPayload) {
  return api.post<{ data: Student }>("/students", payload);
}

export function updateStudent(id: number | string, payload: StudentPayload) {
  return api.put<{ data: Student }>(`/students/${id}`, payload);
}

export function deleteStudent(id: number | string) {
  return api.delete<{ message: string }>(`/students/${id}`);
}

export function fetchStats() {
  return api.get<{ data: DashboardStats }>("/students/stats");
}
