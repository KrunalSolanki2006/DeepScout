import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Loader2, AlertCircle, Eye, EyeOff, CheckCircle2, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * LoginForm
 * Pure Black Theme authentication card:
 * - Overlapping top badge with Monochrome DS Logo
 * - Centered "Login" header
 * - Deep black inputs with neutral focus rings
 * - High-contrast white submit button
 * - Popup entrance animation (animate-card-popup)
 */
export const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!identifier.trim() || !password) {
      setFormError("Please enter your username/email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: identifier.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        (typeof err.message === "string" && !err.message.includes("[object") ? err.message : null) ||
        (typeof err.error?.message === "string" ? err.error.message : null) ||
        (typeof err === "string" ? err : null) ||
        "Incorrect username/email or password. Please try again.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setResetModalOpen(false);
      setResetEmail("");
    }, 2800);
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
          Login
        </h1>
      </div>

      {/* Error Banner */}
      {formError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5 shadow-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{formError}</p>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username or Email */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="identifier"
            className="block text-xs sm:text-sm font-semibold text-neutral-300"
          >
            Username
          </label>
          <input
            id="identifier"
            type="text"
            required
            autoComplete="username email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Krunal_2006"
            className="w-full px-4 py-3 text-sm text-white bg-black border border-neutral-800 rounded-xl placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors shadow-inner"
            disabled={submitting}
          />
        </div>

        {/* Password with Eye Toggle */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="password"
            className="block text-xs sm:text-sm font-semibold text-neutral-300"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-4 py-3 pr-11 text-sm text-white bg-black border border-neutral-800 rounded-xl placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors shadow-inner"
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

        {/* Links Row: Create Account & Reset Password */}
        <div className="flex items-center justify-between text-xs sm:text-sm pt-1 pb-1 text-neutral-400">
          <Link
            to="/register"
            className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Create Account
          </Link>
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="font-medium text-neutral-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Reset Password
          </button>
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
              <span>Logging in...</span>
            </>
          ) : (
            <span>Login</span>
          )}
        </button>
      </form>

      {/* Password Reset Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm p-6 rounded-2xl bg-[#0a0a0a] border border-neutral-800 shadow-2xl text-left space-y-4">
            <button
              onClick={() => setResetModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white">Reset Password</h3>
            <p className="text-xs text-neutral-400">
              Enter your registered username or email to receive recovery instructions.
            </p>

            {resetSent ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Reset link sent! Please check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Krunal_2006 or you@email.com"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-black border border-neutral-800 rounded-xl focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/30 transition-colors"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
