import { Link } from "react-router-dom";
import {
  Sparkles,
  BriefcaseBusiness,
  PlusCircle,
  ClipboardList,
  Building2,
  ArrowRight,
  CheckCircle2,
  BarChart3,
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

export default function EmployerDashboard() {
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
            Employer Dashboard
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome, <span className="text-white">{user?.fullName || "Employer"}</span>
          </h1>

          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            Post jobs, manage your listings, and review candidate applications with a clean,
            professional workflow.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/employer/post-job" className="btn-primary">
              <PlusCircle className="h-4 w-4" />
              Post a Job
            </Link>
            <Link to="/employer/jobs" className="btn-ghost">
              <BriefcaseBusiness className="h-4 w-4" />
              My Jobs
            </Link>
            <Link to="/employer/applications" className="btn-ghost">
              <ClipboardList className="h-4 w-4" />
              Applications
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="badge justify-center">Role-based access</div>
            <div className="badge justify-center">Ownership checks</div>
            <div className="badge justify-center">Fast workflow</div>
          </div>
        </div>
      </section>

      {/* Stats placeholders (API later) */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Active jobs"
          value="—"
          icon={BarChart3}
          hint="Jobs currently visible to candidates."
        />
        <StatCard
          title="Applications received"
          value="—"
          icon={ClipboardList}
          hint="Total applications across your job posts."
        />
        <StatCard
          title="Company profile"
          value="—"
          icon={CheckCircle2}
          hint="Complete your company info for trust."
        />
      </section>

      {/* Actions */}
      <section className="grid gap-4 lg:grid-cols-3">
        <ActionCard
          title="Post Job"
          desc="Create a new job listing with salary, type and description."
          to="/employer/post-job"
          icon={PlusCircle}
          accent="from-indigo-500 to-sky-500"
        />
        <ActionCard
          title="My Jobs"
          desc="Edit, view, and manage your job posts."
          to="/employer/jobs"
          icon={BriefcaseBusiness}
          accent="from-fuchsia-500 to-rose-500"
        />
        <ActionCard
          title="Company Profile"
          desc="Update company name, city, industry, and description."
          to="/employer/company"
          icon={Building2}
          accent="from-emerald-500 to-lime-500"
        />
      </section>
    </div>
  );
}
