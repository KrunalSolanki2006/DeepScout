import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowDown,
  Check,
  Search,
  GitCompare,
  FileCheck,
  BookOpen,
  Scale,
  HelpCircle,
  FileText,
  ShieldCheck,
  Sparkles,
  Layers,
  Activity,
  ChevronsRight,
  ChevronsDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { SourceFavicon } from "../components/investigation/SourceFavicon.jsx";
import { SideRays } from "../components/ui/SideRays.jsx";
import { DeepScoutLogo } from "../components/ui/DeepScoutLogo.jsx";

/**
 * ScrollReveal Component
 * Intersection-Observer powered scroll entrance with directional support:
 * - direction="left": slides in from left to center
 * - direction="right": slides in from right to center
 * - direction="up": slides in from bottom to center
 */
const ScrollReveal = ({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 750,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getDirectionClasses = () => {
    switch (direction) {
      case "left":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-12 sm:-translate-x-16";
      case "right":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-12 sm:translate-x-16";
      case "up":
        return isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10";
      default:
        return isVisible ? "opacity-100" : "opacity-0";
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all ease-out transform ${getDirectionClasses()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
};

/**
 * LandingPage
 * DeepScout Landing Page — Exact Content & Structure Specification
 * Premium Dark Theme Edition with Ambient SideRays Illumination,
 * expansive full-width proportions, high-legibility typography,
 * directional scroll animations, and human-crafted visual depth.
 */
export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen bg-[#000000] text-slate-100 flex flex-col font-sans selection:bg-blue-600/40 selection:text-white antialiased overflow-x-hidden">
      {/* Background Architectural Grid Texture */}
      <div
        className="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-40 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)]"
        aria-hidden="true"
      />

      {/* Top-Right Ambient Backlight (soft volumetric halo under rays) */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[550px] bg-gradient-to-bl from-cyan-500/10 via-sky-500/5 to-transparent blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Top-Right Ambient Side Rays Effect (Illuminating the Hero & Product Preview) */}
      <div
        className="absolute top-0 right-0 w-full max-w-[1400px] h-[700px] pointer-events-none z-0 overflow-hidden"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 100% 0%, #000 35%, rgba(0,0,0,0.65) 65%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 100% 0%, #000 35%, rgba(0,0,0,0.65) 65%, transparent 100%)",
        }}
        aria-hidden="true"
      >
        <SideRays
          speed={2.5}
          rayColor1="#38bdf8"
          rayColor2="#818cf8"
          intensity={1.8}
          spread={2}
          origin="top-right"
          tilt={0}
          saturation={1.2}
          blend={0.75}
          falloff={1.6}
          opacity={0.8}
        />
      </div>

      {/* ==================================================
          1. HEADER
          ================================================== */}
      <header className="sticky top-0 z-30 h-16 border-b border-neutral-800 bg-[#000000]/90 backdrop-blur-md transition-all">
        <div className="max-w-6xl xl:max-w-7xl mx-auto h-full px-6 sm:px-8 lg:px-10 flex items-center justify-between">
          {/* Left: DeepScout Custom Logo Mark + Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <DeepScoutLogo size="md" glow={true} />
            <div className="flex flex-col">
              <span className="font-mono font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors flex items-center">
                Deep<span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Scout</span>
              </span>
              <span className="hidden sm:inline-block text-xs text-neutral-400 font-normal tracking-wide">
                Evidence-driven investigation
              </span>
            </div>
          </Link>

          {/* Right: Sign In & Get Started */}
          <nav className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <Link
                to="/app"
                className="relative group overflow-hidden inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-[length:200%_auto] hover:bg-right rounded-lg shadow-md shadow-blue-600/30 hover:shadow-indigo-500/40 border border-blue-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Open Workspace</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="relative group overflow-hidden inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-[length:200%_auto] hover:bg-right rounded-lg shadow-md shadow-blue-600/30 hover:shadow-indigo-500/40 border border-blue-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Flow - Balanced Medium Grid */}
      <main className="relative z-10 flex-1 w-full max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pb-20 space-y-20 md:space-y-28">
        {/* ==================================================
            2. HERO SECTION (Full Viewport First Fold - Only Hero Visible)
            ================================================== */}
        <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-6 sm:py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 my-auto">
            {/* Left Column (Slides Left to Center) */}
            <ScrollReveal direction="left" delay={50} className="w-full lg:w-7/12 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider text-cyan-300 bg-black/90 border border-cyan-500/40 uppercase shadow-md shadow-black backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                </span>
                <span>EVIDENCE-DRIVEN INVESTIGATION</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] font-extrabold tracking-tight text-white leading-[1.1]">
                Investigate questions.
                <br />
                <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(56,189,248,0.25)]">
                  Understand the evidence.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal max-w-xl pt-0.5">
                DeepScout investigates complex questions by gathering evidence, comparing findings, identifying differences, and showing how the final answer was reached.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to={isAuthenticated ? "/app" : "/register"}
                  className="relative group overflow-hidden inline-flex items-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-[length:200%_auto] hover:bg-right rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-indigo-500/35 border border-blue-400/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="relative z-10 flex items-center gap-2.5">
                    <span>Start an Investigation</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                </Link>

                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="inline-flex items-center px-5 py-3 sm:px-6 sm:py-3.5 text-sm sm:text-base font-semibold text-neutral-200 hover:text-white bg-black hover:bg-neutral-900 border border-neutral-800 hover:border-cyan-500/40 rounded-xl shadow-md shadow-black/50 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Sign In
                  </Link>
                )}
              </div>

            </div>

            {/* Quick Proof Pillars with medium cards in pure black */}
            <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#0c0c0c] border border-neutral-800 hover:border-cyan-500/40 flex items-center gap-2.5 transition-all hover:bg-[#121212] group">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-neutral-200 group-hover:text-white">
                    Multi-source
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate">
                    Correlated studies
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0c0c0c] border border-neutral-800 hover:border-sky-500/40 flex items-center gap-2.5 transition-all hover:bg-[#121212] group">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:text-sky-300 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-neutral-200 group-hover:text-white">
                    Traceable
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate">
                    Verified provenance
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0c0c0c] border border-neutral-800 hover:border-blue-500/40 flex items-center gap-2.5 transition-all hover:bg-[#121212] group">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:text-cyan-300 shrink-0">
                  <GitCompare className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-neutral-200 group-hover:text-white">
                    Difference
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate">
                    Contrast auditing
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Live Engine Telemetry & Research Cockpit under SideRays */}
          <ScrollReveal direction="right" delay={200} className="w-full lg:w-5/12 xl:w-[46%]">
            <div className="relative rounded-2xl bg-[#0c0c0c] border border-neutral-800 shadow-2xl shadow-black p-5 sm:p-6 space-y-4 backdrop-blur-xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300 group">
              {/* Top ambient backlight */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-bl from-cyan-500/10 via-sky-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

              {/* Engine Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <DeepScoutLogo size="xs" glow={false} />
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-200 font-bold tracking-wide">
                      EVIDENCE RUNTIME
                    </span>
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black border border-emerald-500/40 text-[10px] text-emerald-300 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      142ms
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-black text-sky-400 border border-sky-500/30 text-xs font-semibold font-mono">
                  AUDITED PIPELINE
                </span>
              </div>

              {/* Active Inquiry Pill with Scope Tags */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="uppercase tracking-wider font-semibold text-[11px]">SAMPLE INQUIRY</span>
                  <span className="text-cyan-400 text-[11px] font-medium">42 SOURCES INDEXED</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-black border border-neutral-800 text-xs sm:text-sm font-medium text-neutral-100 flex items-center justify-between shadow-inner">
                  <span className="truncate">"Is AI capable of replacing people?"</span>
                  <span className="text-[11px] text-cyan-400 shrink-0 font-mono ml-2 font-bold bg-[#141414] px-2 py-0.5 rounded border border-cyan-500/40">PRIMARY</span>
                </div>
              </div>

              {/* Multi-source telemetry bar & Evidence Density */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-neutral-300">Correlation Consistency</span>
                  <span className="text-cyan-300 font-mono font-bold text-xs sm:text-sm">96.8% Agreement</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden relative">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 w-[96.8%] shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>14 Empirical Studies</span>
                  <span className="text-sky-400">128 Verifiable Excerpts</span>
                </div>
              </div>

              {/* Evidence Provenance Stack */}
              <div className="space-y-1.5 pt-0.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                  PROVENANCE STACK
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black border border-neutral-800 flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0 shadow-xs shadow-sky-400" />
                    <div className="min-w-0">
                      <div className="text-neutral-200 font-semibold truncate text-xs">Stanford Research</div>
                      <div className="text-[10px] text-neutral-400 font-mono">Peer-Reviewed • 2024</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black border border-neutral-800 flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 shadow-xs shadow-cyan-400" />
                    <div className="min-w-0">
                      <div className="text-neutral-200 font-semibold truncate text-xs">NBER Empirical DB</div>
                      <div className="text-[10px] text-neutral-400 font-mono">12,400 Sample • 2023</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divergence reconciled callout with distinct badge */}
              <div className="p-3 rounded-xl bg-black border border-cyan-500/40 text-xs sm:text-sm text-cyan-100 flex items-start gap-2.5 shadow-md">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 block">
                    WHERE EVIDENCE DIFFERS
                  </span>
                  <span className="text-neutral-200 text-xs leading-relaxed block">
                    Evidence isolates routine rule-based work (high exposure) versus complex interpersonal tasks (augmentation).
                  </span>
                </div>
              </div>

              {/* Bottom Audit Integrity Strip */}
              <div className="pt-1.5 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="inline-flex items-center gap-1.5 text-sky-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  100% Traceable Provenance
                </span>
                <span className="text-neutral-500">Zero Ungrounded Claims</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================================================
          3. REAL PRODUCT PREVIEW (Slides up to center, fully illuminated)
          ================================================== */}
      <section id="preview" className="pt-6 sm:pt-10 scroll-mt-20">
        <ScrollReveal direction="up" delay={100} className="space-y-4">
          <div className="border border-neutral-800 rounded-2xl bg-[#0c0c0c] shadow-2xl shadow-black overflow-hidden backdrop-blur-md transition-all hover:border-neutral-700">
            {/* Mock Browser Header */}
            <div className="px-5 py-3 bg-black/95 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-xs sm:text-sm text-neutral-200 ml-3 font-sans font-semibold">
                  DeepScout Investigation Result
                </span>
              </div>
              <span className="text-xs text-neutral-400 font-medium hidden sm:inline-block">Primary Research Document</span>
            </div>

            {/* Document Content */}
            <div className="p-6 sm:p-8 md:p-10 space-y-6 bg-[#080808]">
              {/* Question */}
              <div className="space-y-1.5 pb-4 border-b border-neutral-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                  QUESTION
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                  Is AI capable of replacing people?
                </h2>
              </div>

              {/* Conclusion */}
              <div className="p-4 sm:p-5 rounded-xl bg-black border border-sky-500/40 space-y-2 shadow-inner">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-sky-400">
                  <Check className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
                  <span>CONCLUSION</span>
                </div>
                <p className="text-sm sm:text-base text-neutral-100 leading-relaxed font-normal">
                  AI can replace certain tasks and roles, particularly routine and rule-based work, but the evidence does not support universal replacement of workers.
                </p>
              </div>

              {/* Key Findings */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                  KEY FINDINGS
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-xl bg-[#0c0c0c] border border-neutral-800 space-y-1.5 hover:border-neutral-700 transition-colors shadow-xs">
                    <span className="text-xs font-mono font-bold text-sky-400">01</span>
                    <p className="text-xs sm:text-sm text-neutral-200 font-medium leading-relaxed">
                      Routine work is more exposed to automation.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0c0c0c] border border-neutral-800 space-y-1.5 hover:border-neutral-700 transition-colors shadow-xs">
                    <span className="text-xs font-mono font-bold text-sky-400">02</span>
                    <p className="text-xs sm:text-sm text-neutral-200 font-medium leading-relaxed">
                      AI often supports workers rather than completely replacing them.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0c0c0c] border border-neutral-800 space-y-1.5 hover:border-neutral-700 transition-colors shadow-xs">
                    <span className="text-xs font-mono font-bold text-sky-400">03</span>
                    <p className="text-xs sm:text-sm text-neutral-200 font-medium leading-relaxed">
                      The impact depends on the type of work and context.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sources */}
              <div className="space-y-3 pt-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                  SOURCES
                </span>
                <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-xl overflow-hidden bg-black">
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-[#121212] transition-colors">
                    <div className="flex items-center gap-3">
                      <SourceFavicon url="https://stanford.edu" domain="stanford.edu" publisher="Stanford University" size="sm" />
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-sm font-bold text-white">
                          Stanford University
                        </div>
                        <div className="text-xs text-neutral-400">
                          What is really happening to jobs?
                        </div>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-neutral-900 border border-sky-500/30 text-[11px] font-mono text-sky-400 font-semibold">
                      PEER REVIEWED
                    </span>
                  </div>
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-[#121212] transition-colors">
                    <div className="flex items-center gap-3">
                      <SourceFavicon url="https://nber.org" domain="nber.org" publisher="Research Source" size="sm" />
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-sm font-bold text-white">
                          Research Source
                        </div>
                        <div className="text-xs text-neutral-400">
                          AI and the Future of Work
                        </div>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-neutral-900 border border-cyan-500/30 text-[11px] font-mono text-cyan-400 font-semibold">
                      EMPIRICAL STUDY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ==================================================
          4. WHY DeepScout (Distinct Centered Pipeline Architecture)
          ================================================== */}
      <section className="relative space-y-8 pt-4 pb-2">
        {/* Centered Distinct Header with Medium Text */}
        <ScrollReveal direction="up" delay={50} className="text-center max-w-3xl mx-auto space-y-2.5">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Why DeepScout?
          </h2>

          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Not just an AI answer.
          </h3>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal max-w-2xl mx-auto">
            DeepScout follows the evidence behind a question instead of stopping at a generated response.
          </p>
        </ScrollReveal>

        {/* Interactive Pipeline Circuit Deck */}
        <ScrollReveal direction="up" delay={150} className="relative">
          {/* Ambient centered volumetric glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[900px] h-48 bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-blue-500/10 blur-3xl pointer-events-none -z-10"
            aria-hidden="true"
          />

          <div className="relative p-5 sm:p-7 md:p-8 rounded-2xl bg-[#0c0c0c] border border-neutral-800 shadow-2xl shadow-black backdrop-blur-xl space-y-6">
            {/* Stages Pipeline Row - All Boxes Exact Same Height & Size */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 text-center">
              {/* 01 QUESTION */}
              <div className="w-full md:w-auto flex-1 h-28 sm:h-32 p-3.5 sm:p-4 rounded-xl bg-black border border-neutral-800 hover:border-cyan-500/40 hover:bg-[#121212] transition-all hover:-translate-y-0.5 shadow-md flex flex-col justify-between group">
                <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-neutral-400">
                  <span className="text-sky-400 group-hover:text-cyan-300 font-extrabold">01</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-900 text-[10px] text-neutral-300">STAGE</span>
                </div>
                <div className="flex-1 flex items-center justify-center py-1">
                  <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-neutral-100 text-center leading-snug block">
                    QUESTION
                  </span>
                </div>
                <div className="w-full flex justify-center">
                  <div className="w-6 h-0.5 rounded-full bg-neutral-800 group-hover:bg-cyan-500/70 transition-colors" />
                </div>
              </div>

              {/* Animated Flow Connector 1 (Only >> with glow) */}
              <div className="flex items-center justify-center my-1 md:my-0 md:px-1.5 shrink-0 text-cyan-400">
                <ChevronsRight className="w-6 h-6 stroke-[2.25] hidden md:block animate-arrow-x [animation-delay:0ms] drop-shadow-[0_0_6px_rgba(34,211,238,0.85)]" />
                <ChevronsDown className="w-6 h-6 stroke-[2.25] md:hidden animate-arrow-y [animation-delay:0ms] drop-shadow-[0_0_6px_rgba(34,211,238,0.85)]" />
              </div>

              {/* 02 EVIDENCE */}
              <div className="w-full md:w-auto flex-1 h-28 sm:h-32 p-3.5 sm:p-4 rounded-xl bg-black border border-neutral-800 hover:border-cyan-500/40 hover:bg-[#121212] transition-all hover:-translate-y-0.5 shadow-md flex flex-col justify-between group">
                <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-neutral-400">
                  <span className="text-sky-400 group-hover:text-cyan-300 font-extrabold">02</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-900 text-[10px] text-neutral-300">CORPUS</span>
                </div>
                <div className="flex-1 flex items-center justify-center py-1">
                  <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-neutral-100 text-center leading-snug block">
                    EVIDENCE
                  </span>
                </div>
                <div className="w-full flex justify-center">
                  <div className="w-6 h-0.5 rounded-full bg-neutral-800 group-hover:bg-cyan-500/70 transition-colors" />
                </div>
              </div>

              {/* Animated Flow Connector 2 (Only >> with glow) */}
              <div className="flex items-center justify-center my-1 md:my-0 md:px-1.5 shrink-0 text-cyan-400">
                <ChevronsRight className="w-6 h-6 stroke-[2.25] hidden md:block animate-arrow-x [animation-delay:350ms] drop-shadow-[0_0_6px_rgba(34,211,238,0.85)]" />
                <ChevronsDown className="w-6 h-6 stroke-[2.25] md:hidden animate-arrow-y [animation-delay:350ms] drop-shadow-[0_0_6px_rgba(34,211,238,0.85)]" />
              </div>

              {/* 03 KEY FINDINGS */}
              <div className="w-full md:w-auto flex-1 h-28 sm:h-32 p-3.5 sm:p-4 rounded-xl bg-black border border-neutral-800 hover:border-cyan-500/40 hover:bg-[#121212] transition-all hover:-translate-y-0.5 shadow-md flex flex-col justify-between group">
                <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-neutral-400">
                  <span className="text-sky-400 group-hover:text-cyan-300 font-extrabold">03</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-900 text-[10px] text-neutral-300">SYNTHESIS</span>
                </div>
                <div className="flex-1 flex items-center justify-center py-1">
                  <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-neutral-100 text-center leading-snug block">
                    KEY FINDINGS
                  </span>
                </div>
                <div className="w-full flex justify-center">
                  <div className="w-6 h-0.5 rounded-full bg-neutral-800 group-hover:bg-cyan-500/70 transition-colors" />
                </div>
              </div>

              {/* Animated Flow Connector 3 (Only >> with glow) */}
              <div className="flex items-center justify-center my-1 md:my-0 md:px-1.5 shrink-0 text-cyan-400">
                <ChevronsRight className="w-6 h-6 stroke-[2.25] hidden md:block animate-arrow-x [animation-delay:700ms] drop-shadow-[0_0_6px_rgba(34,211,238,0.85)]" />
                <ChevronsDown className="w-6 h-6 stroke-[2.25] md:hidden animate-arrow-y [animation-delay:700ms] drop-shadow-[0_0_6px_rgba(34,211,238,0.85)]" />
              </div>

              {/* 04 WHERE EVIDENCE DIFFERS */}
              <div className="w-full md:w-auto flex-1 h-28 sm:h-32 p-3.5 sm:p-4 rounded-xl bg-black border border-neutral-800 hover:border-cyan-500/40 hover:bg-[#121212] transition-all hover:-translate-y-0.5 shadow-md flex flex-col justify-between group">
                <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-neutral-400">
                  <span className="text-sky-400 group-hover:text-cyan-300 font-extrabold">04</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-900 text-[10px] text-neutral-300">AUDIT</span>
                </div>
                <div className="flex-1 flex items-center justify-center py-1">
                  <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-neutral-100 text-center leading-snug block">
                    WHERE EVIDENCE DIFFERS
                  </span>
                </div>
                <div className="w-full flex justify-center">
                  <div className="w-6 h-0.5 rounded-full bg-neutral-800 group-hover:bg-cyan-500/70 transition-colors" />
                </div>
              </div>

              {/* Animated Flow Connector 4 (Only >> with glow) */}
              <div className="flex items-center justify-center my-1 md:my-0 md:px-1.5 shrink-0 text-cyan-400">
                <ChevronsRight className="w-6 h-6 stroke-[2.25] hidden md:block animate-arrow-x [animation-delay:1050ms] drop-shadow-[0_0_6px_rgba(34,211,238,0.85)]" />
                <ChevronsDown className="w-6 h-6 stroke-[2.25] md:hidden animate-arrow-y [animation-delay:1050ms] drop-shadow-[0_0_6px_rgba(34,211,238,0.85)]" />
              </div>

              {/* 05 CONCLUSION */}
              <div className="w-full md:w-auto flex-1 h-28 sm:h-32 p-3.5 sm:p-4 rounded-xl bg-black border-2 border-cyan-400/80 shadow-lg shadow-cyan-500/20 hover:border-cyan-300 transition-all hover:-translate-y-0.5 flex flex-col justify-between group">
                <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-cyan-300">
                  <span className="text-cyan-400 font-extrabold">05</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-900 text-[10px] text-cyan-300 border border-cyan-500/40">VERIFIED</span>
                </div>
                <div className="flex-1 flex items-center justify-center py-1">
                  <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-white text-center leading-snug block">
                    CONCLUSION
                  </span>
                </div>
                <div className="w-full flex justify-center">
                  <div className="w-6 h-0.5 rounded-full bg-cyan-400/80 shadow-xs" />
                </div>
              </div>
            </div>

            {/* Bottom explanatory descriptor */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-center gap-2 text-center text-xs sm:text-sm text-neutral-300 font-medium">
              <span>See what supports the answer, where the evidence differs, and what conditions matter.</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ==================================================
          5. THREE CORE CAPABILITIES (Left-to-Center, Up-to-Center, Right-to-Center)
          ================================================== */}
      <section className="space-y-8 pt-4">
        <ScrollReveal direction="left" delay={50} className="space-y-3 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider text-cyan-300 bg-black border border-cyan-500/40 uppercase shadow-md shadow-black">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            CORE CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Built for deeper questions.
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Architected to replace shallow AI summaries with structured inquiry, verifiable synthesis, and transparent reasoning.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {/* CAPABILITY 01 (Slides from Left) */}
          <ScrollReveal direction="left" delay={100}>
            <div className="h-full p-6 sm:p-7 rounded-2xl bg-[#0c0c0c] border border-neutral-800 space-y-4 hover:border-cyan-500/40 hover:bg-[#111111] transition-all duration-300 group shadow-lg">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 border border-cyan-500/30 group-hover:border-cyan-400/50 flex items-center justify-center text-cyan-400 transition-colors shadow-xs">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase block">
                  CAPABILITY 01
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                  Investigate
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Break down complex, multifaceted questions into an orchestrated research investigation. DeepScout formulates target hypotheses, surveys peer-reviewed literature, and gathers primary empirical evidence.
              </p>
              <div className="pt-1 flex flex-wrap gap-2 text-xs font-mono text-neutral-300">
                <span className="px-2.5 py-1 rounded-md bg-black border border-neutral-800 text-neutral-300">
                  Structured Search
                </span>
                <span className="px-2.5 py-1 rounded-md bg-black border border-neutral-800 text-neutral-300">
                  Literature Survey
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* CAPABILITY 02 (Slides Up from Center) */}
          <ScrollReveal direction="up" delay={200}>
            <div className="h-full p-6 sm:p-7 rounded-2xl bg-[#0c0c0c] border border-neutral-800 space-y-4 hover:border-cyan-500/40 hover:bg-[#111111] transition-all duration-300 group shadow-lg">
              <div className="w-11 h-11 rounded-xl bg-sky-500/10 group-hover:bg-sky-500/20 border border-sky-500/30 group-hover:border-sky-400/50 flex items-center justify-center text-sky-400 transition-colors shadow-xs">
                <GitCompare className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase block">
                  CAPABILITY 02
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                  Compare Evidence
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Cross-examine competing findings across independent datasets. Identify exactly where scientific studies agree, pinpoint critical points of divergence, and uncover the real-world conditions that explain the contrast.
              </p>
              <div className="pt-1 flex flex-wrap gap-2 text-xs font-mono text-neutral-300">
                <span className="px-2.5 py-1 rounded-md bg-black border border-neutral-800 text-neutral-300">
                  Divergence Mapping
                </span>
                <span className="px-2.5 py-1 rounded-md bg-black border border-neutral-800 text-neutral-300">
                  Cross-Source Auditing
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* CAPABILITY 03 (Slides from Right) */}
          <ScrollReveal direction="right" delay={300}>
            <div className="h-full p-6 sm:p-7 rounded-2xl bg-[#0c0c0c] border border-neutral-800 space-y-4 hover:border-cyan-500/40 hover:bg-[#111111] transition-all duration-300 group shadow-lg">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 border border-blue-500/30 group-hover:border-blue-400/50 flex items-center justify-center text-blue-400 transition-colors shadow-xs">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase block">
                  CAPABILITY 03
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                  Trace the Answer
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Audit every claim with end-to-end provenance. Inspect exact citations, primary document excerpts, and verifiable data points that form the logical chain behind the final synthesis.
              </p>
              <div className="pt-1 flex flex-wrap gap-2 text-xs font-mono text-neutral-300">
                <span className="px-2.5 py-1 rounded-md bg-black border border-neutral-800 text-neutral-300">
                  Audit Trail
                </span>
                <span className="px-2.5 py-1 rounded-md bg-black border border-neutral-800 text-neutral-300">
                  Primary Provenance
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================================================
          6. TRUST & TRANSPARENCY (Left-to-Center & Right-to-Center)
          ================================================== */}
      <section className="space-y-8 pt-4">
        <ScrollReveal direction="left" delay={50} className="space-y-3 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider text-cyan-300 bg-black border border-cyan-500/40 uppercase shadow-md shadow-black">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            BUILT AROUND EVIDENCE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            See what stands behind the answer.
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            DeepScout makes the research behind a conclusion transparent, reproducible, and easy to inspect.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* Item 1 (Slides from Left) */}
          <ScrollReveal direction="left" delay={100}>
            <div className="h-full p-5 sm:p-6 rounded-2xl bg-[#0c0c0c] border border-neutral-800 space-y-3 hover:border-cyan-500/40 hover:bg-[#111111] transition-all duration-300 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-cyan-400 mb-1 border border-cyan-500/30 shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                  PROVENANCE
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Sources
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Verify primary origins across academic repositories, institutional databases, and peer-reviewed journals with transparent publisher metadata.
              </p>
            </div>
          </ScrollReveal>

          {/* Item 2 (Slides from Left) */}
          <ScrollReveal direction="left" delay={200}>
            <div className="h-full p-5 sm:p-6 rounded-2xl bg-[#0c0c0c] border border-neutral-800 space-y-3 hover:border-cyan-500/40 hover:bg-[#111111] transition-all duration-300 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-sky-400 mb-1 border border-sky-500/30 shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                  VERIFICATION
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Evidence
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Inspect the empirical data, quantitative metrics, and direct quotes that support every core finding rather than accepting ungrounded claims.
              </p>
            </div>
          </ScrollReveal>

          {/* Item 3 (Slides from Right) */}
          <ScrollReveal direction="right" delay={200}>
            <div className="h-full p-5 sm:p-6 rounded-2xl bg-[#0c0c0c] border border-neutral-800 space-y-3 hover:border-cyan-500/40 hover:bg-[#111111] transition-all duration-300 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-cyan-400 mb-1 border border-cyan-500/30 shadow-xs">
                <Scale className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                  VALIDITY
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Conditions
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Understand the real-world operational parameters, time horizons, and contextual variables that determine when and where findings apply.
              </p>
            </div>
          </ScrollReveal>

          {/* Item 4 (Slides from Right) */}
          <ScrollReveal direction="right" delay={100}>
            <div className="h-full p-5 sm:p-6 rounded-2xl bg-[#0c0c0c] border border-neutral-800 space-y-3 hover:border-cyan-500/40 hover:bg-[#111111] transition-all duration-300 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-blue-400 mb-1 border border-blue-500/30 shadow-xs">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                  HONESTY
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Limitations
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Review upfront disclosures on data gaps, sampling constraints, and questions the current empirical evidence cannot yet resolve.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================================================
          7. FINAL CTA (Slides Up into Center)
          ================================================== */}
      <ScrollReveal direction="up" delay={100}>
        <section className="relative overflow-hidden p-8 sm:p-12 md:p-14 rounded-2xl bg-[#0c0c0c] border border-neutral-800 text-center space-y-6 shadow-2xl shadow-black">
          {/* Ambient centered backlight */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-48 bg-cyan-500/10 blur-3xl pointer-events-none -z-0"
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-2.5 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Have a question worth investigating?
            </h2>
            <p className="text-sm sm:text-base text-neutral-300">
              Start with a question. Follow the evidence.
            </p>
          </div>

          <div className="relative z-10 pt-1">
            <Link
              to={isAuthenticated ? "/app" : "/register"}
              className="relative group overflow-hidden inline-flex items-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-[length:200%_auto] hover:bg-right rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-indigo-500/50 border border-blue-400/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                <span>Start an Investigation</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </main>

    {/* ==================================================
        8. FOOTER
        ================================================== */}
    <footer className="border-t border-neutral-800 bg-[#000000] py-10">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <Link to="/" className="flex items-center gap-3 group">
            <DeepScoutLogo size="md" glow={true} />
            <div className="flex flex-col">
              <span className="font-mono font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors flex items-center">
                Deep<span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Scout</span>
              </span>
              <p className="text-xs text-neutral-400">
                Evidence-driven investigation.
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-6 text-xs sm:text-sm font-medium text-neutral-400">
            <Link to="/login" className="hover:text-cyan-300 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-cyan-300 transition-colors">
              Get Started
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
          <span>© 2026 DeepScout. All rights reserved.</span>
        </div>
      </div>
    </footer>
  </div>
  );
};
