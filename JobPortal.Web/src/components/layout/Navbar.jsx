import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Briefcase,
  Building2,
  ChevronDown,
  Heart,
  LogIn,
  LogOut,
  Menu,
  User,
  UserPlus,
  X,
} from "lucide-react";

const linkBase =
  "whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition";
const linkActive = "bg-white/10 text-white";
const linkIdle = "text-slate-200 hover:bg-white/5 hover:text-white";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkIdle}`
      }
    >
      {children}
    </NavLink>
  );
}

function RoleBadge({ role }) {
  const cls = useMemo(() => {
    if (role === "Admin") return "border-rose-400/25 bg-rose-500/10 text-rose-100";
    if (role === "Employer") return "border-emerald-400/25 bg-emerald-500/10 text-emerald-100";
    return "border-indigo-400/25 bg-indigo-500/10 text-indigo-100";
  }, [role]);

  return (
    <span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {role}
    </span>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardLink = useMemo(() => {
    if (!user) return null;
    if (user.role === "Candidate") return "/candidate";
    if (user.role === "Employer") return "/employer";
    if (user.role === "Admin") return "/admin";
    return "/";
  }, [user]);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    setMobileOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="container-max flex items-center justify-between py-3">
        {/* Brand */}
        <Link
          to="/"
          className="group flex items-center gap-2 rounded-2xl pr-2 transition hover:bg-white/5"
          onClick={() => setMobileOpen(false)}
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_10px_25px_rgba(0,0,0,.25)]">
            <Briefcase className="h-5 w-5 text-white" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-tight text-white">
              JobPortal
            </div>
            <div className="text-xs text-slate-300">
              Hire & Get Hired
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavItem to="/jobs">Jobs</NavItem>
          <NavItem to="/companies">Companies</NavItem>

          {!user ? (
            <>
              <NavItem to="/login">
                <span className="inline-flex items-center gap-2">
                  <LogIn className="h-4 w-4" /> Login
                </span>
              </NavItem>
              <NavItem to="/register">
                <span className="inline-flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Register
                </span>
              </NavItem>
            </>
          ) : (
            <div className="relative ml-2">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/10">
                  <User className="h-4 w-4" />
                </span>
                <span className="max-w-[160px] truncate">
                  {user.fullName}
                </span>
                <RoleBadge role={user.role} />
                <ChevronDown className={`h-4 w-4 transition ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-[260px] rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,.55)] backdrop-blur"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <div className="px-2 py-2">
                    <div className="text-sm font-semibold text-white truncate">
                      {user.fullName}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      User ID: {user.userId}
                    </div>
                  </div>

                  <div className="my-2 h-px bg-white/10" />

                  {user.role === "Candidate" && (
                    <>
                      <Link
                        to="/candidate"
                        className={`${linkBase} ${linkIdle} flex items-center gap-2 w-full`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Building2 className="h-4 w-4" />
                        Candidate Dashboard
                      </Link>
                      <Link
                        to="/candidate/wishlist"
                        className={`${linkBase} ${linkIdle} flex items-center gap-2 w-full`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                      <Link
                        to="/candidate/profile"
                        className={`${linkBase} ${linkIdle} flex items-center gap-2 w-full`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </>
                  )}

                  {user.role === "Employer" && (
                    <>
                      <Link
                        to="/employer"
                        className={`${linkBase} ${linkIdle} flex items-center gap-2 w-full`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Building2 className="h-4 w-4" />
                        Employer Dashboard
                      </Link>
                      <Link
                        to="/employer/post-job"
                        className={`${linkBase} ${linkIdle} flex items-center gap-2 w-full`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Briefcase className="h-4 w-4" />
                        Post a Job
                      </Link>
                      <Link
                        to="/employer/jobs"
                        className={`${linkBase} ${linkIdle} flex items-center gap-2 w-full`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Briefcase className="h-4 w-4" />
                        My Jobs
                      </Link>
                      <Link
                        to="/employer/company"
                        className={`${linkBase} ${linkIdle} flex items-center gap-2 w-full`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Company Profile
                      </Link>
                    </>
                  )}

                  {user.role === "Admin" && (
                    <>
                      <Link
                        to="/admin"
                        className={`${linkBase} ${linkIdle} flex items-center gap-2 w-full`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Building2 className="h-4 w-4" />
                        Admin Area
                      </Link>
                    </>
                  )}

                  <div className="my-2 h-px bg-white/10" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-100 hover:bg-white/10"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur">
          <div className="container-max py-3">
            <div className="flex flex-col gap-2">
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `w-full ${linkBase} ${isActive ? linkActive : linkIdle}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Jobs
              </NavLink>

              <NavLink
                to="/companies"
                className={({ isActive }) =>
                  `w-full ${linkBase} ${isActive ? linkActive : linkIdle}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Companies
              </NavLink>

              {!user ? (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `w-full ${linkBase} ${isActive ? linkActive : linkIdle}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <LogIn className="h-4 w-4" /> Login
                    </span>
                  </NavLink>

                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `w-full ${linkBase} ${isActive ? linkActive : linkIdle}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <UserPlus className="h-4 w-4" /> Register
                    </span>
                  </NavLink>
                </>
              ) : (
                <>
                  <div className="mt-1 rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-sm font-semibold text-white truncate">
                      {user.fullName}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <RoleBadge role={user.role} />
                      <span className="text-xs text-slate-400">ID: {user.userId}</span>
                    </div>
                  </div>

                  {dashboardLink && (
                    <Link
                      to={dashboardLink}
                      className="btn-primary w-full"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Building2 className="h-4 w-4" />
                      Go to Dashboard
                    </Link>
                  )}

                  {user.role === "Candidate" && (
                    <Link
                      to="/candidate/wishlist"
                      className="btn-ghost w-full"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </Link>
                  )}

                  <button onClick={handleLogout} className="btn-danger w-full">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
