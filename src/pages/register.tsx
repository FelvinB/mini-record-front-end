import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { ApiError } from "@/lib/api";
import { registerRequest, useAuth } from "@/lib/auth";
import type { ValidationErrors } from "@/types/student";
import { AuthShell } from "@/components/common/auth-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationIcon, LockIcon } from "@/components/ui/icons";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();

  const [studentNumber, setStudentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  if (user) {
    return <Navigate to={user.is_admin ? "/dashboard" : "/my-record"} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProcessing(true);
    setErrors(null);
    setBanner(null);

    try {
      const session = await registerRequest({
        student_number: studentNumber.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });
      signIn(session);
      navigate("/my-record");
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 422) {
        setErrors(cause.errors);
      } else {
        setBanner(
          cause instanceof Error ? cause.message : "Failed to create account.",
        );
      }
    } finally {
      setProcessing(false);
    }
  }

  return (
    <AuthShell
      title="Student registration"
      description="Create your portal account. Your details must match a record already in the registry."
      footer={
        <>
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Sign in instead
          </Link>
        </>
      }
    >
      {banner ? (
        <div className="mb-4">
          <Alert variant="error" message={banner} />
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <Label htmlFor="student_number">Student Number</Label>
          <div className="relative">
            <GraduationIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="student_number"
              autoComplete="off"
              value={studentNumber}
              error={Boolean(errors?.student_number)}
              maxLength={8}
              inputMode="numeric"
              onChange={(event) => setStudentNumber(event.target.value)}
              className="pl-9"
            />
          </div>
          <FieldError name="student_number" errors={errors} />
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            8 digits: enrollment year (e.g. 2024) + registration number (e.g.
            0765).
          </p>
        </div>

        <div>
          <Label htmlFor="email">Registry Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            error={Boolean(errors?.email)}
            onChange={(event) => setEmail(event.target.value)}
          />
          <FieldError name="email" errors={errors} />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              error={Boolean(errors?.password)}
              onChange={(event) => setPassword(event.target.value)}
              className="pl-9"
            />
          </div>
          <FieldError name="password" errors={errors} />
        </div>

        <div>
          <Label htmlFor="password_confirmation">Confirm Password</Label>
          <Input
            id="password_confirmation"
            type="password"
            autoComplete="new-password"
            value={passwordConfirmation}
            error={Boolean(errors?.password)}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={processing}
        >
          Create student account
        </Button>
      </form>
    </AuthShell>
  );
}