import type { Student } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface StudentDeleteDialogProps {
  student: Student | null;
  processing: boolean;
  onCancel: () => void;
  onConfirm: (student: Student) => void;
}

export function StudentDeleteDialog({
  student,
  processing,
  onCancel,
  onConfirm,
}: StudentDeleteDialogProps) {
  return (
    <Modal
      open={student !== null}
      onClose={onCancel}
      title="Delete student record?"
      description={
        student ? (
          <>
            This will permanently remove <strong>{student.full_name}</strong> (
            <span className="font-mono">{student.student_number}</span>) from the
            registry. This action cannot be undone.
          </>
        ) : null
      }
      footer={
        <>
          <Button variant="outline" onClick={onCancel} disabled={processing}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={processing}
            onClick={() => student && onConfirm(student)}
          >
            Delete student
          </Button>
        </>
      }
    />
  );
}