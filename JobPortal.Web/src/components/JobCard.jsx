import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Bookmark, BookmarkCheck, Building2, MapPin, Briefcase } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

function safeText(v, fallback = "—") {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
}

function formatSalary(min, max) {
  const a = Number(min);
  const b = Number(max);
  if (!Number.isFinite(a) && !Number.isFinite(b)) return "Salary not specified";
  if (Number.isFinite(a) && Number.isFinite(b)) return `${a.toLocaleString()} - ${b.toLocaleString()} €`;
  if (Number.isFinite(a)) return `From ${a.toLocaleString()} €`;
  return `Up to ${b.toLocaleString()} €`;
}

export default function JobCard({ job }) {
  const j = job || {};

  // ✅ normalize id to number
  const id = Number(j.id) || 0;

  const title = safeText(j.title, "Job Title");
  const city = safeText(j.city, "—");
  const companyName = safeText(j.companyName, "Company");
  const companyId = j.companyId;

  const isRemote = !!j.isRemote;
  const employmentType = safeText(j.employmentType, "—");

  const salaryText = useMemo(
    () => formatSalary(j.salaryMin, j.salaryMax),
    [j.salaryMin, j.salaryMax]
  );

  // ✅ Wishlist (now: wishlist is array of jobIds)
  const { wishlist, toggle } = useWishlist();

  const inWishlist = useMemo(() => {
    if (!id) return false;
    return Array.isArray(wishlist) && wishlist.includes(id);
  }, [wishlist, id]);

  const jobLink = id ? `/jobs/${id}` : "/jobs";
  const companyLink = companyId ? `/companies/${companyId}` : "/companies";

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/15 hover:bg-white/7">
      {/* Glow */}
      <div className="pointer-events-none absolute -top-28 right-[-120px] h-[260px] w-[260px] rounded-full bg-indigo-500/20 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-28 left-[-120px] h-[260px] w-[260px] rounded-full bg-fuchsia-500/15 blur-[90px]" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={jobLink}
            className="block text-lg font-extrabold tracking-tight text-white truncate hover:underline"
            title={title}
          >
            {title}
          </Link>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="badge inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {city}
            </span>

            <span className="badge inline-flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {employmentType}
            </span>

            {isRemote && <span className="badge">Remote</span>}
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggle(id)}
          className="btn-ghost !px-3"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          title={inWishlist ? "Saved" : "Save"}
          disabled={!id}
        >
          {inWishlist ? (
            <>
              <BookmarkCheck className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" />
              Save
            </>
          )}
        </button>
      </div>

      <div className="relative mt-5 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs font-semibold text-slate-200">Salary</div>
          <div className="mt-1 text-sm font-extrabold text-white">{salaryText}</div>
        </div>

        <Link
          to={companyLink}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/7"
        >
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-200">Company</div>
            <div className="mt-1 truncate text-sm font-extrabold text-white">
              {companyName}
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
            <Building2 className="h-5 w-5 text-white" />
          </div>
        </Link>

        <div className="flex gap-2">
          <Link to={jobLink} className="btn-primary w-full justify-center">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
