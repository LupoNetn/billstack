'use client';

import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Repeat, ArrowRight } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#000000] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 sm:mb-28 max-w-3xl mx-auto px-2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-white mb-5"
          >
            A fully integrated suite.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#A1A1AA] text-base sm:text-lg leading-relaxed"
          >
            All the billing primitives you need, composable and production-ready.
          </motion.p>
        </div>

        {/* Feature 1 — Multi-Split */}
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center mb-24 sm:mb-40">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1 lg:pr-12"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-6 border border-white/[0.08]">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-white mb-4">Multi-Split Routing</h3>
            <p className="text-[#A1A1AA] leading-relaxed text-base sm:text-[17px] mb-7">
              Split subscription revenue instantly between your platform, agents, and merchants using percentages or fixed amounts via Nomba APIs.
            </p>
            <ul className="space-y-3.5 mb-7">
              {['Percentage & Flat fee splits', 'Dynamic routing per subscription', 'Real-time settlement'].map((item, i) => (
                <li key={i} className="flex items-center text-[#D4D4D8] text-[14px] sm:text-[15px] gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/[0.05] shrink-0 flex items-center justify-center">
                    <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="flex items-center gap-2 text-white text-[14px] sm:text-[15px] font-medium hover:text-[#A1A1AA] transition-colors group">
              Explore Split Routing <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 h-[320px] sm:h-[420px] lg:h-[480px] bg-[#050505] rounded-[24px] sm:rounded-[32px] border border-white/[0.08] p-6 sm:p-10 relative overflow-hidden flex items-center justify-center"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-[#6366F1]/8 blur-[80px] rounded-full" />
            <div className="relative w-full max-w-sm flex flex-col gap-4">
              <div className="bg-[#09090B] border border-white/[0.08] rounded-[16px] p-4 sm:p-5 shadow-xl">
                <span className="text-[12px] text-[#A1A1AA] block mb-1">Incoming Payment</span>
                <span className="text-lg sm:text-xl text-white font-semibold">₦100,000.00</span>
              </div>
              <div className="h-6 w-px bg-white/[0.08] mx-auto" />
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-1 bg-[#09090B] border border-white/[0.08] rounded-[14px] sm:rounded-[16px] p-3 sm:p-4 shadow-xl">
                  <span className="text-[11px] sm:text-[12px] text-[#A1A1AA] block mb-1">Platform (10%)</span>
                  <span className="text-base sm:text-lg text-white font-medium">₦10,000</span>
                </div>
                <div className="flex-[1.5] bg-[#09090B] border border-white/[0.08] rounded-[14px] sm:rounded-[16px] p-3 sm:p-4 shadow-xl">
                  <span className="text-[11px] sm:text-[12px] text-[#A1A1AA] block mb-1">Merchant (90%)</span>
                  <span className="text-base sm:text-lg text-white font-medium">₦90,000</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature 2 — Subscription Health */}
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center mb-24 sm:mb-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-[360px] sm:h-[440px] lg:h-[500px] bg-[#050505] rounded-[24px] sm:rounded-[32px] border border-white/[0.08] p-5 sm:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#A78BFA]/6 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative h-full flex flex-col gap-3 sm:gap-4">
              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#09090B] border border-white/[0.07] rounded-[14px] p-3 sm:p-4">
                  <div className="text-[10px] sm:text-[11px] text-[#52525B] font-medium uppercase tracking-wider mb-2 sm:mb-3">Churn Rate</div>
                  <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-1">2.4%</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">↓ 0.6%</span>
                    <span className="text-[10px] sm:text-[11px] text-[#52525B]">vs last mo.</span>
                  </div>
                </div>
                <div className="bg-[#09090B] border border-white/[0.07] rounded-[14px] p-3 sm:p-4">
                  <div className="text-[10px] sm:text-[11px] text-[#52525B] font-medium uppercase tracking-wider mb-2 sm:mb-3">Health Score</div>
                  <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-1">91</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">Excellent</span>
                  </div>
                </div>
              </div>

              {/* Forecast chart */}
              <div className="flex-1 bg-[#09090B] border border-white/[0.07] rounded-[14px] p-3 sm:p-4 overflow-hidden relative min-h-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] sm:text-[12px] font-medium text-[#A1A1AA]">Subscription Forecast</div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#818CF8]" />
                      <span className="text-[9px] sm:text-[10px] text-[#71717A]">Actual</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full border border-dashed border-[#818CF8]/60" />
                      <span className="text-[9px] sm:text-[10px] text-[#71717A]">Forecast</span>
                    </div>
                  </div>
                </div>
                <svg className="w-full h-[calc(100%-28px)]" viewBox="0 0 340 90" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818CF8" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818CF8" stopOpacity="0.07" />
                      <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,72 C30,65 60,54 100,44 C130,36 160,32 200,24 L200,90 L0,90 Z" fill="url(#fg1)" />
                  <motion.path
                    d="M0,72 C30,65 60,54 100,44 C130,36 160,32 200,24"
                    fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <path d="M200,24 C230,16 270,10 340,2 L340,90 L200,90 Z" fill="url(#fg2)" />
                  <motion.path
                    d="M200,24 C230,16 270,10 340,2"
                    fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 1.2, ease: "easeInOut" }}
                  />
                  <line x1="200" y1="0" x2="200" y2="90" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 3" />
                  <text x="204" y="10" fill="#52525B" fontSize="7" fontFamily="monospace">Today</text>
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, i) => (
                    <text key={m} x={i * 54 + 4} y="88" fill="#52525B" fontSize="7" fontFamily="monospace">{m}</text>
                  ))}
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:pl-12"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-6 border border-white/[0.08]">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-white mb-4">Subscription Health</h3>
            <p className="text-[#A1A1AA] leading-relaxed text-base sm:text-[17px] mb-7">
              Know exactly where your recurring revenue is heading. Track churn rate trends, monitor health scores, and forecast subscriber growth — all in real time from your Billstack dashboard.
            </p>
            <ul className="space-y-3.5 mb-7">
              {[
                'Churn rate with period-over-period comparison',
                'subscription payment forecast - so you can now how much funds would be arriving soon and better manage funds',
                'Cohort-level health scoring per plan',
              ].map((item, i) => (
                <li key={i} className="flex items-start text-[#D4D4D8] text-[14px] sm:text-[15px] gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/[0.05] shrink-0 flex items-center justify-center mt-0.5">
                    <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="flex items-center gap-2 text-white text-[14px] sm:text-[15px] font-medium hover:text-[#A1A1AA] transition-colors group">
              Explore Analytics <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Feature 3 — DVA + Dunning */}
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-[320px] sm:h-[420px] lg:h-[480px] bg-[#050505] rounded-[24px] sm:rounded-[32px] border border-white/[0.08] p-6 sm:p-10 relative overflow-hidden flex items-center justify-center"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-[#10B981]/8 blur-[80px] rounded-full" />
            <div className="relative w-full max-w-sm space-y-4">
              <div className="flex items-center justify-between bg-[#09090B] border border-white/[0.08] rounded-[16px] p-4 sm:p-5 shadow-xl">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center shrink-0">
                    <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#EF4444]" />
                  </div>
                  <div>
                    <div className="text-[13px] sm:text-[14px] font-medium text-white">Card charge failed</div>
                    <div className="text-[11px] sm:text-[12px] text-[#A1A1AA]">Insufficient funds</div>
                  </div>
                </div>
              </div>
              <div className="ml-[22px] sm:ml-7 border-l border-white/[0.08] pl-6 sm:pl-8 py-2">
                <div className="text-[12px] sm:text-[13px] text-[#52525B] font-medium">Smart Retry scheduled (24h)</div>
              </div>
              <div className="flex items-center justify-between bg-[#09090B] border border-white/[0.12] rounded-[16px] p-4 sm:p-5 shadow-xl">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10B981]" />
                  </div>
                  <div>
                    <div className="text-[13px] sm:text-[14px] font-medium text-white">DVA Transfer Received</div>
                    <div className="text-[11px] sm:text-[12px] text-[#A1A1AA]">Wema Bank • 023456789</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:pl-12"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-6 border border-white/[0.08]">
              <Repeat className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-white mb-4">Dedicated Virtual Accounts</h3>
            <p className="text-[#A1A1AA] leading-relaxed text-base sm:text-[17px] mb-7">
              Cards fail. It's a reality. Every subscriber automatically receives a permanent bank account number so they can pay via transfer if their card fails.
            </p>
            <ul className="space-y-3.5 mb-7">
              {['Permanent virtual accounts per customer', 'Automated dunning email sequences', 'Intelligent retry timing'].map((item, i) => (
                <li key={i} className="flex items-center text-[#D4D4D8] text-[14px] sm:text-[15px] gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/[0.05] shrink-0 flex items-center justify-center">
                    <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="flex items-center gap-2 text-white text-[14px] sm:text-[15px] font-medium hover:text-[#A1A1AA] transition-colors group">
              Explore Dunning <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
