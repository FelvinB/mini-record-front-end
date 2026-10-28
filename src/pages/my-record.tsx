import { useEffect, useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api";
import { fetchMyStudent, updateMyStudent } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { COURSE_SUGGESTIONS, YEAR_LEVELS, YEAR_LEVEL_LABELS } from "@/lib/constants";
import type { Student, ValidationErrors } from "@/types/student";
import { PageHeader } from "@/components/common/page-header";
import { MessageBanner } from "@/components/common/message-banner";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLoader } from "@/components/ui/spinner";
import { BookIcon, CalendarIcon, CheckCircleIcon, HashIcon, MailIcon } from "@/components/ui/icons";

function getInitials(student: Student): string {
  return (
    `${student.first_name.charAt(0) ?? ""}${student.last_name.charAt(0) ?? ""}`.toUpperCase() ||
    "?"
  );
}

export default function MyRecordPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [course, setCourse] = useState("");
  const [year_level, setYearLevel] = useState("1");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [banner, setBanner] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  useEffect(() => {
    let active = true;

    fetchMyStudent()
      .then((result) => {
        if (!active) return;
        setStudent(result.data);
        setFirstName(result.data.first_name);
        setLastName(result.data.last_name);
        setCourse(result.data.course);
        setYearLevel(String(result.data.year_level));
        setLoadError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setLoadError(
          cause instanceof Error ? cause.message : "Failed to load your record.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProcessing(true);
    setErrors(null);
    setBanner(null);

    try {
      const result = await updateMyStudent({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        course: course.trim(),
        year_level: Number(year_level),
      });
      setStudent(result.data);
      setBanner({ message: "Your record was updated successfully.", variant: "success" });
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 422) {
        setErrors(cause.errors);
      } else {
        setBanner({
          message: cause instanceof Error ? cause.message : "Failed to update your record.",
          variant: "error",
        });
      }
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return <PageLoader label="Loading your record…" />;
  }

  if (loadError || !student) {
    return (
      <Card>
        <EmptyState
          title="Record unavailable"
          description={loadError ?? "No linked student record was found for this account."}
        />
      </Card>
    );
  }

  return (
    <>
      <PageHeader
        title="My Record"
        description="View and update the registry entry linked to your account."
      />

      {banner ? (
        <div className="mb-4">
          <MessageBanner
            message={banner.message}
            variant={banner.variant}
            onDismiss={() => setBanner(null)}
          />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-1">
          <div className="h-24 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600" />
          <div className="px-6 pb-6">
            <div className="-mt-8 flex items-end gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg ring-4 ring-white dark:ring-slate-900">
                {getInitials(student)}
              </div>
              <div className="pb-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {student.full_name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {student.course}
                </p>
              </div>
            </div>

            <dl className="mt-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <HashIcon className="mt-0.5 size-4 text-slate-400" />
                <div>
                  <dt className="text-xs text-slate-400">Student Number</dt>
                  <dd className="font-mono font-medium text-slate-800 dark:text-slate-100">
                    {student.student_number}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MailIcon className="mt-0.5 size-4 text-slate-400" />
                <div>
                  <dt className="text-xs text-slate-400">Email Address</dt>
                  <dd className="font-medium text-slate-800 dark:text-slate-100">
                    {student.email}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CalendarIcon className="mt-0.5 size-4 text-slate-400" />
                <div>
                  <dt className="text-xs text-slate-400">Year Level</dt>
                  <dd className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-100">
                    <Badge variant="violet">{YEAR_LEVEL_LABELS[student.year_level]}</Badge>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CheckCircleIcon className="mt-0.5 size-4 text-slate-400" />
                <div>
                  <dt className="text-xs text-slate-400">Last Updated</dt>
                  <dd className="font-medium text-slate-800 dark:text-slate-100">
                    {formatDate(student.updated_at)}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit Your Information</CardTitle>
            <CardDescription>
              Update your name, course, or year level. Your student number and
              email are verified against the registry and cannot be changed here.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} noValidate>
            <CardContent>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={first_name}
                    error={Boolean(errors?.first_name)}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                  <FieldError name="first_name" errors={errors} />
                </div>

                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={last_name}
                    error={Boolean(errors?.last_name)}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                  <FieldError name="last_name" errors={errors} />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="course">Course / Program</Label>
                  <div className="relative">
                    <BookIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="course"
                      list="course-suggestions"
                      value={course}
                      error={Boolean(errors?.course)}
                      onChange={(event) => setCourse(event.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <datalist id="course-suggestions">
                    {COURSE_SUGGESTIONS.map((suggestion) => (
                      <option key={suggestion} value={suggestion} />
                    ))}
                  </datalist>
                  <FieldError name="course" errors={errors} />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="year_level">Year Level</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {YEAR_LEVELS.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => setYearLevel(String(year))}
                        className={cn(
                          "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                          year_level === String(year)
                            ? "border-transparent bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/30"
                            : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700",
                        )}
                      >
                        {YEAR_LEVEL_LABELS[year]}
                      </button>
                    ))}
                  </div>
                  <FieldError name="year_level" errors={errors} />
                </div>
              </div>
            </CardContent>

            <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/40">
              <Button type="submit" loading={processing}>
                Save changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}