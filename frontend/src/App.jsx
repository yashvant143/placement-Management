import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProtectionRoute from './components/ProtectionRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfilePage from './pages/student/StudentProfilePage';
import JobsPage from './pages/student/JobsPage';
import JobDetailsPage from './pages/student/JobDetailsPage';
import ApplicationsPage from './pages/student/ApplicationsPage';
import InterviewsPage from './pages/student/InterviewsPage';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';
import HRProfilePage from './pages/hr/HRProfilePage';
import HRJobsPage from './pages/hr/HRJobsPage';
import CreateJobPage from './pages/hr/CreateJobPage';
import JobApplicantsPage from './pages/hr/JobApplicantsPage';
import HRInterviewsPage from './pages/hr/HRInterviewsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import AdminCompaniesPage from './pages/admin/AdminCompaniesPage';
import AdminJobsPage from './pages/admin/AdminJobsPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminInterviewsPage from './pages/admin/AdminInterviewsPage';
import AdminStatisticsPage from './pages/admin/AdminStatisticsPage';

const AuthenticatedLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes>
          {/* Student Routes */}
          <Route element={<ProtectionRoute allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route path="/student/jobs" element={<JobsPage />} />
            <Route path="/student/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/student/applications" element={<ApplicationsPage />} />
            <Route path="/student/interviews" element={<InterviewsPage />} />
          </Route>

          {/* HR Routes */}
          <Route element={<ProtectionRoute allowedRoles={['hr']} />}>
            <Route path="/hr/dashboard" element={<HRDashboard />} />
            <Route path="/hr/profile" element={<HRProfilePage />} />
            <Route path="/hr/jobs" element={<HRJobsPage />} />
            <Route path="/hr/jobs/create" element={<CreateJobPage />} />
            <Route path="/hr/jobs/:id/applicants" element={<JobApplicantsPage />} />
            <Route path="/hr/interviews" element={<HRInterviewsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectionRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route path="/admin/companies" element={<AdminCompaniesPage />} />
            <Route path="/admin/jobs" element={<AdminJobsPage />} />
            <Route path="/admin/applications" element={<AdminApplicationsPage />} />
            <Route path="/admin/interviews" element={<AdminInterviewsPage />} />
            <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <RegisterPage />} />

      {/* Authenticated Dashboard Routes */}
      <Route path="/*" element={user ? <AuthenticatedLayout /> : <Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
