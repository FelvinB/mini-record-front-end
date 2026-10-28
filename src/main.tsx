import { Navigate } from "react-router";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "@/styles/global.css";

import { AppLayout } from "@/components/common/app-layout";
import { AuthProvider } from "@/components/common/auth-provider";
import { RequireAdmin } from "@/components/common/require-admin";
import { RequireAuth } from "@/components/common/require-auth";
import LandingPage from "@/pages/home";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import DashboardPage from "@/pages/dashboard";
import MyRecordPage from "@/pages/my-record";
import StudentCreatePage from "@/pages/students/create";
import StudentEditPage from "@/pages/students/edit";
import StudentIndexPage from "@/pages/students/index";
import StudentShowPage from "@/pages/students/show";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route element={<RequireAdmin />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/students" element={<StudentIndexPage />} />
            <Route path="/students/create" element={<StudentCreatePage />} />
            <Route path="/students/:id" element={<StudentShowPage />} />
            <Route path="/students/:id/edit" element={<StudentEditPage />} />
          </Route>
          <Route path="/my-record" element={<MyRecordPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>,
);