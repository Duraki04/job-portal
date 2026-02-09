import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="container-max py-10">
        {/* Top */}
        <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_10px_25px_rgba(0,0,0,.25)]">
                <span className="text-sm font-extrabold">JP</span>
              </div>
              <div className="leading-tight">
                <div className="text-sm font-extrabold text-white">JobPortal</div>
                <div className="text-xs text-slate-300">Hire & Get Hired</div>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300">
              A modern job portal platform for <span className="text-white">Candidates</span> and{" "}
              <span className="text-white">Employers</span>. Fast hiring, clean profiles, and smooth applications.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <a
                href="#"
                aria-label="Github"
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Email"
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-sm font-bold text-white">Quick Links</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Link
                to="/"
                className="rounded-xl px-3 py-2 text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className="rounded-xl px-3 py-2 text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                Browse Jobs
              </Link>
              <Link
                to="/companies"
                className="rounded-xl px-3 py-2 text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                Companies
              </Link>
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl px-3 py-2 text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                Register
              </Link>
              <Link
                to="/jobs"
                className="rounded-xl px-3 py-2 text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                Post a Job
              </Link>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">Tip</div>
              <p className="mt-1 text-xs text-slate-300">
                Use filters on Jobs to find exactly what you want: city, remote, salary & type.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="text-sm font-bold text-white">Contact</div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <MapPin className="mt-0.5 h-5 w-5 text-slate-200" />
                <div>
                  <div className="font-semibold text-white">Office</div>
                  <div className="text-slate-300">Skopje, North Macedonia</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Mail className="mt-0.5 h-5 w-5 text-slate-200" />
                <div>
                  <div className="font-semibold text-white">Email</div>
                  <div className="text-slate-300">support@jobportal.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Phone className="mt-0.5 h-5 w-5 text-slate-200" />
                <div>
                  <div className="font-semibold text-white">Phone</div>
                  <div className="text-slate-300">+389 xx xxx xxx</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 flex flex-col gap-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} JobPortal. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Built with React + Tailwind
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              API: .NET 8
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
