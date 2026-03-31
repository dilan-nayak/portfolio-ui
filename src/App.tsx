import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminAuthProvider } from "@/admin/context/AdminAuthContext";
import { PortfolioContentProvider } from "@/admin/context/PortfolioContentContext";
import RequireAdmin from "@/admin/routes/RequireAdmin";
import AdminLayout from "@/admin/components/AdminLayout";

import "./App.css";

const PublicPortfolioPage = lazy(() => import("@/pages/PublicPortfolioPage"));
const AdminLoginPage = lazy(() => import("@/admin/pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("@/admin/pages/AdminDashboardPage"));
const HeroEditorPage = lazy(() => import("@/admin/pages/HeroEditorPage"));
const AboutEditorPage = lazy(() => import("@/admin/pages/AboutEditorPage"));
const StatusEditorPage = lazy(() => import("@/admin/pages/StatusEditorPage"));
const SkillsEditorPage = lazy(() => import("@/admin/pages/SkillsEditorPage"));
const LearningEditorPage = lazy(() => import("@/admin/pages/LearningEditorPage"));
const ExperienceEditorPage = lazy(() => import("@/admin/pages/ExperienceEditorPage"));
const ProjectsEditorPage = lazy(() => import("@/admin/pages/ProjectsEditorPage"));
const ContactEditorPage = lazy(() => import("@/admin/pages/ContactEditorPage"));
const SettingsEditorPage = lazy(() => import("@/admin/pages/SettingsEditorPage"));
const AnalyticsPage = lazy(() => import("@/admin/pages/AnalyticsPage"));

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-zinc-100 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
    Loading...
  </div>
);

function App() {
  return (
    <PortfolioContentProvider>
      <AdminAuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<PublicPortfolioPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route path="/admin" element={<RequireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="home" element={<HeroEditorPage />} />
                <Route path="about" element={<AboutEditorPage />} />
                <Route path="status" element={<StatusEditorPage />} />
                <Route path="skills" element={<SkillsEditorPage />} />
                <Route path="learning" element={<LearningEditorPage />} />
                <Route path="experience" element={<ExperienceEditorPage />} />
                <Route path="projects" element={<ProjectsEditorPage />} />
                <Route path="contact" element={<ContactEditorPage />} />
                <Route path="settings" element={<SettingsEditorPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AdminAuthProvider>
    </PortfolioContentProvider>
  );
}

export default App;
