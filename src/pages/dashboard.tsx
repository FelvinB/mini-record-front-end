import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { DashboardStats, Student } from "@/types/student";
import { fetchStats } from "@/lib/students";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { yearLevelLabel, YEAR_LEVELS } from "@/lib/constants";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { StatCard } from "@/components/common/stat-card";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button-classes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLoader } from "@/components/ui/spinner";
import {
  ArrowRightIcon,
  BookIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  PlusIcon,
  UsersIcon,
} from "@/components/ui/icons";

function getInitials(student: Student): string {
  return (
    `${student.first_name.charAt(0) ?? ""}${student.last_name.charAt(0) ?? ""}`.toUpperCase() ||
    "?"
  );
}

function CourseBar({ label, count, max }: { label: string; count: number; max: number }) {
  const width = max > 0 ? `${(count / max) * 100}%` : "0%";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
        <span className="truncate font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
        <span className="shrink-0 text-xs font-semibold text-slate-500">
          {count}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500",
            count > 0 ? "" : "bg-none",
          )}
          style={{ width }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchStats()
      .then((result) => {
        if (active) {
          setStats(result.data);
          setError(null);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error ? cause.message : "Failed to load statistics.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <PageLoader label="Loading dashboard…" />;
  }

  if (error || !stats) {
    return (
      <Card>
        <EmptyState
          title="Dashboard unavailable"
          description={error ?? "No statistics were returned by the API."}
          action={
            <a href="/dashboard" className={buttonClasses("outline", "md")}>
              Retry
            </a>
          }
        />
      </Card>
    );
  }

  const maxCourse = stats.by_course.reduce(
    (max, item) => Math.max(max, item.total),
    0,
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A quick overview of the student registry."
        actions={
          <>
            <Link to="/students" className={buttonClasses("outline", "md")}>
              <UsersIcon className="size-4" />
              Manage Students
            </Link>
            <Link to="/students/create" className={buttonClasses("primary", "md")}>
              <PlusIcon className="size-4" />
              Add Student
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Students"
          value={stats.total}
          icon={<UsersIcon className="size-5" />}
          accent="indigo"
          hint="Registered in the current database"
        />
        <StatCard
          label="Course Programs"
          value={stats.by_course.length || 0}
          icon={<BookIcon className="size-5" />}
          accent="sky"
          hint="Distinct programs offered"
        />
        <StatCard
          label="Latest Enrolment"
          value={stats.recent[0]?.full_name ?? "—"}
          icon={<CheckCircleIcon className="size-5" />}
          accent="emerald"
          hint={
            stats.recent[0]
              ? `Added ${formatDate(stats.recent[0].created_at)}`
              : undefined
          }
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Students by Course</CardTitle>
            <CardDescription>
              Distribution of students across course programs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.by_course.length === 0 ? (
              <EmptyState
                title="No course data yet"
                description="Add students to see the distribution here."
              />
            ) : (
              <div className="space-y-5">
                {stats.by_course.map((item) => (
                  <CourseBar
                    key={item.course}
                    label={item.course}
                    count={item.total}
                    max={maxCourse}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Year Level Distribution</CardTitle>
            <CardDescription>
              Student counts per academic year.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.total === 0 ? (
              <EmptyState title="No students yet" />
            ) : (
              <div className="space-y-4">
                {YEAR_LEVELS.map((year) => {
                  const item = stats.by_year_level.find(
                    (entry) => entry.year_level === year,
                  );
                  const count = item?.total ?? 0;
                  const percent = Math.round((count / stats.total) * 100);

                  return (
                    <div key={year}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {yearLevelLabel(year)}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {count} · {percent}%
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Students</CardTitle>
            <CardDescription>Latest records added to the registry.</CardDescription>
          </div>
          <Link
            to="/students"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            View all
            <ArrowRightIcon className="size-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recent.length === 0 ? (
            <EmptyState
              icon={<UsersIcon className="size-7" />}
              title="No students yet"
              description="Add your first student record to see it listed here."
              action={
                <Link
                  to="/students/create"
                  className={buttonClasses("primary", "md")}
                >
                  <PlusIcon className="size-4" />
                  Add Student
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.recent.map((student) => (
                <li key={student.id}>
                  <Link
                    to={`/students/${student.id}`}
                    className="group flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
                      {getInitials(student)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                        {student.full_name}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {student.course}
                      </p>
                    </div>
                    <Badge variant="violet">
                      {yearLevelLabel(student.year_level)}
                    </Badge>
                    <span className="hidden font-mono text-xs text-slate-400 dark:text-slate-500 sm:block">
                      {student.student_number}
                    </span>
                    <ChevronRightIcon className="size-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}