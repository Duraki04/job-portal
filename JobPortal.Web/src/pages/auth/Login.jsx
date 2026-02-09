import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/http";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canSubmit = useMemo(() => {
    const e = email.trim();
    return e.includes("@") && password.trim().length >= 6;
  }, [email, password]);

  function goDashboard(role) {
    if (role === "Candidate") navigate("/candidate", { replace: true });
    else if (role === "Employer") navigate("/employer", { replace: true });
    else if (role === "Admin") navigate("/admin", { replace: true });
    else navigate("/", { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    const eMail = email.trim().toLowerCase();
    const pass = password;

    if (!eMail.includes("@")) {
      setErr("Please enter a valid email.");
      return;
    }
    if (pass.trim().length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // Expected response: { token, role, fullName, userId? }
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email: eMail, password: pass },
      });

      // If backend doesn't return userId, we still store role/fullName.
      const payload = {
        token: res.token,
        role: res.role,
        fullName: res.fullName,
        userId: res.userId ?? 0,
      };

      login(payload);
      goDashboard(payload.role);
    } catch (ex) {
      setErr(ex.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid place-items-center py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_18px_45px_rgba(0,0,0,.35)]">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Login to manage your jobs, applications and profile.
          </p>
        </div>

        {/* Card */}
        <div className="mt-6 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-7">
          {err && (
            <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <label className="label">Password</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <input
                  className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  placeholder="••••••••"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 hover:bg-white/10"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="helper mt-2">
                Minimum 6 characters.
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={!canSubmit || loading}
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="text-slate-300">
              No account?{" "}
              <Link to="/register" className="font-semibold text-white hover:underline">
                Register
              </Link>
            </span>

            <Link to="/jobs" className="text-slate-300 hover:text-white hover:underline">
              Browse jobs →
            </Link>
          </div>

          {/* Demo hint */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-semibold text-slate-200">Note</div>
            <div className="mt-1 text-xs text-slate-400">
              If you get 401, make sure the API base URL is correct in <span className="text-slate-200 font-semibold">.env</span> and CORS is enabled on backend.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
