import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  RefreshCw,
  Globe,
} from "lucide-react";
import { api } from "../../api/http"; // ✅ axios instance
import JobCard from "../../components/JobCard";

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="glass rounded-[32px] p-7 sm:p-10">
        <div className="h-7 w-2/3 rounded-xl bg-white/10" />
        <div className="mt-3 flex gap-2">
          <div className="h-6 w-28 rounded-full bg-white/10" />
          <div className="h-6 w-24 rounded-full bg-white/10" />
        </div>
        <div className="mt-6 h-4 w-4/5 rounded-xl bg-white/10" />
        <div className="mt-2 h-4 w-3/5 rounded-xl bg-white/10" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <div className="h-5 w-40 rounded-xl bg-white/10" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full rounded-xl bg-white/10" />
            <div className="h-4 w-11/12 rounded-xl bg-white/10" />
            <div className="h-4 w-10/12 rounded-xl bg-white/10" />
            <div className="h-4 w-9/12 rounded-xl bg-white/10" />
          </div>
        </div>
        <div className="glass rounded-3xl p-6">
          <div className="h-5 w-28 rounded-xl bg-white/10" />
          <div className="mt-4 h-10 w-full rounded-2xl bg-white/10" />
          <div className="mt-3 h-10 w-full rounded-2xl bg-white/10" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-white/10 bg-white/5 p-5"
          >
            <div className="h-6 w-2/3 rounded-xl bg-white/10" />
            <div className="mt-3 h-4 w-1/2 rounded-xl bg-white/10" />
            <div className="mt-2 h-4 w-2/3 rounded-xl bg-white/10" />
            <div className="my-5 h-px bg-white/10" />
            <div className="h-9 w-20 rounded-xl bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-200">{title}</div>
          <div className="mt-1 text-sm font-bold text-white truncate">
            {value || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [company, setCompany] = useState(null);

  const companyName = useMemo(() => company?.name ?? "Company", [company]);
  const companyCity = useMemo(() => company?.city ?? "", [company]);
  const companyIndustry = useMemo(() => company?.industry ?? "", [company]);
  const companyDesc = useMemo(() => company?.description ?? "", [company]);
  const jobs = useMemo(() => company?.jobs ?? [], [company]);

  async function loadCompany() {
    setErr("");
    setLoading(true);
    setCompany(null);

    try {
      // ✅ Swagger: GET /api/Company/{id}
      const res = await api.get(`/api/Company/${id}`);
      setCompany(res.data ?? null);
    } catch (e) {
      setErr(e?.message || "Failed to load company.");
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Skeleton />;

  if (err) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold text-rose-100">
              Could not load company
            </div>
            <div className="mt-1 text-sm text-rose-200/90 whitespace-pre-line">
              {err}
            </div>
          </div>
          <button className="btn-ghost" onClick={loadCompany} type="button">
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>

        <button
          className="mt-4 btn-primary"
          onClick={() => navigate(-1)}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="space-y-6">
      {/* Top actions */}
      <div className="flex items-center justify-between gap-3">
        <button className="btn-ghost" onClick={() => navigate(-1)} type="button">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <Link to="/companies" className="btn-ghost">
          <Building2 className="h-4 w-4" />
          All Companies
        </Link>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur sm:p-10">
        <div className="pointer-events-none absolute -top-40 left-[-160px] h-[420px] w-[420px] rounded-full bg-indigo-500/25 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-44 right-[-150px] h-[460px] w-[460px] rounded-full bg-fuchsia-500/20 blur-[120px]" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
              <Building2 className="h-4 w-4" />
              Company Profile
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl truncate">
              {companyName}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="badge">
                {companyIndustry || "Industry not set"}
              </span>
              <span className="badge inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {companyCity || "City not set"}
              </span>
            </div>

            <p className="mt-4 max-w-2xl text-sm text-slate-300 line-clamp-3">
              {companyDesc || "No description available yet."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/jobs" className="btn-ghost">
              <Briefcase className="h-4 w-4" />
              Browse Jobs
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* About + Info */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-3xl p-6 sm:p-7 lg:col-span-2">
          <div className="text-sm font-extrabold text-white">About</div>
          <div className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">
            {companyDesc || "This company has not added a description yet."}
          </div>
        </div>

        <div className="space-y-4">
          <InfoCard icon={Building2} title="Company" value={companyName} />
          <InfoCard icon={MapPin} title="Location" value={companyCity || "—"} />
          <InfoCard icon={Globe} title="Industry" value={companyIndustry || "—"} />
        </div>
      </section>

      {/* Jobs */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xl font-extrabold text-white">Open Roles</div>
            <div className="mt-1 text-sm text-slate-300">
              Latest jobs posted by this company.
            </div>
          </div>

          <Link to="/jobs" className="btn-ghost">
            View all jobs <span className="ml-1">→</span>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.length === 0 ? (
            <div className="glass col-span-full rounded-3xl p-10 text-center">
              <div className="text-xl font-extrabold text-white">No jobs yet</div>
              <p className="mt-2 text-sm text-slate-300">
                This company hasn’t posted any jobs recently.
              </p>
            </div>
          ) : (
            jobs.slice(0, 6).map((job) => (
              <JobCard
                key={job.id}
                job={{
                  id: job.id,
                  title: job.title,
                  city: job.city,
                  isRemote: job.isRemote,
                  employmentType: job.employmentType,
                  salaryMin: job.salaryMin,
                  salaryMax: job.salaryMax,
                  companyId: company.id,
                  companyName: companyName,
                }}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

