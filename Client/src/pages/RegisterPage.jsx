import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "../components/auth/RegisterForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export const RegisterPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="relative min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-600/40 selection:text-white overflow-hidden antialiased">
      {/* Background Architectural Grid Texture */}
      <div
        className="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-40 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)]"
        aria-hidden="true"
      />

      {/* Top-Right Ambient Backlight */}
      <div
        className="absolute top-0 right-0 w-[550px] h-[450px] bg-gradient-to-bl from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Top: Back link */}
      <div className="relative z-10 max-w-sm mx-auto w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Overview</span>
        </Link>
      </div>

      {/* Center: Auth Card */}
      <div className="relative z-10 max-w-sm mx-auto w-full py-6">
        <RegisterForm />
      </div>

      {/* Bottom: Legal / Brand Footer */}
      <div className="relative z-10 max-w-sm mx-auto w-full text-center text-xs text-slate-500 font-mono">
        <span>DeepScout • Evidence-Driven Investigation</span>
      </div>
    </div>
  );
};
