import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../api/http";
import {
  User,
  MapPin,
  BadgeCheck,
  FileText,
  RefreshCw,
  Save,
  Plus,
  X,
  Search,
} from "lucide-react";

function Pill({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full border border-white/10 bg-white/5 p-1 hover:bg-white/10"
        aria-label="Remove"
        title="Remove"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

export default function CandidateProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // profile fields
  const [city, setCity] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [cvUrl, setCvUrl] = useState("");

  // skills
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [skillQuery, setSkillQuery] = useState("");

  const selectedSkills = useMemo(() => {
    const setIds = new Set(selectedSkillIds);
    return allSkills.filter((s) => setIds.has(s.id));
  }, [allSkills, selectedSkillIds]);

  const filteredSkills = useMemo(() => {
    const q = skillQuery.trim().toLowerCase();
    if (!q) return allSkills.slice(0, 12);
    return allSkills
      .filter((s) => (s.name || "").toLowerCase().includes(q))
      .slice(0, 12);
  }, [allSkills, skillQuery]);

  async function load() {
    setErr("");
    setOk("");
    setLoading(true);

    try {
      // profile
      const p = await apiFetch("/api/Candidate/me", { auth: true });

      setCity(p?.city ?? "");
      setExperienceLevel(p?.experienceLevel ?? "");
      setCvUrl(p?.cvUrl ?? p?.cvURL ?? "");

      // skills list
      const skillsRes = await apiFetch("/api/Skill", { auth: true });
      const list = skillsRes?.items ?? skillsRes?.data ?? skillsRes ?? [];
      setAllSkills(Array.isArray(list) ? list : []);

      // ✅ selected skills (from endpoint that actually exists now)
      const mySkills = await apiFetch("/api/Candidate/me/skills", { auth: true });
      const mySkillIds = Array.isArray(mySkills) ? mySkills.map((x) => x.id) : [];
      setSelectedSkillIds(mySkillIds);
    } catch (e) {
      setErr(e.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addSkill(id) {
    setSelectedSkillIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }

  function removeSkill(id) {
    setSelectedSkillIds((prev) => prev.filter((x) => x !== id));
  }

  async function saveProfile() {
    setErr("");
    setOk("");

    const payload = {
      city: city.trim(),
      experienceLevel: experienceLevel.trim(),
      cvUrl: cvUrl.trim() ? cvUrl.trim() : null,
    };

    setSaving(true);
    try {
      // update profile
      await apiFetch("/api/Candidate/me", {
        method: "PUT",
        auth: true,
        body: payload,
      });

      // update skills
      await apiFetch("/api/Candidate/me/skills", {
        method: "PUT",
        auth: true,
        body: { skillIds: selectedSkillIds },
      });

      setOk("Profile updated successfully!");
    } catch (e) {
      setErr(e.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-[32px] p-8">
          <div className="h-7 w-1/2 rounded-xl bg-white/10" />
          <div className="mt-3 h-4 w-2/3 rounded-xl bg-white/10" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="h-12 rounded-2xl bg-white/10" />
            <div className="h-12 rounded-2xl bg-white/10" />
            <div className="h-12 rounded-2xl bg-white/10 md:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur sm:p-10">
        <div className="pointer-events-none absolute -top-40 left-[-160px] h-[420px] w-[420px] rounded-full bg-indigo-500/25 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-44 right-[-150px] h-[460px] w-[460px] rounded-full bg-fuchsia-500/20 blur-[120px]" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
            <User className="h-4 w-4" />
            Candidate Profile
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your profile
          </h1>

          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            Keep your profile clean and complete — it helps employers evaluate your application faster.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button className="btn-primary" onClick={saveProfile} disabled={saving} type="button">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button className="btn-ghost" onClick={load} type="button">
              <RefreshCw className="h-4 w-4" />
              Reload
            </button>
          </div>

          {err && (
            <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
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
          <div className="text-sm font-extrabold text-white">Profile details</div>
          <div className="mt-1 text-xs text-slate-400">Basic info used in job applications.</div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
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
              <label className="label">Experience level</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <BadgeCheck className="h-5 w-5 text-slate-300" />
                <input
                  className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  placeholder="e.g. Junior / Mid / Senior"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                />
              </div>
              <div className="helper mt-2">Example: Junior, Mid, Senior, Intern.</div>
            </div>

            <div className="md:col-span-2">
              <label className="label">CV URL</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <FileText className="h-5 w-5 text-slate-300" />
                <input
                  className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  placeholder="https://drive.google.com/... or https://..."
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                />
              </div>
              <div className="helper mt-2">
                You can also enter a GitHub/portfolio link if you don’t have a CV yet.
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="glass rounded-3xl p-6 sm:p-7">
          <div className="text-sm font-extrabold text-white">Skills</div>
          <div className="mt-1 text-xs text-slate-400">
            Add your skills to improve your profile.
          </div>

          {/* Selected */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedSkills.length === 0 ? (
              <span className="text-sm text-slate-300">No skills selected yet.</span>
            ) : (
              selectedSkills.map((s) => (
                <Pill key={s.id} onRemove={() => removeSkill(s.id)}>
                  {s.name}
                </Pill>
              ))
            )}
          </div>

          {/* Search */}
          <div className="mt-5">
            <label className="label">Find & add skill</label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <Search className="h-5 w-5 text-slate-300" />
              <input
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                placeholder="Search skills..."
                value={skillQuery}
                onChange={(e) => setSkillQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Suggestions */}
          <div className="mt-4 space-y-2">
            {filteredSkills.length === 0 ? (
              <div className="text-sm text-slate-300">No matches.</div>
            ) : (
              filteredSkills.map((s) => {
                const already = selectedSkillIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={already}
                    onClick={() => addSkill(s.id)}
                    className={[
                      "w-full rounded-2xl border px-3 py-2 text-left text-sm transition",
                      already
                        ? "border-white/10 bg-white/5 text-slate-400 cursor-not-allowed"
                        : "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{s.name}</span>
                      <span className="inline-flex items-center gap-2 text-xs text-slate-300">
                        <Plus className="h-4 w-4" />
                        Add
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <button
            className="btn-primary mt-5 w-full"
            type="button"
            onClick={saveProfile}
            disabled={saving}
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </section>
    </div>
  );
}
