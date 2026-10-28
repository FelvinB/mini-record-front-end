import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { Student } from "@/types/student";
import { deleteStudent, fetchStudent } from "@/lib/students";
import { formatDate } from "@/lib/format";
import { yearLevelLabel } from "@/lib/constants";
import { PageHeader } from "@/components/common/page-header";
import { MessageBanner } from "@/components/common/message-banner";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button-classes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { PageLoader } from "@/components/ui/spinner";
import {
  ArrowLeftIcon,
  BookIcon,
  CalendarIcon,
  HashIcon,
  MailIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/ui/icons";
import { StudentDeleteDialog } from "@/components/features/students/student-delete-dialog";

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/40">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-indigo-400 dark:ring-slate-700">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <div className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function StudentShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;

    fetchStudent(id)
      .then((result) => {
        if (active) {
          setStudent(result.data);
          setLoadError(null);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setLoadError(
            cause instanceof Error
              ? cause.message
              : "Failed to load student record.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await deleteStudent(deleteTarget.id);
      navigate("/students", {
        state: { message: `${deleteTarget.full_name} was deleted successfully.` },
      });
    } catch (cause) {
      setBanner(
        cause instanceof Error ? cause.message : "Failed to delete student.",
      );
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Student Details"
        description="Complete information for this student record."
        actions={
          <>
            <Link
              to={`/students/${student?.id ?? ""}/edit`}
              className={buttonClasses(
                "primary",
                "md",
                !student ? "pointer-events-none opacity-60" : undefined,
              )}
            >
              <PencilIcon className="size-4" />
              Edit
            </Link>
            <button
              type="button"
              disabled={!student}
              onClick={() => student && setDeleteTarget(student)}
              className={buttonClasses(
                "outline",
                "md",
                "text-rose-600 hover:border-rose-300 hover:bg-rose-50 dark:text-rose-400 dark:hover:border-rose-500/50 dark:hover:bg-rose-500/10",
              )}
            >
              <TrashIcon className="size-4" />
              Delete
            </button>
            <Link to="/students" className={buttonClasses("ghost", "md")}>
              <ArrowLeftIcon className="size-4" />
              Back
            </Link>
          </>
        }
      />

      {banner ? (
        <div className="mb-4">
          <MessageBanner
            variant="error"
            message={banner}
            onDismiss={() => setBanner(null)}
          />
        </div>
      ) : null}

      {loading ? (
        <Card>
          <PageLoader label="Loading student…" />
        </Card>
      ) : loadError ? (
        <Card>
          <EmptyState
            title="Student not found"
            description={loadError}
            action={
              <Link to="/students" className={buttonClasses("outline", "md")}>
                Back to Students
              </Link>
            }
          />
        </Card>
      ) : student ? (
        <>
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600" />
            <div className="px-6 pb-6">
              <div className="-mt-8 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-end gap-4">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg ring-4 ring-white dark:ring-slate-900">
                    {`${student.first_name.charAt(0) ?? ""}${student.last_name.charAt(0) ?? ""}`.toUpperCase()}
                  </div>
                  <div className="pb-1">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {student.full_name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{student.course}</p>
                  </div>
                </div>
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="violet">
                    {yearLevelLabel(student.year_level)}
                  </Badge>
                  <Badge>#{student.student_number}</Badge>
                </div>
              </div>
            </div>

            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow icon={<HashIcon className="size-4" />} label="Student Number">
                  <span className="font-mono">{student.student_number}</span>
                </InfoRow>
                <InfoRow icon={<MailIcon className="size-4" />} label="Email Address">
                  <a
                    href={`mailto:${student.email}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {student.email}
                  </a>
                </InfoRow>
                <InfoRow icon={<BookIcon className="size-4" />} label="Course / Program">
                  {student.course}
                </InfoRow>
                <InfoRow icon={<CalendarIcon className="size-4" />} label="Year Level">
                  {yearLevelLabel(student.year_level)}
                </InfoRow>
              </div>
            </CardContent>

            <CardFooter className="justify-between">
              <CardDescription className="text-xs">
                Record created {formatDate(student.created_at)} · Last updated{" "}
                {formatDate(student.updated_at)}
              </CardDescription>
              <Link to="/students" className={buttonClasses("ghost", "sm")}>
                View all students
              </Link>
            </CardFooter>
          </Card>

          <StudentDeleteDialog
            student={deleteTarget}
            processing={deleting}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={confirmDelete}
          />
        </>
      ) : null}
    </>
  );
}