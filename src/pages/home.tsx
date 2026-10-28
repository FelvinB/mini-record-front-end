import { Link } from "react-router";
import { useAuth } from "@/lib/auth";
import { buttonClasses } from "@/components/ui/button-classes";
import {
  ArrowRightIcon,
  ChartBarIcon,
  GraduationIcon,
  LogoIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@/components/ui/icons";

const FEATURES = [
  {
    icon: UserIcon,
    title: "Student self-service",
    description:
      "Students register with their student number and sign in to view and keep their own record up to date.",
  },
  {
    icon: ChartBarIcon,
    title: "Registry dashboards",
    description:
      "Course and year-level distributions, plus the latest enrolments, all summarized at a glance.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure account access",
    description:
      "Token-based sign-in ties each account to exactly one verified record in the registry.",
  },
] as const;

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
              <LogoIcon className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                KF Student Records
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Student Record Office
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {user ? (
              <Link
                to={user.is_admin ? "/dashboard" : "/my-record"}
                className={buttonClasses("primary", "md")}
              >
                {user.is_admin ? "Dashboard" : "My record"}
                <ArrowRightIcon className="size-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className={buttonClasses("ghost", "md")}>
                  Sign in
                </Link>
                <Link to="/register" className={buttonClasses("primary", "md")}>
                  Create student account
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-32 left-1/2 size-[480px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <GraduationIcon className="size-3.5" />
              KF Student Record System
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              One place for student records
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-slate-600 dark:text-slate-400 sm:text-lg">
              A lightweight academic registry built with Laravel and React.
              Admins manage the full roster while students claim their own
              record and keep it current.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {user ? (
                <Link
                  to={user.is_admin ? "/dashboard" : "/my-record"}
                  className={buttonClasses("primary", "lg")}
                >
                  {user.is_admin ? "Open the dashboard" : "Open my record"}
                  <ArrowRightIcon className="size-5" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className={buttonClasses("primary", "lg")}>
                    Register student account
                  </Link>
                  <Link to="/login" className={buttonClasses("outline", "lg")}>
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
                  <feature.icon className="size-5" />
                </div>
                <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                How it works
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                The registry already holds the official student records. A
                student account simply unlocks them.
              </p>
            </div>

            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Verify your identity",
                  description:
                    "Registration requires a real student number and the email stored on the matching registry record.",
                },
                {
                  step: "02",
                  title: "Sign in securely",
                  description:
                    "Your token keeps you signed in across the portal without exposing the underlying record API.",
                },
                {
                  step: "03",
                  title: "Keep your record current",
                  description:
                    "View your details and edit your name, course, and year level whenever they change.",
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
                    {item.step}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-500 dark:text-slate-500 sm:px-6">
          Mini Student Record System · Laravel 12 + React · Academic registry
        </div>
      </footer>
    </div>
  );
}