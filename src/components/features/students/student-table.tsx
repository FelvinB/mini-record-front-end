import { Link } from "react-router";
import type { Student } from "@/types/student";
import { cn } from "@/lib/cn";
import { yearLevelLabel } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button-classes";
import { EmptyState } from "@/components/common/empty-state";
import { EyeIcon, PencilIcon, TrashIcon, UsersIcon } from "@/components/ui/icons";

interface StudentTableProps {
  students: Student[];
  loading: boolean;
  onDelete: (student: Student) => void;
}

function getInitials(student: Student): string {
  return (
    `${student.first_name.charAt(0) ?? ""}${student.last_name.charAt(0) ?? ""}`.toUpperCase() ||
    "?"
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800">
      <td className="p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="size-9 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-2.5 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="h-3 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </td>
      <td className="p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </td>
      <td className="p-4">
        <div className="h-5 w-14 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
      </td>
      <td className="p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </td>
    </tr>
  );
}

export function StudentTable({ students, loading, onDelete }: StudentTableProps) {
  return (
    <div className="app-scrollbar overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            <th className="px-6 py-3.5">Student No.</th>
            <th className="px-6 py-3.5">Name</th>
            <th className="px-6 py-3.5">Email</th>
            <th className="px-6 py-3.5">Course</th>
            <th className="px-6 py-3.5">Year Level</th>
            <th className="px-6 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => <SkeletonRow key={index} />)
          ) : students.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <EmptyState
                  icon={<UsersIcon className="size-7" />}
                  title="No students found"
                  description="Try adjusting your search, or add a new student record to get started."
                />
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40"
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                    {student.student_number}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm">
                      {getInitials(student)}
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {student.full_name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{student.email}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{student.course}</td>
                <td className="px-6 py-4">
                  <Badge variant="violet">{yearLevelLabel(student.year_level)}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <Link
                      to={`/students/${student.id}`}
                      className={cn(
                        buttonClasses("ghost", "sm"),
                        "text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400",
                      )}
                    >
                      <EyeIcon className="size-4" />
                      View
                    </Link>
                    <Link
                      to={`/students/${student.id}/edit`}
                      className={cn(
                        buttonClasses("ghost", "sm"),
                        "text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400",
                      )}
                    >
                      <PencilIcon className="size-4" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      className={cn(
                        buttonClasses("ghost", "sm"),
                        "size-8 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400",
                      )}
                      aria-label={`Delete ${student.full_name}`}
                      onClick={() => onDelete(student)}
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}