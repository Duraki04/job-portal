import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../api/http";
import {
  ClipboardList,
  RefreshCw,
  ArrowRight,
  MapPin,
  FileText,
  BriefcaseBusiness,
} from "lucide-react";

const PAGE_SIZE = 10;
const STATUS = ["Pending", "Shortlisted", "Accepted", "Rejected"];

function StatusPill({ status }) {
  const s = (status || "").toLowerCase();
  let cls = "badge";
  if (s === "pending") cls = "badge border-amber-500/30 bg-amber-500/10 text-amber-100";
  if (s === "shortlisted") cls = "badge border-sky-500/30 bg-sky-500/10 text-sky-100";
  if (s === "accepted") cls = "badge border-emerald-500/30 bg-emerald-500/10 text-emerald-100";
  if (s === "rejected") cls = "badge border-rose-500/30 bg-rose-500/10 text-rose-100";
  return <span className={cls}>{status || "Unknown"}</span>;
}

function SkeletonRow() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="h-5 w-2/3 rounded-xl bg-white/10" />
          <div className="mt-3 h-4 w-1/2 rounded-xl bg-white/10" />
          <div className="mt-2 h-4 w-2/3 rounded-xl bg-white/10" />
        </div>
        <div className="h-10 w-40 rounded-2xl bg-white/10" />
      </div>
      <div className="my-5 h-px bg-white/10" />
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded-xl bg-white/10" />
        <div className="h-9 w-28 rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

export default function EmployerApplications() {
  const [params, setParams] = useSearchParams();

  const jobIdParam = params.get("jobId") || "1";
  const jobId = Number(jobIdParam) || 1;

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [updatingId, setUpdatingId] = useState(0);

  const totalPages = useMemo(() => {
    const t = Math.ceil((total || 0) / PAGE_SIZE);
    return t <= 0 ? 1 : t;
  }, [total]);

  useEffect(() => {
    setPage(1);
  }, [jobId]);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      // ✅ Swagger: GET /api/Application/job/{jobId}?page=1&pageSize=10
      const res = await api.get(
        `/api/Application/job/${jobId}?page=${page}&pageSize=${PAGE_SIZE}`
      );

      const data = res.data;

      // Backend mund të kthejë:
      // 1) { items: [...], total: 123 }
      // 2) { data: [...], total: 123 }
      // 3) vetëm array [...]
      const list = data?.items ?? data?.data ?? data ?? [];
      const tot = data?.total ?? data?.count ?? (Array.isArray(list) ? list.length : 0);

      setItems(Array.isArray(list) ? list : []);
      setTotal(Number(tot) || 0);
    } catch (e) {
      setErr(e?.message || "Failed to load applications for this job.");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, page]);

  async function updateStatus(applicationId, status) {
    setUpdatingId(applicationId);
    try {
      // ✅ Swagger: PATCH /api/Application/{applicationId}/status
      await api.patch(`/api/Application/${applicationId}/status`, { status });
      await load();
    } catch (e) {
      alert(e?.message || "Failed to update status.");
    } finally {
      setUpdatingId(0);
    }
  }

  function handleJobIdChange(v) {
    const next = v.replace(/[^\d]/g, "") || "1";
    setParams({ jobId: next });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Applications
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Review candidates for a specific job post and update their statuses.
          </p>
        </div>

        <span className="badge">
          Total: <span className="ml-1 font-semibold text-white">{total}</span>
        </span>
      </div>

      {/* Job picker */}
      <div className="glass rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <label className="label">Job ID</label>
            <input
              className="input mt-2"
              value={String(jobId)}
              onChange={(e) => handleJobIdChange(e.target.value)}
              placeholder="Enter jobId..."
            />
            <div className="helper mt-2">
              Tip: From <span className="text-slate-200 font-semibold">My Jobs</span> click “Applications”
              and it will open with the correct jobId.
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-ghost" onClick={load} type="button">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <Link to="/employer/jobs" className="btn-primary">
              <BriefcaseBusiness className="h-4 w-4" />
              My Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-extrabold text-rose-100">
                Could not load applications
              </div>
              <div className="mt-1 text-sm text-rose-200/90 whitespace-pre-line">{err}</div>
            </div>
            <button className="btn-ghost" onClick={load} type="button">
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="glass rounded-[32px] p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_18px_45px_rgba(0,0,0,.35)]">
            <ClipboardList className="h-7 w-7 text-white" />
          </div>

          <div className="mt-5 text-2xl font-extrabold text-white">
            No applications found
          </div>
          <p className="mt-2 text-sm text-slate-300">
            This job hasn’t received applications yet (or jobId is wrong).
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((a) => (
            <div
              key={a.applicationId}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/7"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-lg font-extrabold tracking-tight text-white truncate">
                    {a.candidateFullName || "Candidate"}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="badge inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {a.candidateCity || "—"}
                    </span>
                    <span className="badge">{a.experienceLevel || "—"}</span>
                    <StatusPill status={a.status} />
                  </div>
                </div>

                <div className="min-w-[170px]">
                  <select
                    className="input"
                    value={a.status}
                    disabled={updatingId === a.applicationId}
                    onChange={(e) => updateStatus(a.applicationId, e.target.value)}
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <div className="helper mt-2">
                    {updatingId === a.applicationId ? "Updating..." : "Change status"}
                  </div>
                </div>
              </div>

              <div className="my-5 h-px bg-white/10" />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-slate-400">
                  Applied:{" "}
                  <span className="text-slate-200 font-semibold">
                    {a.appliedAt ? new Date(a.appliedAt).toLocaleString() : "—"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {a.cvUrl ? (
                    <a
                      href={a.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost"
                      title="Open CV"
                    >
                      <FileText className="h-4 w-4" />
                      CV
                    </a>
                  ) : (
                    <span className="badge">No CV</span>
                  )}

                  <Link to={`/jobs/${jobId}`} className="btn-primary">
                    View Job <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-sm text-slate-300">
            Showing page <span className="font-semibold text-white">{page}</span> of{" "}
            <span className="font-semibold text-white">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="btn-ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              type="button"
            >
              Prev
            </button>
            <button
              className="btn-ghost"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
