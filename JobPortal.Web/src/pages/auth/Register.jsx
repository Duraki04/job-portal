import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/http";
import {
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  Building2,
  Users,
  Crown,
  ArrowRight,
} from "lucide-react";

const roles = [
  { value: "Candidate", label: "Candidate", icon: Users, hint: "Apply to jobs, wishlist, profile & applications." },
  { value: "Employer", label: "Employer", icon: Building2, hint: "Post jobs, manage jobs & applications." },
  { value: "Admin", label: "Admin", icon: Crown, hint: "Manage platform data (admin area)." },
];

function RolePill({ active, onClick, role }) {
  const Icon = role.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl border px-4 py-3 text-left transition",
        active
          ? "border-white/20 bg-white/10"
          : "border-white/10 bg-white/5 hover:bg-white/7",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-white">{role.label}</div>
          <div className="mt-1 text-xs text-slate-300">{role.hint}</div>
        </div>
      </div>
    </button>
  );
}

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [role, setRole] = useState("Candidate");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const canSubmit = useMemo(() => {
    const fn = fullName.trim();
    const em = email.trim();
    const p = password.trim();
    const c = confirm.trim();
    return fn.length >= 3 && em.includes("@") && p.length >= 6 && p === c;
  }, [fullName, email, password, confirm]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    const fn = fullName.trim();
    const em = email.trim().toLowerCase();

    if (fn.length < 3) {
      setErr("Full name must be at least 3 characters.");
      return;
    }
    if (!em.includes("@")) {
      setErr("Please enter a valid email.");
      return;
    }
    if (password.trim().length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // backend expects: RegisterDto { fullName, email, password, role }
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: { fullName: fn, email: em, password, role },
      });

      setOk("Account created successfully! Redirecting to login...");
      // simple redirect (no async wait)
      navigate("/login", { replace: true });
    } catch (ex) {
      setErr(ex.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid place-items-center py-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_18px_45px_rgba(0,0,0,.35)]">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Choose a role and start using the platform like a real product.
          </p>
        </div>

        {/* Card */}
        <div className="mt-6 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          {err && (
            <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
              {err}
            </div>
          )}
          {ok && (
            <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              {ok}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <div className="flex items-center justify-between">
                <label className="label">Choose your role</label>
                <span className="badge">Selected: {role}</span>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {roles.map((r) => (
                  <RolePill
                    key={r.value}
                    role={r}
                    active={role === r.value}
                    onClick={() => setRole(r.value)}
                  />
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Full name</label>
                <input
                  className="input mt-2"
                  placeholder="Kushtrim Duraki"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  className="input mt-2"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Password</label>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                  <input
                    className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                    placeholder="••••••••"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 hover:bg-white/10"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="helper mt-2">Min 6 characters.</div>
              </div>

              <div>
                <label className="label">Confirm password</label>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                  <input
                    className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                    placeholder="••••••••"
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 hover:bg-white/10"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="helper mt-2">
                  {confirm && password !== confirm ? "Passwords do not match." : " "}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={!canSubmit || loading}
            >
              <UserPlus className="h-4 w-4" />
              {loading ? "Creating account..." : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="text-slate-300">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-white hover:underline">
                Login
              </Link>
            </span>

            <Link to="/jobs" className="text-slate-300 hover:text-white hover:underline">
              Browse jobs →
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-semibold text-slate-200">Note</div>
            <div className="mt-1 text-xs text-slate-400">
              Admin registration should usually be limited in production. For the project, it’s fine.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
