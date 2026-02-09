import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Stat({ icon: Icon, title, desc }) {
  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 border border-white/10">
          <Icon className="h-5 w-5 text-slate-100" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-1 text-xs text-slate-300">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-sm text-slate-300">{desc}</div>
    </div>
  );
}

function RoleCard({ title, desc, to, icon: Icon, accent = "from-indigo-500 to-fuchsia-500" }) {
  return (
    <div className="glass rounded-3xl p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-extrabold tracking-tight text-white">{title}</div>
          <p className="mt-2 text-sm text-slate-300">{desc}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accent} shadow-[0_10px_25px_rgba(0,0,0,.25)]`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>

      <Link
        to={to}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        Get Started <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();

  const dashboardLink =
    user?.role === "Candidate"
      ? "/candidate"
      : user?.role === "Employer"
      ? "/employer"
      : user?.role === "Admin"
      ? "/admin"
      : null;

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur sm:p-10">
        {/* Decorative */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[360px] w-[360px] rounded-full bg-indigo-500/25 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-36 -right-28 h-[420px] w-[420px] rounded-full bg-fuchsia-500/20 blur-[110px]" />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
              <Sparkles className="h-4 w-4" />
              Premium hiring experience
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Find the right job.
              <span className="block bg-gradient-to-r from-indigo-300 to-fuchsia-200 bg-clip-text text-transparent">
                Hire the right talent.
              </span>
            </h1>

            <p className="mt-4 text-base text-slate-300">
              JobPortal connects <span className="text-white font-semibold">Candidates</span> and{" "}
              <span className="text-white font-semibold">Employers</span> with a fast, modern and clean workflow:
              browse jobs, apply in seconds, and manage applications with ease.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/jobs" className="btn-primary">
                <Search className="h-4 w-4" />
                Browse Jobs
              </Link>

              {!user ? (
                <Link to="/register" className="btn-ghost">
                  <UserPlusIcon />
                  Create Account
                </Link>
              ) : (
                dashboardLink && (
                  <Link to={dashboardLink} className="btn-ghost">
                    <Building2 className="h-4 w-4" />
                    Go to Dashboard
                  </Link>
                )
              )}
            </div>

            {/* quick highlights */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="badge justify-center">Role-based access</div>
              <div className="badge justify-center">Secure JWT auth</div>
              <div className="badge justify-center">Real applications flow</div>
            </div>
          </div>

          {/* Right panel: quick search */}
          <div className="glass rounded-3xl p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white">Quick Search</div>
                <div className="mt-1 text-xs text-slate-300">
                  Jump straight into jobs listing with filters.
                </div>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                Fast
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <label className="label">Keyword</label>
                <input className="input mt-2" placeholder="e.g. React Developer, QA, Designer..." />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">City</label>
                  <input className="input mt-2" placeholder="e.g. Skopje" />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select className="input mt-2">
                    <option>Any</option>
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <label className="inline-flex items-center gap-2 text-sm text-slate-200">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/10" />
                  Remote only
                </label>
              </div>

              <Link
                to="/jobs"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(0,0,0,.25)] transition hover:opacity-95"
              >
                Search Jobs <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="text-xs text-slate-400">
                Next step: we’ll connect this search with real API filters.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={TrendingUp} title="Smart filtering" desc="Search by title, city, remote, salary & type." />
        <Stat icon={CheckCircle2} title="Easy apply" desc="Apply in seconds with optional cover letter." />
        <Stat icon={Users} title="Candidate tools" desc="Wishlist, profile, and application tracking." />
        <Stat icon={Briefcase} title="Employer tools" desc="Post jobs and manage applications fast." />
      </section>

      {/* FEATURES */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Feature
          title="Clean experience"
          desc="A premium UI with fast navigation, responsive layout and modern design system."
        />
        <Feature
          title="Secure access"
          desc="JWT authentication + role-based routes for Candidate, Employer and Admin."
        />
        <Feature
          title="Real workflow"
          desc="Jobs → Apply → Employer reviews → Status updates, exactly like a real platform."
        />
      </section>

      {/* ROLE CTA */}
      <section className="grid gap-4 lg:grid-cols-2">
        <RoleCard
          title="For Candidates"
          desc="Discover jobs, save favorites, apply fast, and track your applications in one place."
          to={!user ? "/register" : "/candidate"}
          icon={Users}
          accent="from-indigo-500 to-sky-500"
        />
        <RoleCard
          title="For Employers"
          desc="Post jobs, manage listings, review applications, and update statuses quickly."
          to={!user ? "/register" : "/employer"}
          icon={Building2}
          accent="from-fuchsia-500 to-rose-500"
        />
      </section>

      {/* FINAL CTA */}
      <section className="section-card">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xl font-extrabold text-white">Ready to start?</div>
            <p className="mt-1 text-sm text-slate-300">
              Create your account and experience a full end-to-end job platform.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/jobs" className="btn-ghost">
              Browse Jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/register" className="btn-primary">
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Small inline icon to avoid extra import noise */
function UserPlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M19 8v6M22 11h-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
