import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin, Search, RefreshCw } from "lucide-react";
import { api } from "../../api/http"; // ✅ axios instance

const PAGE_SIZE = 9;

function CompanySkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="h-5 w-2/3 rounded-xl bg-white/10" />
          <div className="mt-2 h-4 w-1/2 rounded-xl bg-white/10" />
        </div>
        <div className="h-12 w-12 rounded-2xl bg-white/10" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded-xl bg-white/10" />
        <div className="h-4 w-11/12 rounded-xl bg-white/10" />
        <div className="h-4 w-9/12 rounded-xl bg-white/10" />
      </div>
      <div className="mt-5 h-10 w-full rounded-2xl bg-white/10" />
    </div>
  );
}

function CompanyCard({ c }) {
  const name = c.name || "Company";
  const city = c.city || "—";
  const industry = c.industry || "Industry not set";
  const desc = c.description || "No description yet.";

  return (
    <Link
      to={`/companies/${c.id}`}
      className="group block rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/7 hover:border-white/15"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-extrabold tracking-tight text-white truncate">
            {name}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="badge">{industry}</span>
            <span className="badge inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {city}
            </span>
          </div>
        </div>

        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <Building2 className="h-6 w-6 text-white" />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-300 line-clamp-3">{desc}</p>

      <div className="mt-5">
        <span className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(0,0,0,.25)] transition group-hover:opacity-95">
          View Company
        </span>
      </div>
    </Link>
  );
}

export default function Companies() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [all, setAll] = useState([]);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const res = await api.get("/api/Company");
      setAll(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr(e?.message || "Failed to load companies.");
      setAll([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = Array.isArray(all) ? [...all] : [];

    if (q) {
      list = list.filter((c) => {
        const name = (c?.name || "").toLowerCase();
        const city = (c?.city || "").toLowerCase();
        const industry = (c?.industry || "").toLowerCase();
        const desc = (c?.description || "").toLowerCase();
        return (
          name.includes(q) ||
          city.includes(q) ||
          industry.includes(q) ||
          desc.includes(q)
        );
      });
    }

    list.sort((a, b) =>
      String(a?.name || "").localeCompare(String(b?.name || ""))
    );

    return list;
  }, [all, search]);

  const total = filtered.length;

  const totalPages = useMemo(() => {
    const t = Math.ceil(total / PAGE_SIZE);
    return t <= 0 ? 1 : t;
  }, [total]);

  const items = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Companies
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Explore employers and learn about their work and culture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge">
            Total:{" "}
            <span className="ml-1 text-white font-semibold">{total}</span>
          </span>
          <span className="badge">
            Page:{" "}
            <span className="ml-1 text-white font-semibold">{page}</span> /{" "}
            {totalPages}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="glass rounded-3xl p-5 sm:p-6">
        <label className="label">Search companies</label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <Search className="h-5 w-5 text-slate-300" />
          <input
            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
            placeholder="e.g. Microsoft, Local Startup..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="helper mt-2">Search is instant (client-side).</div>
      </div>

      {/* Error */}
      {err && (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-extrabold text-rose-100">
                Could not load companies
              </div>
              <div className="mt-1 text-sm text-rose-200/90 whitespace-pre-line">
                {err}
              </div>
            </div>
            <button className="btn-ghost" onClick={load} type="button">
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <CompanySkeleton key={i} />
          ))
        ) : items.length === 0 ? (
          <div className="glass col-span-full rounded-3xl p-10 text-center">
            <div className="text-xl font-extrabold text-white">
              No companies found
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Try a different search keyword.
            </p>
          </div>
        ) : (
          items.map((c) => <CompanyCard key={c.id} c={c} />)
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-sm text-slate-300">
            Showing page{" "}
            <span className="font-semibold text-white">{page}</span> of{" "}
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
