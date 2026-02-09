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
            Admin Area
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome, <span className="text-white">{user?.fullName || "Admin"}</span>
          </h1>

          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            Manage the platform: users, companies, jobs, and system settings.
            (Stats will become live after connecting Admin API endpoints.)
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/admin" className="btn-primary">
              <Crown className="h-4 w-4" />
              Admin Dashboard
            </Link>
            <Link to="/jobs" className="btn-ghost">
              <BriefcaseBusiness className="h-4 w-4" />
              Browse Jobs
            </Link>
            <Link to="/companies" className="btn-ghost">
              <Building2 className="h-4 w-4" />
              Companies
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="badge justify-center">Role-based access</div>
            <div className="badge justify-center">Admin controls</div>
            <div className="badge justify-center">Secure JWT</div>
          </div>
        </div>
      </section>

      {/* Stats placeholders */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total users"
          value="—"
          icon={Users}
          hint="All registered accounts."
        />
        <StatCard
          title="Total companies"
          value="—"
          icon={Building2}
          hint="Registered employer companies."
        />
        <StatCard
          title="Total jobs"
          value="—"
          icon={BriefcaseBusiness}
          hint="Active job listings on the platform."
        />
        <StatCard
          title="Applications"
          value="—"
          icon={ClipboardList}
          hint="All applications submitted."
        />
        <StatCard
          title="Security"
          value="—"
          icon={ShieldCheck}
          hint="Auth & role-based protections."
        />
        <StatCard
          title="Analytics"
          value="—"
          icon={BarChart3}
          hint="KPIs once connected to API."
        />
      </section>

      {/* Actions */}
      <section className="grid gap-4 lg:grid-cols-3">
        <ActionCard
          title="Manage Users"
          desc="View and manage registered users (candidates/employers)."
          to="/admin/users"
          icon={Users}
          accent="from-indigo-500 to-sky-500"
        />
        <ActionCard
          title="Manage Companies"
          desc="View company profiles and employer accounts."
          to="/admin/companies"
          icon={Building2}
          accent="from-fuchsia-500 to-rose-500"
        />
        <ActionCard
          title="Platform Settings"
          desc="System configuration and admin tools."
          to="/admin/settings"
          icon={Settings}
          accent="from-emerald-500 to-lime-500"
        />
      </section>

      {/* Note */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="text-sm font-extrabold text-white">Note</div>
        <p className="mt-2 text-sm text-slate-300">
          Nëse nuk i ke krijuar ende routes si <span className="text-white font-semibold">/admin/users</span>,
          <span className="text-white font-semibold"> /admin/companies</span> dhe{" "}
          <span className="text-white font-semibold">/admin/settings</span>, krijoji ose ndrysho këto link-e
          që të përputhen me AppRoutes.jsx.
        </p>
      </section>
    </div>
  );
}
