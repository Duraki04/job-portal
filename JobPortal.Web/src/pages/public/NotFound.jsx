import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Search, TriangleAlert } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="grid place-items-center py-12">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-7 text-center backdrop-blur sm:p-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-rose-500 to-fuchsia-500 shadow-[0_18px_45px_rgba(0,0,0,.35)]">
          <TriangleAlert className="h-7 w-7 text-white" />
        </div>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Page not found
        </h1>

        <p className="mt-3 text-sm text-slate-300">
          The page you’re looking for doesn’t exist or has been moved.
          Use the buttons below to continue browsing.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link to="/jobs" className="btn-ghost">
            <Search className="h-4 w-4" />
            Browse Jobs
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-ghost"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
          <div className="text-xs font-semibold text-slate-200">Tip</div>
          <div className="mt-1 text-xs text-slate-400">
            If you arrived here from a link, check if the route exists in <span className="text-slate-200 font-semibold">AppRoutes.jsx</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
