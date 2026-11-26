import * as React from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";
import { useAuth } from "@/lib/auth";
import { useSite } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/collections" },
  { label: "About", to: "/about" },
];

export function Navbar() {
  const { site } = useSite();
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const siteName = site?.siteName || "Hall of Fame";

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--hof-border-subtle)] bg-[var(--hof-surface)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="text-sm font-bold tracking-[0.06em] uppercase text-[var(--hof-text)] transition-opacity hover:opacity-80"
        >
          {siteName}
        </Link>

        {/* Desktop center links */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-[var(--hof-text)]"
                    : "text-[var(--hof-muted)] hover:text-[var(--hof-text)]",
                )
              }
            >
              <RandomLetterSwap
                label={item.label}
                staggerDuration={0.025}
                transition={{ duration: 0.6, type: "spring" }}
                className="cursor-pointer"
              />
            </NavLink>
          ))}
        </nav>

        {/* Desktop right auth controls */}
        <div className="hidden items-center gap-4 md:flex">
          {isAdmin ? (
            <>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    "rounded-lg border border-[var(--hof-accent)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                    isActive
                      ? "bg-[var(--hof-accent-light)] text-[var(--hof-shadow)]"
                      : "bg-[var(--hof-card)] text-[var(--hof-text)] hover:bg-[var(--hof-accent-deep)]",
                  )
                }
              >
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-[var(--hof-muted)] transition-colors hover:text-[var(--hof-text)]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg border border-[var(--hof-accent)] bg-[var(--hof-card)] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--hof-text)] transition-colors hover:bg-[var(--hof-accent-deep)]"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--hof-text)] hover:bg-[var(--hof-card)] md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile collapsible menu */}
      {mobileOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Mobile navigation"
          className="border-t border-[var(--hof-border-subtle)] bg-[var(--hof-surface)] px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-[var(--hof-card)] text-[var(--hof-text)]"
                      : "text-[var(--hof-muted)] hover:bg-[var(--hof-card)] hover:text-[var(--hof-text)]",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-2 border-t border-[var(--hof-border-subtle)] pt-3">
              {isAdmin ? (
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg border border-[var(--hof-accent)] bg-[var(--hof-card)] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--hof-text)]"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--hof-muted)] hover:text-[var(--hof-text)]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="inline-block rounded-lg border border-[var(--hof-accent)] bg-[var(--hof-card)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--hof-text)]"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
