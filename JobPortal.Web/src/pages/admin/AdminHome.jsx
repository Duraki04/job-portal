import { Link } from "react-router-dom";
import {
  Crown,
  Sparkles,
  Users,
  Building2,
  BriefcaseBusiness,
  ClipboardList,
  ShieldCheck,
  ArrowRight,
  BarChart3,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function StatCard({ title, value, icon: Icon, hint }) {
  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-200">{title}</div>
          <div className="mt-2 text-2xl font-extrabold text-white">{value}</div>
          {hint && <div className="mt-2 text-sm text-slate-300">{hint}</div>}
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, to, icon: Icon, accent }) {
  return (
    <Link
      to={to}
      className="group block rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/7 hover:border-white/15"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-lg font-extrabold tracking-tight text-white">
            {title}
          </div>
          <p className="mt-2 text-sm text-slate-300">{desc}</p>
        </div>

        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accent} shadow-[0_10px_25px_rgba(0,0,0,.25)]`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
        Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export default function AdminHome() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur sm:p-10">
        <div className="pointer-events-none absolute -top-40 left-[-160px] h-[420px] w-[420px] rounded-full bg-indigo-500/25 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-44 right-[-150px] h-[460px] w-[460px] rounded-full bg-fuchsia-500/20 blur-[120px]" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
            <Sparkles className="h-4 w-4" />
            Admin Panel
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome, <span className="text-white">{user?.fullName || "Admin"}</span>
          </h1>

          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            Manage and oversee the platform: users, companies, jobs, and applications.
            (We’ll connect the real admin APIs next.)
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/jobs" className="btn-primary">
              <BriefcaseBusiness className="h-4 w-4" />
              Browse Jobs
            </Link>

            <button className="btn-ghost" type="button">
              <Settings className="h-4 w-4" />
              Admin Settings (soon)
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-[0_12px_26px_rgba(0,0,0,.25)]">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-amber-100">
                  Admin-only access
                </div>
                <div className="mt-1 text-sm text-amber-100/90">
                  This area should be protected by role-based authorization (already enforced in routes).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats (placeholders for now) */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Users" value="—" icon={Users} hint="Total registered users." />
        <StatCard title="Companies" value="—" icon={Building2} hint="Employer profiles created." />
        <StatCard title="Jobs" value="—" icon={BriefcaseBusiness} hint="Total job posts." />
        <StatCard title="Applications" value="—" icon={ClipboardList} hint="Total applications submitted." />
      </section>

      {/* Actions (future pages) */}
      <section className="grid gap-4 lg:grid-cols-4">
        <ActionCard
          title="Users"
          desc="View and manage accounts."
          to="/admin"
          icon={Users}
          accent="from-indigo-500 to-sky-500"
        />
        <ActionCard
          title="Companies"
          desc="Review employer profiles."
          to="/admin"
          icon={Building2}
          accent="from-fuchsia-500 to-rose-500"
        />
        <ActionCard
          title="Jobs"
          desc="Monitor job postings."
          to="/admin"
          icon={BriefcaseBusiness}
          accent="from-emerald-500 to-lime-500"
        />
        <ActionCard
          title="Security"
          desc="Audit access and roles."
          to="/admin"
          icon={ShieldCheck}
          accent="from-slate-600 to-slate-900"
        />
      </section>

      <section className="glass rounded-3xl p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold text-white">Next step</div>
            <div className="mt-1 text-sm text-slate-300">
              When you’re ready, we’ll add admin endpoints in C# (Users/Companies/Jobs overview)
              and connect these stats + pages.
            </div>
          </div>

          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
        </div>
      </section>
    </div>
  );
}
