import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ApiError } from "@/lib/api";
import { fetchStudent, updateStudent } from "@/lib/students";
import type { Student, StudentPayload, ValidationErrors } from "@/types/student";
import { PageHeader } from "@/components/common/page-header";
import { MessageBanner } from "@/components/common/message-banner";
import { EmptyState } from "@/components/common/empty-state";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button-classes";
import { PageLoader } from "@/components/ui/spinner";
import {
  StudentForm,
  type StudentFormValues,
} from "@/components/features/students/student-form";

export default function StudentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
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

  async function handleSubmit(payload: StudentPayload) {
    if (!student) return;

    setProcessing(true);
    setErrors(null);
    setBanner(null);

    try {
      await updateStudent(student.id, payload);
      navigate("/students", {
        state: {
          message: `${payload.first_name} ${payload.last_name} was updated successfully.`,
        },
      });
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 422) {
        setErrors(cause.errors);
      } else {
        setBanner(
          cause instanceof Error ? cause.message : "Failed to update student.",
        );
      }
    } finally {
      setProcessing(false);
    }
  }

  const initialValues: StudentFormValues = student
    ? {
        student_number: student.student_number,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        course: student.course,
        year_level: String(student.year_level),
      }
    : {
        student_number: "",
        first_name: "",
        last_name: "",
        email: "",
        course: "",
        year_level: "1",
      };

  return (
    <>
      <PageHeader
        title="Edit Student"
        description={
          student
            ? `Updating the record for ${student.full_name}.`
            : "Updating a student record."
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
              <a
                href="/students"
                className={buttonClasses("outline", "md")}
              >
                Back to Students
              </a>
            }
          />
        </Card>
      ) : student ? (
        <StudentForm
          initialValues={initialValues}
          submitLabel="Update Student"
          processing={processing}
          errors={errors}
          onSubmit={handleSubmit}
        />
      ) : null}
    </>
  );
}