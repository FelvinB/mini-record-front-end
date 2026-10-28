import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { ApiError } from "@/lib/api";
import { loginRequest, useAuth } from "@/lib/auth";
import type { ValidationErrors } from "@/types/student";
import { AuthShell } from "@/components/common/auth-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const from =
    (location.state as { from?: string } | null)?.from ?? "";

  if (user) {
    return (
      <Navigate to={user.is_admin ? "/dashboard" : "/my-record"} replace />
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProcessing(true);
    setErrors(null);
    setBanner(null);

    try {
      const session = await loginRequest(email.trim(), password);
      signIn(session);
      navigate(
        from ||
          (session.user.is_admin ? "/dashboard" : "/my-record"),
        { replace: true },
      );
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 422) {
        setErrors(cause.errors);
      } else {
        setBanner(
          cause instanceof Error ? cause.message : "Failed to sign in.",
        );
      }
    } finally {
      setProcessing(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to access the student registry portal."
      footer={
        <>
          Don&apos;t have an account yet?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Register your student account
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
          <Label htmlFor="email">Email Address</Label>
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
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            error={Boolean(errors?.password)}
            onChange={(event) => setPassword(event.target.value)}
          />
          <FieldError name="password" errors={errors} />
        </div>

        <Button type="submit" className="w-full" size="lg" loading={processing}>
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}