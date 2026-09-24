import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { DeepScoutLogo } from "../ui/DeepScoutLogo.jsx";

/**
 * RegisterForm
 * Modern research-grade registration card following Landing Page dark theme.
 */
export const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Please enter your name.");
      return;
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate("/app", { replace: true });
    } catch (err) {
      const msg =
        (typeof err.message === "string" && !err.message.includes("[object") ? err.message : null) ||
        (typeof err.error?.message === "string" ? err.error.message : null) ||
        (typeof err === "string" ? err : null) ||
        "Failed to create account. Please try again.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 sm:p-8 rounded-2xl bg-[#0F172A]/90 border border-slate-800/90 shadow-2xl shadow-blue-950/50 backdrop-blur-xl space-y-6 animate-fade-in text-slate-100">
      {/* Brand & Heading */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <DeepScoutLogo size="md" glow={true} />
          <span className="font-mono font-black text-lg tracking-tight text-white flex items-center">
            DEEP<span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">SCOUT</span>
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create an account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Start investigating complex questions with evidence.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {formError && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{typeof formError === "string" ? formError : String(formError)}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="block text-xs font-semibold text-slate-300"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. Eleanor Vance"
            className="w-full px-3.5 py-2.5 text-sm text-white bg-slate-900/90 border border-slate-700/80 rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-inner"
            disabled={submitting}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-slate-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@institution.org"
            className="w-full px-3.5 py-2.5 text-sm text-white bg-slate-900/90 border border-slate-700/80 rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-inner"
            disabled={submitting}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-slate-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 text-sm text-white bg-slate-900/90 border border-slate-700/80 rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-inner"
            disabled={submitting}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold text-slate-300"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 text-sm text-white bg-slate-900/90 border border-slate-700/80 rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-inner"
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 relative group overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-[length:200%_auto] hover:bg-right rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/30 border border-blue-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <span>Already have an account?</span>
        <Link
          to="/login"
          className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Sign in →
        </Link>
      </div>
    </div>
  );
};
