import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/cn";
import type { StudentPayload, ValidationErrors } from "@/types/student";
import { COURSE_SUGGESTIONS, YEAR_LEVELS, YEAR_LEVEL_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { buttonClasses } from "@/components/ui/button-classes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookIcon, HashIcon, MailIcon } from "@/components/ui/icons";

export interface StudentFormValues {
  student_number: string;
  first_name: string;
  last_name: string;
  email: string;
  course: string;
  year_level: string;
}

interface StudentFormProps {
  initialValues: StudentFormValues;
  submitLabel: string;
  processing?: boolean;
  errors?: ValidationErrors | null;
  onSubmit: (payload: StudentPayload) => void;
}

interface TextField {
  name: keyof StudentFormValues;
  label: string;
  type?: string;
  icon?: ReactNode;
  maxLength?: number;
  inputMode?: "numeric" | "text";
  hint?: string;
}

const TEXT_FIELDS: TextField[] = [
  {
    name: "student_number",
    label: "Student Number",
    icon: <HashIcon className="size-4 text-slate-400" />,
    maxLength: 8,
    inputMode: "numeric",
    hint: "8 digits: enrollment year (e.g. 2024) + registration number (e.g. 0765).",
  },
  { name: "first_name", label: "First Name" },
  { name: "last_name", label: "Last Name" },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    icon: <MailIcon className="size-4 text-slate-400" />,
  },
  {
    name: "course",
    label: "Course / Program",
    icon: <BookIcon className="size-4 text-slate-400" />,
  },
];

export function StudentForm({
  initialValues,
  submitLabel,
  processing = false,
  errors = null,
  onSubmit,
}: StudentFormProps) {
  const [values, setValues] = useState<StudentFormValues>(initialValues);

  function updateField<K extends keyof StudentFormValues>(
    key: K,
    value: string,
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      student_number: values.student_number.trim(),
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      email: values.email.trim(),
      course: values.course.trim(),
      year_level: Number(values.year_level),
    });
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
        <CardDescription>
          Fields marked with validation will be checked by the server before
          saving.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2">
            {TEXT_FIELDS.map((field) => (
              <div
                key={field.name}
                className={cn(
                  field.name === "email" || field.name === "course"
                    ? "sm:col-span-2"
                    : undefined,
                )}
              >
                <Label htmlFor={field.name}>{field.label}</Label>
                <div className="relative">
                  {field.icon ? (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                      {field.icon}
                    </span>
                  ) : null}
                  {field.name === "course" ? (
                    <>
                      <Input
                        id={field.name}
                        list="course-suggestions"
                        value={values.course}
                        error={Boolean(errors?.[field.name])}
                        onChange={(event) =>
                          updateField(field.name, event.target.value)
                        }
                        className={field.icon ? "pl-9" : undefined}
                      />
                      <datalist id="course-suggestions">
                        {COURSE_SUGGESTIONS.map((course) => (
                          <option key={course} value={course} />
                        ))}
                      </datalist>
                    </>
                  ) : (
                    <Input
                        id={field.name}
                        type={field.type ?? "text"}
                        value={values[field.name]}
                        error={Boolean(errors?.[field.name])}
                        maxLength={field.maxLength}
                        inputMode={field.inputMode}
                        onChange={(event) =>
                          updateField(field.name, event.target.value)
                        }
                        className={field.icon ? "pl-9" : undefined}
                      />
                    )}
                  </div>
                  <FieldError name={field.name} errors={errors} />
                  {field.hint ? (
                    <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                      {field.hint}
                    </p>
                  ) : null}
                </div>
            ))}

            <div className="sm:col-span-2">
              <Label htmlFor="year_level">Year Level</Label>
              <div className="grid grid-cols-4 gap-2">
                {YEAR_LEVELS.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => updateField("year_level", String(year))}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                      values.year_level === String(year)
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
          <Link to="/students" className={buttonClasses("outline", "md")}>
            Cancel
          </Link>
          <Button type="submit" loading={processing}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}