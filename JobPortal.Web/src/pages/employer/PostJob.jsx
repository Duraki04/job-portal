import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../../api/http";
import {
  PlusCircle,
  BriefcaseBusiness,
  MapPin,
  Globe,
  DollarSign,
  FileText,
  Calendar,
  ArrowLeft,
  Save,
  RefreshCw,
} from "lucide-react";

function toNumber(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function PostJob() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [expiresAt, setExpiresAt] = useState(""); // yyyy-mm-dd (optional)
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const validation = useMemo(() => {
    const t = title.trim();
    const c = city.trim();
    const d = description.trim();

    const min = toNumber(salaryMin);
    const max = toNumber(salaryMax);

    if (t.length < 3) return "Title is too short (min 3 chars).";
    if (c.length < 2) return "City is required.";
    if (d.length < 30) return "Description is too short (min 30 chars).";

    if (min !== null && min < 0) return "Salary min cannot be negative.";
    if (max !== null && max < 0) return "Salary max cannot be negative.";
    if (min !== null && max !== null && min > max) return "Salary min cannot be greater than max.";

    // expiresAt optional: if present, must be in future-ish (client-side soft check)
    if (expiresAt) {
      const dt = new Date(expiresAt + "T00:00:00");
      if (Number.isNaN(dt.getTime())) return "Invalid expiry date.";
    }

    return "";
  }, [title, city, description, salaryMin, salaryMax, expiresAt]);

  const canSubmit = useMemo(() => !validation && !loading, [validation, loading]);

  function resetForm() {
    setTitle("");
    setCity("");
    setIsRemote(false);
    setEmploymentType("Full-Time");
    setSalaryMin("");
    setSalaryMax("");
    setExpiresAt("");
    setDescription("");
    setErr("");
    setOk("");
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    if (validation) {
      setErr(validation);
      return;
    }

    setLoading(true);
    try {
      const body = {
        title: title.trim(),
        city: city.trim(),
        isRemote,
        employmentType,
        salaryMin: toNumber(salaryMin) ?? 0,
        salaryMax: toNumber(salaryMax) ?? 0,
        description: description.trim(),
        // backend entity e ka nullable DateTime? ExpiresAt
        expiresAt: expiresAt ? new Date(expiresAt + "T00:00:00").toISOString() : null,
      };

      // ✅ CHANGE HERE if your endpoint is different:
      // /api/job  OR /api/jobs
      const created = await apiFetch("/api/job", { method: "POST", auth: true, body });

      setOk("Job created successfully!");
      const newId = created?.id;

      // Redirect: MyJobs or JobDetails
      if (newId) navigate(`/jobs/${newId}`, { replace: true });
      else navigate("/employer/jobs", { replace: true });
    } catch (ex) {
      setErr(ex.message || "Failed to create job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top actions */}
      <div className="flex items-center justify-between gap-3">
        <button className="btn-ghost" onClick={() => navigate(-1)} type="button">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <Link to="/employer/jobs" className="btn-ghost">
          <BriefcaseBusiness className="h-4 w-4" />
          My Jobs
        </Link>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur sm:p-10">
        <div className="pointer-events-none absolute -top-40 left-[-160px] h-[420px] w-[420px] rounded-full bg-indigo-500/25 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-44 right-[-150px] h-[460px] w-[460px] rounded-full bg-fuchsia-500/20 blur-[120px]" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
            <PlusCircle className="h-4 w-4" />
            Create Job
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Post a new job
          </h1>

          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            Write a clean job description and include salary range if possible — it increases
            the number of quality applications.
          </p>
        </div>
      </section>

      {/* Errors / Success */}
      {err && (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-100">
          {err}
        </div>
      )}
      {ok && (
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-100">
          {ok}
        </div>
      )}

      {/* Form */}
      <form onSubmit={submit} className="grid gap-4 lg:grid-cols-3">
        {/* Left (main) */}
        <div className="glass rounded-3xl p-6 sm:p-7 lg:col-span-2">
          <div className="text-sm font-extrabold text-white">Job details</div>
          <div className="mt-1 text-xs text-slate-400">
            Fields with good detail produce better candidates.
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="label">Title</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <BriefcaseBusiness className="h-5 w-5 text-slate-300" />
                <input
                  className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  placeholder="e.g. Frontend Developer (React)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label">City</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <MapPin className="h-5 w-5 text-slate-300" />
                <input
                  className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  placeholder="e.g. Skopje"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label">Employment type</label>
              <select
                className="input mt-2"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
              >
                <option>Full-Time</option>
                <option>Part-Time</option>
              </select>

              <label className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-200">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/10"
                  checked={isRemote}
                  onChange={(e) => setIsRemote(e.target.checked)}
                />
                <Globe className="h-4 w-4" />
                Remote available
              </label>
            </div>

            <div>
              <label className="label">Salary min</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <DollarSign className="h-5 w-5 text-slate-300" />
                <input
                  className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  placeholder="e.g. 800"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value.replace(/[^\d]/g, ""))}
                />
              </div>
            </div>

            <div>
              <label className="label">Salary max</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <DollarSign className="h-5 w-5 text-slate-300" />
                <input
                  className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  placeholder="e.g. 1500"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value.replace(/[^\d]/g, ""))}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="label">Description</label>
              <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <FileText className="h-4 w-4" />
                  Write responsibilities, requirements, and benefits.
                </div>
                <textarea
                  className="min-h-[180px] w-full resize-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  placeholder="Example:
- Responsibilities: ...
- Requirements: ...
- Nice to have: ...
- Benefits: ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="helper mt-2">
                Minimum 30 characters. Better text = better candidates.
              </div>
            </div>
          </div>
        </div>

        {/* Right (side) */}
        <div className="space-y-4">
          <div className="glass rounded-3xl p-6">
            <div className="text-sm font-extrabold text-white">Optional</div>
            <div className="mt-1 text-xs text-slate-400">
              You can set an expiry date for the listing.
            </div>

            <label className="label mt-4">Expires at</label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <Calendar className="h-5 w-5 text-slate-300" />
              <input
                type="date"
                className="w-full bg-transparent text-sm text-slate-100 outline-none"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold text-slate-200">Preview</div>
              <div className="mt-2 text-sm font-extrabold text-white">
                {title.trim() || "Job title"}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="badge">{employmentType}</span>
                <span className="badge">{city.trim() || "City"}</span>
                {isRemote && <span className="badge">Remote</span>}
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="text-sm font-extrabold text-white">Actions</div>
            <div className="mt-4 flex flex-col gap-3">
              <button className="btn-primary" disabled={!canSubmit} type="submit">
                <Save className="h-4 w-4" />
                {loading ? "Posting..." : "Publish Job"}
              </button>

              <button className="btn-ghost" type="button" onClick={resetForm} disabled={loading}>
                <RefreshCw className="h-4 w-4" />
                Reset form
              </button>
            </div>

            {validation && (
              <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
                {validation}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
