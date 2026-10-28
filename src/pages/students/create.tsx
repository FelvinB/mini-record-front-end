import { useState } from "react";
import { useNavigate } from "react-router";
import { ApiError } from "@/lib/api";
import { createStudent } from "@/lib/students";
import type { StudentPayload, ValidationErrors } from "@/types/student";
import { PageHeader } from "@/components/common/page-header";
import { MessageBanner } from "@/components/common/message-banner";
import {
  StudentForm,
  type StudentFormValues,
} from "@/components/features/students/student-form";

const INITIAL_VALUES: StudentFormValues = {
  student_number: "",
  first_name: "",
  last_name: "",
  email: "",
  course: "",
  year_level: "1",
};

export default function StudentCreatePage() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  async function handleSubmit(payload: StudentPayload) {
    setProcessing(true);
    setErrors(null);
    setBanner(null);

    try {
      await createStudent(payload);
      navigate("/students", {
        state: {
          message: `${payload.first_name} ${payload.last_name} was added successfully.`,
        },
      });
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 422) {
        setErrors(cause.errors);
      } else {
        setBanner(
          cause instanceof Error ? cause.message : "Failed to add student.",
        );
      }
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Add Student"
        description="Enter the details of the new student record."
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

      <StudentForm
        initialValues={INITIAL_VALUES}
        submitLabel="Save Student"
        processing={processing}
        errors={errors}
        onSubmit={handleSubmit}
      />
    </>
  );
}