import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * RegisterForm
 * Pure Black Theme registration card:
 * - Overlapping top badge with Monochrome DS Logo
 * - Centered "Create Account" header
 * - Deep black inputs with neutral focus rings
 * - High-contrast white submit button
 * - Popup entrance animation (animate-card-popup)
 */
export const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Please enter your name or username.");
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
    <div className="relative w-full max-w-md mx-auto pt-14 pb-8 px-6 sm:px-8 rounded-3xl bg-[#0a0a0a]/95 border border-neutral-800/90 shadow-2xl shadow-black backdrop-blur-xl animate-card-popup select-none">
      {/* Top Overlapping Website Logo Badge */}
      <div className="absolute -top-9 sm:-top-10 left-1/2 -translate-x-1/2 z-20">
        <div className="relative group">
          {/* Ambient Outer Glow */}
          <div className="absolute -inset-1.5 rounded-2xl bg-cyan-500/20 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge Shell with Website Logo Monogram (D in white, S in cyan) */}
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#000000] border-2 border-neutral-800 shadow-2xl shadow-black flex items-center justify-center select-none transition-all duration-200 group-hover:scale-105 group-hover:border-cyan-500/60">
            <span className="font-black font-sans tracking-tight text-3xl sm:text-4xl flex items-center justify-center leading-none">
              <span className="text-white">D</span>
              <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">S</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Create Account
        </h1>
      </div>

      {/* Error Banner */}
      {formError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5 shadow-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{formError}</p>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Username / Name */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="register-name"
            className="block text-xs sm:text-sm font-semibold text-neutral-300"
          >
            Username
          </label>
          <input
            id="register-name"
            type="text"
            required
            autoComplete="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Krunal_2006"
            className="w-full px-4 py-2.5 sm:py-3 text-sm text-white bg-black border border-neutral-800 rounded-xl placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors shadow-inner"
            disabled={submitting}
          />
        </div>

        {/* Email Address */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="register-email"
            className="block text-xs sm:text-sm font-semibold text-neutral-300"
          >
            Email Address
          </label>
          <input
            id="register-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="krunal@deepscout.ai"
            className="w-full px-4 py-2.5 sm:py-3 text-sm text-white bg-black border border-neutral-800 rounded-xl placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors shadow-inner"
            disabled={submitting}
          />
        </div>

        {/* Password with Eye Toggle */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="register-password"
            className="block text-xs sm:text-sm font-semibold text-neutral-300"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-4 py-2.5 sm:py-3 pr-11 text-sm text-white bg-black border border-neutral-800 rounded-xl placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors shadow-inner"
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-cyan-400 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password with Eye Toggle */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="register-confirm"
            className="block text-xs sm:text-sm font-semibold text-neutral-300"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="register-confirm"
              type={showConfirmPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-4 py-2.5 sm:py-3 pr-11 text-sm text-white bg-black border border-neutral-800 rounded-xl placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors shadow-inner"
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-cyan-400 transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Links Row: Already have an account? & Shield note */}
        <div className="flex items-center justify-between text-xs sm:text-sm pt-1 pb-1 text-neutral-400">
          <Link
            to="/login"
            className="font-medium text-neutral-300 hover:text-white transition-colors"
          >
            Already have an account? <span className="text-cyan-400 font-semibold underline hover:text-cyan-300">Login</span>
          </Link>
          <span className="text-[11px] text-neutral-500 font-mono">
            Encrypted
          </span>
        </div>

        {/* Submit Button with vibrant blue/indigo gradient */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 py-3 px-5 rounded-xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/35 border border-blue-400/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>
    </div>
  );
};
