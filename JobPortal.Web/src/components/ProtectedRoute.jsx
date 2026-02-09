import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// public pages
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// candidate
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import CandidateProfile from "../pages/candidate/CandidateProfile";

// employer
import EmployerDashboard from "../pages/employer/EmployerDashboard";

// admin
import AdminHome from "../pages/admin/AdminHome";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔒 AUTH REQUIRED */}
      <Route element={<ProtectedRoute />}>
        
        {/* Candidate */}
        <Route element={<RoleRoute allow={["Candidate"]} />}>
          <Route path="/candidate" element={<CandidateDashboard />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
        </Route>

        {/* Employer */}
        <Route element={<RoleRoute allow={["Employer"]} />}>
          <Route path="/employer" element={<EmployerDashboard />} />
        </Route>

        {/* Admin */}
        <Route element={<RoleRoute allow={["Admin"]} />}>
          <Route path="/admin" element={<AdminHome />} />
        </Route>

      </Route>

      {/* 404 */}
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

