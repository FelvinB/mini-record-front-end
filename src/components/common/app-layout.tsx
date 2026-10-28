import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import {
  DatabaseIcon,
  HomeIcon,
  LogoIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  UsersIcon,
  XIcon,
} from "@/components/ui/icons";

type NavItemDef = {
  to: string;
  label: string;
  icon: typeof HomeIcon;
  end: boolean;
};

const NAV_ITEMS: readonly NavItemDef[] = [
  { to: "/dashboard", label: "Dashboard", icon: HomeIcon, end: true },
  { to: "/students", label: "Students", icon: UsersIcon, end: false },
  { to: "/my-record", label: "My Record", icon: UserIcon, end: true },
];

function Brand() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
        <LogoIcon className="size-6" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-white">Student Records</p>
        <p className="text-xs text-slate-400">Academic Registry</p>
      </div>
    </div>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  end,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: typeof HomeIcon;
  end: boolean;
  onNavigate?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/10 text-white ring-1 ring-inset ring-indigo-400/30"
            : "text-slate-400 hover:bg-white/5 hover:text-slate-100",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn("size-5", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
          {label}
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({
  navItems,
  onNavigate,
}: {
  navItems: readonly NavItemDef[];
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-6">
      <Brand />
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            end={item.end}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <DatabaseIcon className="size-4 text-indigo-400" />
          Backend API
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
          Laravel 12 + MySQL at <span className="text-slate-300">/api</span>
        </p>
      </div>
    </div>
  );
}

function UserChip() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const initials = user
    ? user.name
        .split(" ")
        .map((part) => part.charAt(0))
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-full bg-slate-100 py-1.5 pl-1.5 pr-3 dark:bg-slate-800">
        <span className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white">
          {initials}
        </span>
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {user?.name ?? "Student"}
        </span>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-500"
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOutIcon className="size-5" />
      </button>
    </div>
  );
}

const TITLE_BY_PATTERN: Array<[RegExp, string]> = [
  [/^\/dashboard$/, "Dashboard"],
  [/^\/my-record$/, "My Record"],
  [/^\/students\/create$/, "Add Student"],
  [/^\/students\/\d+\/edit$/, "Edit Student"],
  [/^\/students\/\d+$/, "Student Details"],
  [/^\/students/, "Students"],
];

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const isAdmin = user?.is_admin === true;
  const navItems = NAV_ITEMS.filter(
    (item) => isAdmin || (item.to !== "/dashboard" && item.to !== "/students"),
  );

  const title =
    TITLE_BY_PATTERN.find(([pattern]) => pattern.test(location.pathname))?.[1] ??
    "Student Records";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-slate-900 lg:block">
        <SidebarContent navItems={navItems} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-slate-900 shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-5 text-slate-400 hover:text-white"
              aria-label="Close menu"
            >
              <XIcon className="size-6" />
            </button>
            <SidebarContent navItems={navItems} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon className="size-6" />
            </button>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Registry
              </p>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
                {title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <SunIcon className="size-5" />
              ) : (
                <MoonIcon className="size-5" />
              )}
            </button>
            <UserChip />
          </div>
        </header>

        <main className="app-scrollbar mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}