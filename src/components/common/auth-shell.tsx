import type { ReactNode } from "react";
import { Link } from "react-router";
import { LogoIcon } from "@/components/ui/icons";

interface AuthShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-100 to-violet-100 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Link to="/" className="mb-8 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
          <LogoIcon className="size-6" />
        </div>
        <div className="leading-tight">
          <p className="text-base font-semibold text-slate-900 dark:text-white">
          KF Student Records
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
          Student Record Office
          </p>
        </div>
      </Link>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>

        {footer ? (
          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}