import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

import Home from "../pages/public/Home";
import Jobs from "../pages/public/Jobs";
import JobDetails from "../pages/public/JobDetails";
import Companies from "../pages/public/Companies";
import CompanyDetails from "../pages/public/CompanyDetails";
import NotFound from "../pages/public/NotFound";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";

// Candidate pages (create later)
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import MyApplications from "../pages/candidate/MyApplications";
import Wishlist from "../pages/candidate/Wishlist";
import CandidateProfile from "../pages/candidate/CandidateProfile";

// Employer pages (create later)
import EmployerDashboard from "../pages/employer/EmployerDashboard";
import PostJob from "../pages/employer/PostJob";
import MyJobs from "../pages/employer/MyJobs";
import EmployerApplications from "../pages/employer/EmployerApplications";
import CompanyProfile from "../pages/employer/CompanyProfile";

// Admin page (create later)
import AdminHome from "../pages/admin/AdminHome";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public layout */}
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetails />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected area */}
        <Route element={<ProtectedRoute />}>
          {/* Candidate */}
          <Route element={<RoleRoute allow={["Candidate"]} />}>
            <Route path="/candidate" element={<CandidateDashboard />} />
            <Route path="/candidate/applications" element={<MyApplications />} />
            <Route path="/candidate/wishlist" element={<Wishlist />} />
            <Route path="/candidate/profile" element={<CandidateProfile />} />
          </Route>

          {/* Employer */}
          <Route element={<RoleRoute allow={["Employer", "Admin"]} />}>
            <Route path="/employer" element={<EmployerDashboard />} />
            <Route path="/employer/post-job" element={<PostJob />} />
            <Route path="/employer/jobs" element={<MyJobs />} />
            <Route path="/employer/applications" element={<EmployerApplications />} />
            <Route path="/employer/company" element={<CompanyProfile />} />
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute allow={["Admin"]} />}>
            <Route path="/admin" element={<AdminHome />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
