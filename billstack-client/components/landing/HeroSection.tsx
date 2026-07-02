'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Zap, CheckCircle } from 'lucide-react';

export function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -60]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      
      {/* ── LAYERED AMBIENT LIGHTING ── */}
      <div className="absolute inset-0 -z-10">
        {/* Primary violet spotlight */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[140vw] max-w-[1400px] h-[70vh] bg-[radial-gradient(ellipse_at_top,rgba(99,91,255,0.18)_0%,transparent_65%)]" />
        {/* Secondary teal accent */}
        <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vh] bg-[radial-gradient(ellipse,rgba(34,211,238,0.06)_0%,transparent_70%)]" />
        {/* Deep indigo bottom */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-[radial-gradient(ellipse,rgba(79,70,229,0.1)_0%,transparent_70%)]" />
        {/* Grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <motion.div
        style={{ y: y1 }}
        className="relative z-10 flex flex-col items-center text-center w-full max-w-7xl mx-auto pt-28 pb-10 sm:pt-36"
      >
        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.1] text-[13px] text-[#A1A1AA] backdrop-blur-sm hover:bg-white/[0.07] transition-colors cursor-default"
        >
          <span className="flex gap-1 items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-medium">v1.0 live</span>
          </span>
          <span className="w-px h-3.5 bg-white/10" />
          <span>Subscription infrastructure for Nigerian SaaS</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-semibold tracking-[-0.04em] text-white leading-[1.02] mb-6 max-w-5xl"
          style={{ fontSize: 'clamp(42px, 8vw, 96px)' }}
        >
          Billing that works
          <br />
          <span
            className="text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #818CF8 0%, #C4B5FD 35%, #93C5FD 65%, #6EE7B7 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            as hard as you do.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-[#A1A1AA] max-w-2xl mb-10 leading-relaxed px-2"
        >
          A composable API for recurring billing, intelligent dunning, and
          Nomba-powered split routing. From zero to revenue in hours.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-white text-black font-semibold text-[15px] px-8 py-[14px] rounded-full hover:bg-[#F0F0F0] transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_10px_40px_-8px_rgba(255,255,255,0.25)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_15px_50px_-8px_rgba(255,255,255,0.35)] hover:scale-[1.02]">
              Start building free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </Link>
          <Link href="#workflow" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-[#D4D4D8] font-medium text-[15px] px-8 py-[14px] rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] hover:text-white transition-all backdrop-blur-sm">
              See how it works
            </button>
          </Link>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[13px] text-[#71717A]"
        >
          {[
            { icon: Shield, text: 'Bank-grade security' },
            { icon: Zap, text: 'Sub-200ms API response' },
            { icon: CheckCircle, text: '99.9% uptime SLA' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 text-[#52525B]" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── FLOATING PRODUCT CARDS ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ opacity }}
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-10"
      >
        {/* Main dashboard mockup */}
        <div className="relative mx-auto">
          {/* Top-floating card — Revenue stat */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 left-[5%] sm:left-[8%] z-20 hidden sm:block"
          >
            <div className="bg-[#09090B]/90 backdrop-blur-xl border border-white/[0.12] rounded-2xl px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-52">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-emerald-500/15 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[12px] text-[#71717A] font-medium">Monthly Revenue</span>
              </div>
              <div className="text-[22px] font-semibold text-white tracking-tight">₦12.4M</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[11px] text-emerald-400 font-medium">↑ 14.2%</span>
                <span className="text-[11px] text-[#52525B]">vs last month</span>
              </div>
            </div>
          </motion.div>

          {/* Right-floating card — Split routing */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -top-4 right-[4%] sm:right-[6%] z-20 hidden sm:block"
          >
            <div className="bg-[#09090B]/90 backdrop-blur-xl border border-white/[0.12] rounded-2xl px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-48">
              <div className="text-[12px] text-[#71717A] font-medium mb-3">Split Routing</div>
              <div className="space-y-2">
                {[
                  { label: 'Platform', pct: '10%', color: 'bg-indigo-500' },
                  { label: 'Agent', pct: '15%', color: 'bg-violet-500' },
                  { label: 'Merchant', pct: '75%', color: 'bg-emerald-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    <span className="text-[12px] text-[#D4D4D8] flex-1">{item.label}</span>
                    <span className="text-[12px] text-white font-medium">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main frame */}
          <div className="rounded-[20px] sm:rounded-[28px] border border-white/[0.1] bg-[#050505] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden">
            {/* Browser bar */}
            <div className="h-10 sm:h-11 bg-[#09090B] border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-5">
              <div className="flex gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#EF4444]/70" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F59E0B]/70" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#10B981]/70" />
              </div>
              <div className="bg-white/[0.05] rounded-md h-6 w-40 sm:w-56 flex items-center justify-center px-3 border border-white/[0.05]">
                <span className="text-[10px] sm:text-[11px] text-[#52525B] font-mono">app.billstack.com/dashboard</span>
              </div>
              <div className="w-14 sm:w-16" />
            </div>

            {/* Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr] h-[320px] sm:h-[380px] lg:h-[440px]">
              {/* Sidebar — hidden on mobile */}
              <div className="hidden sm:flex border-r border-white/[0.05] p-3 flex-col gap-1 bg-[#020202]">
                <div className="px-3 py-2 mb-3 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600" />
                  <span className="text-white text-[13px] font-medium">Billstack</span>
                </div>
                {['Dashboard', 'Subscriptions', 'Customers', 'Analytics', 'Split Config', 'Settings'].map((item, i) => (
                  <div key={i} className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${i === 0 ? 'bg-white/[0.06] text-white' : 'text-[#71717A]'}`}>
                    {item}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 overflow-hidden bg-[#030303] relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/8 blur-[80px] rounded-full" />

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
                  {[
                    { label: 'MRR', value: '₦4.2M', up: '+8.4%' },
                    { label: 'Active Subs', value: '1,429', up: '+5.1%' },
                    { label: 'Recovery Rate', value: '94.2%', up: '+2.1%' },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className="bg-[#0A0A0A] border border-white/[0.07] rounded-xl p-3 sm:p-4"
                    >
                      <div className="text-[10px] sm:text-[11px] text-[#52525B] mb-1 font-medium uppercase tracking-wider">{s.label}</div>
                      <div className="text-base sm:text-lg lg:text-xl font-semibold text-white tracking-tight">{s.value}</div>
                      <div className="text-[10px] sm:text-[11px] text-emerald-400 mt-0.5 font-medium">{s.up}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart area */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="bg-[#0A0A0A] border border-white/[0.07] rounded-xl p-3 sm:p-4 h-[160px] sm:h-[200px] lg:h-[240px] relative overflow-hidden"
                >
                  <div className="text-[11px] text-[#52525B] font-medium mb-3">Revenue (last 7 days)</div>
                  <svg className="absolute bottom-0 left-0 w-full h-4/5" viewBox="0 0 400 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="hg1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818CF8" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M0,90 C40,80 80,70 120,55 C160,40 200,60 240,45 C280,30 320,15 400,5 L400,120 L0,120 Z"
                      fill="url(#hg1)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3, duration: 0.8 }}
                    />
                    <motion.path
                      d="M0,90 C40,80 80,70 120,55 C160,40 200,60 240,45 C280,30 320,15 400,5"
                      fill="none"
                      stroke="#818CF8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
                    />
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-48 bg-gradient-to-t from-[#000000] to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
}
