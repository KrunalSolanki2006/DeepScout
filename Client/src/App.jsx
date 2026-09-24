import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { InvestigationProvider } from "./context/InvestigationContext.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { AppPage } from "./pages/AppPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InvestigationProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Workspace Routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/investigation/:id"
              element={
                <ProtectedRoute>
                  <AppPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </InvestigationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
