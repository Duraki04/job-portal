import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookmarkCheck,
  Trash2,
  ArrowRight,
  Briefcase,
  MapPin,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { apiFetch } from "../../api/http";

function WishItem({ job, onRemove }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/7">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge inline-flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4" />
              Saved
            </span>

            {job?.city && (
              <span className="badge inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {job.city}
              </span>
            )}

            {job?.isRemote && <span className="badge">Remote</span>}
          </div>

          <div className="mt-3 text-lg font-extrabold tracking-tight text-white truncate">
            {job?.title || "Job"}
          </div>

          <div className="mt-2 text-sm text-slate-300 truncate">
            {job?.companyName || "Company"}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(job.id)}
          className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
          aria-label="Remove from wishlist"
          title="Remove"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="my-5 h-px bg-white/10" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to={`/jobs/${job.id}`} className="btn-primary">
          View job <ArrowRight className="h-4 w-4" />
        </Link>

        <Link to="/jobs" className="btn-ghost">
          Browse more <Briefcase className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="h-5 w-2/3 rounded-xl bg-white/10" />
          <div className="mt-3 h-4 w-1/2 rounded-xl bg-white/10" />
          <div className="mt-2 h-4 w-1/3 rounded-xl bg-white/10" />
        </div>
        <div className="h-10 w-10 rounded-2xl bg-white/10" />
      </div>
      <div className="my-5 h-px bg-white/10" />
      <div className="flex gap-2">
        <div className="h-10 w-full rounded-2xl bg-white/10" />
        <div className="h-10 w-full rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

export default function Wishlist() {
  const { wishlist, toggle, clear } = useWishlist();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [jobs, setJobs] = useState([]); // full job objects

  const ids = useMemo(() => (Array.isArray(wishlist) ? wishlist : []), [wishlist]);

  async function load() {
    setErr("");
    setLoading(true);
    setJobs([]);

    try {
      // ✅ Opsioni 1 (më i thjeshtë dhe i sigurt):
      // marrim të gjitha jobs dhe filtrojmë sipas IDs.
      // Nëse ke shumë jobs, mund ta ndryshojmë më vonë me fetch për çdo ID.
      const res = await apiFetch("/api/Job");
      const list = res?.items ?? res?.data ?? res ?? [];

      const all = Array.isArray(list) ? list : [];
      const setIds = new Set(ids);

      const filtered = all.filter((j) => setIds.has(j.id));

      // ruaj renditjen si në wishlist (IDs order)
      const byId = new Map(filtered.map((j) => [j.id, j]));
      const ordered = ids.map((id) => byId.get(id)).filter(Boolean);

      setJobs(ordered);
    } catch (e) {
      setErr(e.message || "Failed to load wishlist jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // kur ndryshon wishlist, rifresko listën
    if (ids.length === 0) {
      setLoading(false);
      setErr("");
      setJobs([]);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  const savedCount = ids.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Wishlist
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Your saved jobs — apply whenever you’re ready.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="badge">
            Saved: <span className="ml-1 font-semibold text-white">{savedCount}</span>
          </span>

          <button className="btn-ghost" onClick={load} type="button" disabled={loading || savedCount === 0}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button className="btn-ghost" onClick={clear} type="button" disabled={savedCount === 0}>
            <XCircle className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-extrabold text-rose-100">
                Could not load wishlist
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
      {savedCount === 0 ? (
        <div className="glass rounded-[32px] p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_18px_45px_rgba(0,0,0,.35)]">
            <BookmarkCheck className="h-7 w-7 text-white" />
          </div>

          <div className="mt-5 text-2xl font-extrabold text-white">
            No saved jobs yet
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Browse jobs and hit “Save” to keep them here.
          </p>

          <div className="mt-6 flex justify-center">
            <Link to="/jobs" className="btn-primary">
              Browse Jobs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: Math.min(6, savedCount) }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass rounded-[32px] p-10 text-center">
          <div className="text-2xl font-extrabold text-white">
            Saved jobs not found
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Some saved jobs might have been deleted.
          </p>
          <div className="mt-6 flex justify-center">
            <Link to="/jobs" className="btn-primary">
              Browse Jobs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {jobs.map((job) => (
            <WishItem key={job.id} job={job} onRemove={toggle} />
          ))}
        </div>
      )}
    </div>
  );
}
