import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/http";
import {
  Building2,
  MapPin,
  Globe,
  FileText,
  Save,
  RefreshCw,
  Sparkles,
} from "lucide-react";

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="glass rounded-[32px] p-8">
        <div className="h-7 w-1/2 rounded-xl bg-white/10" />
        <div className="mt-3 h-4 w-2/3 rounded-xl bg-white/10" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="h-12 rounded-2xl bg-white/10" />
          <div className="h-12 rounded-2xl bg-white/10" />
          <div className="h-12 rounded-2xl bg-white/10" />
          <div className="h-12 rounded-2xl bg-white/10" />
          <div className="h-36 rounded-2xl bg-white/10 md:col-span-2" />
        </div>
      </div>
    </div>
  );
}

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");

  const validation = useMemo(() => {
    if (name.trim().length < 2) return "Company name is required.";
    if (city.trim().length < 2) return "City is required.";
    if (industry.trim().length < 2) return "Industry is required.";
    if (description.trim().length < 20)
      return "Description is too short (min 20 chars).";
    return "";
  }, [name, city, industry, description]);

  async function load() {
    setErr("");
    setOk("");
    setLoading(true);

    try {
      // ✅ Swagger: GET /api/Company/me
      const res = await api.get("/api/Company/me");
      const c = res.data;

      setName(c?.name ?? "");
      setCity(c?.city ?? "");
      setIndustry(c?.industry ?? "");
      setDescription(c?.description ?? "");
    } catch (e) {
      setErr(e?.message || "Failed to load company profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    setErr("");
    setOk("");

    if (validation) {
      setErr(validation);
      return;
    }

    setSaving(true);
    try {
      const body = {
        name: name.trim(),
        city: city.trim(),
        industry: industry.trim(),
        description: description.trim(),
      };

      // ✅ Swagger: PUT /api/Company/me
      await api.put("/api/Company/me", body);

      setOk("Company profile updated successfully!");
    } catch (e) {
      setErr(e?.message || "Failed to update company profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur sm:p-10">
        <div className="pointer-events-none absolute -top-40 left-[-160px] h-[420px] w-[420px] rounded-full bg-indigo-500/25 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-44 right-[-150px] h-[460px] w-[460px] rounded-full bg-fuchsia-500/20 blur-[120px]" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
            <Sparkles className="h-4 w-4" />
            Company Profile
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your company page
          </h1>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            A strong company profile increases trust and improves application quality.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button className="btn-primary" onClick={save} disabled={saving} type="button">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button className="btn-ghost" onClick={load} type="button">
              <RefreshCw className="h-4 w-4" />
              Reload
            </button>
          </div>

          {err && (
            <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100 whitespace-pre-line">
              {err}
            </div>
          )}
          {ok && (
            <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              {ok}
            </div>
          )}
        </div>
      </section>

      {/* Form */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-3xl p-6 sm:p-7 lg:col-span-2">
          <div className="text-sm font-extrabold text-white">Company details</div>
          <div className="mt-1 text-xs text-slate-400">This is shown to candidates.</div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="label">Company name</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <Building2 className="h-5 w-5 text-slate-300" />
                <input
                  className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  placeholder="e.g. TechNova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
              <label className="label">Industry</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <Globe className="h-5 w-5 text-slate-300" />
                <input
                  className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  placeholder="e.g. Software / Construction / HR"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="label">Description</label>
              <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <FileText className="h-4 w-4" />
                  Tell candidates what your company does and what you offer.
                </div>
                <textarea
                  className="min-h-[170px] w-full resize-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  placeholder={`Example:
We are a company focused on...
We offer...
Our culture...`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="helper mt-2">Minimum 20 characters.</div>
            </div>
          </div>
        </div>

        {/* Preview card */}
        <div className="glass rounded-3xl p-6 sm:p-7">
          <div className="text-sm font-extrabold text-white">Preview</div>
          <div className="mt-1 text-xs text-slate-400">
            This is how candidates will see it.
          </div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-lg font-extrabold tracking-tight text-white">
              {name.trim() || "Company name"}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="badge">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {city.trim() || "City"}
                </span>
              </span>
              <span className="badge">
                <span className="inline-flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {industry.trim() || "Industry"}
                </span>
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-300 line-clamp-6">
              {description.trim() || "Company description will appear here..."}
            </p>
          </div>

          {validation && (
            <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
              {validation}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

