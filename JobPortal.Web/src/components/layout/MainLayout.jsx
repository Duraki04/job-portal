import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="page-bg min-h-screen text-slate-50">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-[-120px] h-[420px] w-[420px] rounded-full bg-indigo-500/25 blur-[80px]" />
        <div className="absolute top-10 right-[-140px] h-[420px] w-[420px] rounded-full bg-fuchsia-500/20 blur-[90px]" />
        <div className="absolute bottom-[-160px] left-1/3 h-[520px] w-[520px] rounded-full bg-sky-500/10 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <Navbar />

      <main className="container-max py-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
