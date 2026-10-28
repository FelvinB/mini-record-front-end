import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import type { Paginated, Student } from "@/types/student";
import { deleteStudent, fetchStudents } from "@/lib/students";
import { PageHeader } from "@/components/common/page-header";
import { MessageBanner } from "@/components/common/message-banner";
import { EmptyState } from "@/components/common/empty-state";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button-classes";
import { PageLoader } from "@/components/ui/spinner";
import { PlusIcon } from "@/components/ui/icons";
import { StudentSearch } from "@/components/features/students/student-search";
import { StudentTable } from "@/components/features/students/student-table";
import { StudentPagination } from "@/components/features/students/student-pagination";
import { StudentDeleteDialog } from "@/components/features/students/student-delete-dialog";

interface BannerState {
  message: string;
  variant: "success" | "error";
}

export default function StudentIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const [data, setData] = useState<Paginated<Student> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [banner, setBanner] = useState<BannerState | null>(
    (location.state as { message?: string } | null)?.message
      ? {
          message: (location.state as { message: string }).message,
          variant: "success",
        }
      : null,
  );

  useEffect(() => {
    let active = true;

    fetchStudents(search, page)
      .then((result) => {
        if (active) {
          setData(result);
          setError(null);
        }
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setData(null);
        setError(
          cause instanceof Error ? cause.message : "Failed to load students.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, page, refreshKey]);

  function updateSearch(next: string) {
    setSearchParams(next ? { search: next } : {});
  }

  function goToPage(next: number) {
    const nextParams: Record<string, string> = {};
    if (search) nextParams.search = search;
    if (next > 1) nextParams.page = String(next);
    setSearchParams(nextParams);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await deleteStudent(deleteTarget.id);
      setBanner({
        message: `${deleteTarget.full_name} was deleted successfully.`,
        variant: "success",
      });
      setDeleteTarget(null);
      setRefreshKey((key) => key + 1);
    } catch (cause) {
      setBanner({
        message:
          cause instanceof Error ? cause.message : "Failed to delete student.",
        variant: "error",
      });
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Students"
        description="Manage student records for the academic registry."
        actions={
          <Link to="/students/create" className={buttonClasses("primary", "md")}>
            <PlusIcon className="size-4" />
            Add Student
          </Link>
        }
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

      <div className="mb-4">
        <StudentSearch initialValue={search} onSearch={updateSearch} />
      </div>

      {error ? (
        <Card>
          <EmptyState
            title="Something went wrong"
            description={error}
            action={
              <button
                type="button"
                className={buttonClasses("outline", "md")}
                onClick={() => setRefreshKey((key) => key + 1)}
              >
                Retry
              </button>
            }
          />
        </Card>
      ) : loading && !data ? (
        <Card>
          <PageLoader label="Loading students…" />
        </Card>
      ) : data ? (
        <Card className="overflow-hidden">
          <StudentTable
            students={data.data}
            loading={loading}
            onDelete={setDeleteTarget}
          />
          <StudentPagination
            currentPage={data.meta.current_page}
            lastPage={data.meta.last_page}
            total={data.meta.total}
            from={data.meta.from}
            to={data.meta.to}
            onPageChange={goToPage}
          />
        </Card>
      ) : null}

      <StudentDeleteDialog
        student={deleteTarget}
        processing={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}