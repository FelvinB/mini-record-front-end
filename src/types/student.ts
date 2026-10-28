export interface Student {
  id: number;
  student_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  course: string;
  year_level: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface StudentPayload {
  student_number: string;
  first_name: string;
  last_name: string;
  email: string;
  course: string;
  year_level: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Paginated<T> {
  data: T[];
  links: PaginationLink[];
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface CourseStat {
  course: string;
  total: number;
}

export interface YearLevelStat {
  year_level: number;
  total: number;
}

export interface DashboardStats {
  total: number;
  by_course: CourseStat[];
  by_year_level: YearLevelStat[];
  recent: Student[];
}

export type ValidationErrors = Record<string, string[]>;
