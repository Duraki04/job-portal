import { Link } from "react-router-dom";
import { BookmarkCheck, Trash2, ArrowRight, Briefcase, MapPin } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";

function WishItem({ item, onRemove }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/7">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge">Saved</span>
            {item?.city && (
              <span className="badge inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {item.city}
              </span>
            )}
          </div>

          <div className="mt-3 text-lg font-extrabold tracking-tight text-white truncate">
            {item.title || "Job"}
          </div>

          <div className="mt-2 text-sm text-slate-300 truncate">
            {item.companyName || "Company"}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.jobId)}
          className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
          aria-label="Remove from wishlist"
          title="Remove"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="my-5 h-px bg-white/10" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to={`/jobs/${item.jobId}`} className="btn-primary">
          View job <ArrowRight className="h-4 w-4" />
        </Link>

        <Link to="/jobs" className="btn-ghost">
          Browse more <Briefcase className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function Wishlist() {
  const { items, remove } = useWishlist();

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

        <span className="badge">
          Saved: <span className="ml-1 font-semibold text-white">{items.length}</span>
        </span>
      </div>

      {/* Content */}
      {items.length === 0 ? (
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
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((it) => (
            <WishItem key={it.jobId} item={it} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
