import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";

// Public pages (src/pages/public)
import Home from "../pages/public/Home";
import Jobs from "../pages/public/Jobs";
import JobDetails from "../pages/public/JobDetails";
import Companies from "../pages/public/Companies";
import CompanyDetails from "../pages/public/CompanyDetails";
import NotFound from "../pages/public/NotFound";

// Auth pages (src/pages/auth)
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Candidate pages (src/pages/candidate)
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import CandidateProfile from "../pages/candidate/CandidateProfile";
import Wishlist from "../pages/candidate/Wishlist";
import MyApplications from "../pages/candidate/MyApplications";

// Employer pages (src/pages/employer)
import EmployerDashboard from "../pages/employer/EmployerDashboard";
import MyJobs from "../pages/employer/MyJobs";
import PostJob from "../pages/employer/PostJob";
import EmployerApplications from "../pages/employer/EmployerApplications";
import CompanyProfile from "../pages/employer/CompanyProfile";

// Admin pages (src/pages/admin)
import AdminHome from "../pages/admin/AdminHome";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />

      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />

      <Route path="/companies" element={<Companies />} />
      <Route path="/companies/:id" element={<CompanyDetails />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected area (must be logged in) */}
      <Route element={<ProtectedRoute />}>
        {/* Candidate */}
        <Route element={<RoleRoute allow={["Candidate"]} />}>
          <Route path="/candidate" element={<CandidateDashboard />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route path="/candidate/wishlist" element={<Wishlist />} />
          <Route path="/candidate/applications" element={<MyApplications />} />
        </Route>

        {/* Employer */}
        <Route element={<RoleRoute allow={["Employer"]} />}>
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/employer/jobs" element={<MyJobs />} />
          <Route path="/employer/post-job" element={<PostJob />} />
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
    </Routes>
  );
}
