import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { apiFetch } from "../../api/http";

function RowSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-6 w-2/3 rounded-xl bg-white/10" />
          <div className="mt-2 h-4 w-1/3 rounded-xl bg-white/10" />
          <div className="mt-2 h-4 w-1/2 rounded-xl bg-white/10" />
        </div>
        <div className="h-10 w-24 rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
      {children}
    </span>
  );
}

export default function MyJobs() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [meCompany, setMeCompany] = useState(null); // /api/Company/me
  const [allJobs, setAllJobs] = useState([]);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest"); // newest | oldest | name

  async function load() {
    setErr("");
    setLoading(true);

    try {
      // 1) Merr kompaninë time (Employer)
      const company = await apiFetch("/api/Company/me", { auth: true });
      setMeCompany(company);

      // 2) Merr të gjitha jobs (public endpoint)
      const jobs = await apiFetch("/api/Job", { auth: false });
      const list = jobs?.items ?? jobs?.data ?? jobs ?? [];
      setAllJobs(Array.isArray(list) ? list : []);
    } catch (e) {
      setErr(e.message || "Failed to load jobs.");
      setMeCompany(null);
      setAllJobs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myJobs = useMemo(() => {
    const myCompanyId = meCompany?.id;

    let list = Array.isArray(allJobs) ? [...allJobs] : [];

    // ✅ filtro vetëm job-et e kompanisë time
    if (myCompanyId) {
      list = list.filter((j) => j.companyId === myCompanyId);
    }

    // search
    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter((j) => {
        const title = (j?.title || "").toLowerCase();
        const city = (j?.city || "").toLowerCase();
        const desc = (j?.description || "").toLowerCase();
        return title.includes(query) || city.includes(query) || desc.includes(query);
      });
    }

    // sort
    if (sort === "name") {
      list.sort((a, b) => String(a?.title || "").localeCompare(String(b?.title || "")));
    } else if (sort === "oldest") {
      list.sort((a, b) => new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0));
    } else {
      // newest default
      list.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
    }

    return list;
  }, [allJobs, meCompany, q, sort]);

  async function deleteJob(jobId) {
    const ok = confirm("A je i sigurt që do ta fshish këtë job?");
    if (!ok) return;

    try {
      await apiFetch(`/api/Job/${jobId}`, { method: "DELETE", auth: true });
      // refresh list
      await load();
    } catch (e) {
      alert(e.message || "Failed to delete job.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            My Jobs
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Manage your job postings and track applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            Company: <span className="ml-1 text-white">{meCompany?.name || "—"}</span>
          </Badge>
          <Badge>
            Total: <span className="ml-1 text-white">{myJobs.length}</span>
          </Badge>

          <Link to="/employer/post-job" className="btn-primary">
            <Plus className="h-4 w-4" />
            Post a Job
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="glass rounded-3xl p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="label">Search</label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <Search className="h-5 w-5 text-slate-300" />
              <input
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                placeholder="Search by title, city, description..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Sort</label>
            <select
              className="input mt-2"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Title (A–Z)</option>
            </select>
          </div>
        </div>
        <div className="helper mt-2">
          Showing only jobs that belong to your company.
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-extrabold text-rose-100">
                Could not load jobs
              </div>
              <div className="mt-1 text-sm text-rose-200/90">{err}</div>
            </div>
            <button className="btn-ghost" onClick={load} type="button">
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
        ) : myJobs.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <div className="text-xl font-extrabold text-white">
              No jobs posted yet
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Create your first job posting to start receiving applications.
            </p>
            <Link to="/employer/post-job" className="btn-primary mt-5 inline-flex">
              <Plus className="h-4 w-4" />
              Post a Job
            </Link>
          </div>
        ) : (
          myJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg font-extrabold text-white truncate">
                        {job.title}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="badge inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {job.city || "—"}
                        </span>
                        <span className="badge">
                          {job.isRemote ? "Remote" : "On-site"}
                        </span>
                        <span className="badge">{job.employmentType || "Full-Time"}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-300 line-clamp-2">
                    {job.description || "No description."}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge>
                      Salary:{" "}
                      <span className="ml-1 text-white">
                        {job.salaryMin} – {job.salaryMax}
                      </span>
                    </Badge>

                    {job.expiresAt && (
                      <Badge>
                        Expires:{" "}
                        <span className="ml-1 text-white">
                          {new Date(job.expiresAt).toLocaleDateString()}
                        </span>
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="btn-ghost"
                    title="View public listing"
                  >
                    View <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to={`/employer/applications?jobId=${job.id}`}
                    className="btn-ghost"
                    title="View applications"
                  >
                    Applications
                  </Link>

                  <button
                    className="btn-ghost"
                    onClick={() => deleteJob(job.id)}
                    type="button"
                    title="Delete job"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
