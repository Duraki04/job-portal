import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../api/http";
import { RefreshCw, FileText, ArrowRight, MapPin, Building2 } from "lucide-react";

const PAGE_SIZE = 10;

function StatusBadge({ status }) {
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
        <div className="h-7 w-24 rounded-full bg-white/10" />
      </div>
      <div className="my-5 h-px bg-white/10" />
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 rounded-xl bg-white/10" />
        <div className="h-9 w-28 rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

function AppCard({ a }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-lg font-extrabold tracking-tight text-white line-clamp-2">
            {a.jobTitle}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {a.companyName}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {a.jobCity} {a.isRemote ? "(Remote)" : ""}
            </span>
          </div>
        </div>

        <StatusBadge status={a.status} />
      </div>

      <div className="my-5 h-px bg-white/10" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-400">
          Applied:{" "}
          <span className="text-slate-200 font-semibold">
            {a.appliedAt ? new Date(a.appliedAt).toLocaleString() : "—"}
          </span>
        </div>

        <Link to={`/jobs/${a.jobId}`} className="btn-primary">
          View job <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function MyApplications() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);

  const totalPages = useMemo(() => {
    const t = Math.ceil((total || 0) / PAGE_SIZE);
    return t <= 0 ? 1 : t;
  }, [total]);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      // backend: GET /api/application/my-applications?page=1&pageSize=10
      const res = await apiFetch(
        `/api/application/my-applications?page=${page}&pageSize=${PAGE_SIZE}`,
        { auth: true }
      );

      // expected: { items, total, page, pageSize }
      const list = res?.items ?? res?.data ?? [];
      const tot = res?.total ?? res?.count ?? list.length;

      setItems(Array.isArray(list) ? list : []);
      setTotal(Number(tot) || 0);
    } catch (e) {
      setErr(e.message || "Failed to load applications.");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Track your submitted applications and current statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge">
            Total: <span className="ml-1 text-white font-semibold">{total}</span>
          </span>
          <span className="badge">
            Page: <span className="ml-1 text-white font-semibold">{page}</span> / {totalPages}
          </span>
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
              <div className="mt-1 text-sm text-rose-200/90">{err}</div>
            </div>
            <button className="btn-ghost" onClick={load} type="button">
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="glass rounded-[32px] p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_18px_45px_rgba(0,0,0,.35)]">
            <FileText className="h-7 w-7 text-white" />
          </div>

          <div className="mt-5 text-2xl font-extrabold text-white">
            No applications yet
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Browse jobs and apply — your submissions will appear here.
          </p>

          <div className="mt-6 flex justify-center">
            <Link to="/jobs" className="btn-primary">
              Browse Jobs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((a) => (
            <AppCard key={a.applicationId} a={a} />
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
