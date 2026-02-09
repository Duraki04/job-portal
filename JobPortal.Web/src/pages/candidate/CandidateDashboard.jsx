import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  FileText,
  User,
  Briefcase,
  Sparkles,
  CheckCircle2,
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

export default function CandidateDashboard() {
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
            Candidate Dashboard
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome, <span className="text-white">{user?.fullName || "Candidate"}</span>
          </h1>

          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            Manage your wishlist, track your applications and keep your profile ready.
            This dashboard will become “live” once we connect the API stats.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/jobs" className="btn-primary">
              <Briefcase className="h-4 w-4" />
              Browse Jobs
            </Link>
            <Link to="/candidate/profile" className="btn-ghost">
              <User className="h-4 w-4" />
              Edit Profile
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="badge justify-center">Role-based access</div>
            <div className="badge justify-center">Wishlist ready</div>
            <div className="badge justify-center">Applications tracking</div>
          </div>
        </div>
      </section>

      {/* Stats (placeholder now, API later) */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Wishlist"
          value="—"
          icon={Bookmark}
          hint="Saved jobs you want to apply later."
        />
        <StatCard
          title="Applications"
          value="—"
          icon={FileText}
          hint="Your submitted applications and statuses."
        />
        <StatCard
          title="Profile completeness"
          value="—"
          icon={CheckCircle2}
          hint="Add CV and skills to boost visibility."
        />
      </section>

      {/* Actions */}
      <section className="grid gap-4 lg:grid-cols-3">
        <ActionCard
          title="My Applications"
          desc="See all jobs you applied to and track status updates."
          to="/candidate/applications"
          icon={FileText}
          accent="from-indigo-500 to-sky-500"
        />
        <ActionCard
          title="Wishlist"
          desc="Jobs you saved — apply anytime with one click."
          to="/candidate/wishlist"
          icon={Bookmark}
          accent="from-fuchsia-500 to-rose-500"
        />
        <ActionCard
          title="My Profile"
          desc="Update CV URL, experience level, city, and skills."
          to="/candidate/profile"
          icon={User}
          accent="from-emerald-500 to-lime-500"
        />
      </section>
    </div>
  );
}
