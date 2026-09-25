import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "../components/auth/RegisterForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { TypewriterBrand } from "../components/ui/TypewriterBrand.jsx";

export const RegisterPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="relative min-h-screen bg-[#000000] text-neutral-100 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 selection:bg-white/20 selection:text-white overflow-x-hidden antialiased">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-25 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_10%,#000_60%,transparent_100%)]"
        aria-hidden="true"
      />

      {/* Top Ambient Monochrome Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-white/[0.06] via-neutral-500/[0.02] to-transparent blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Top Bar: Left Back to Home, Centered Logo with Typing Animation */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between pt-2 pb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Center Brand Wordmark with Typing Animation & Increased Size */}
        <Link
          to="/"
          className="flex items-center group transition-opacity hover:opacity-90 absolute left-1/2 -translate-x-1/2"
        >
          <TypewriterBrand textSize="text-2xl sm:text-3xl md:text-4xl" />
        </Link>

        {/* Spacer for center alignment balance */}
        <div className="w-24 sm:w-28" aria-hidden="true" />
      </header>

      {/* Center: Auth Card with Popup Animation */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto py-8">
        <RegisterForm />
      </main>

      {/* Bottom: Legal / Brand Footer */}
      <footer className="relative z-10 max-w-md mx-auto w-full text-center text-xs text-slate-500 font-mono py-4">
        <span>DeepScout • Evidence-Driven Intelligence Architecture</span>
      </footer>
    </div>
  );
};
