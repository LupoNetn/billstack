'use client';

import { motion } from 'framer-motion';

export function WorkflowSection() {
  const steps = [
    {
      num: '01',
      title: 'Integrate the API',
      desc: 'Connect Billstack in minutes. Create plans, manage customers, and generate checkout links with clean REST endpoints.',
    },
    {
      num: '02',
      title: 'Automate Collection',
      desc: 'We assign Dedicated Virtual Accounts and process card payments. Smart retries handle failures automatically.',
    },
    {
      num: '03',
      title: 'Route & Settle',
      desc: 'Define percentage or fixed splits. Revenue is instantly routed and settled to Nomba accounts — no reconciliation needed.',
    },
  ];

  return (
    <section id="workflow" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#000000] border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 sm:mb-24 max-w-2xl mx-auto px-2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-white mb-5"
          >
            How Billstack works.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#A1A1AA] text-base sm:text-lg leading-relaxed"
          >
            A streamlined lifecycle for recurring revenue.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 relative">
          {/* Connector line — desktop only */}
          <div className="hidden sm:block absolute top-12 left-[18%] right-[18%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col sm:items-center sm:text-center"
            >
              {/* Mobile step indicator */}
              <div className="flex items-center gap-4 mb-4 sm:flex-col sm:gap-0 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-[#050505] border border-white/[0.1] shadow-[0_0_40px_rgba(0,0,0,0.6)] flex items-center justify-center">
                  <span className="text-base sm:text-lg font-medium text-white">{step.num}</span>
                </div>
                {/* Mobile connecting line between steps */}
                {i < steps.length - 1 && (
                  <div className="sm:hidden w-px h-0 hidden" />
                )}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-medium text-white mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-[14px] sm:text-[15px] text-[#A1A1AA] leading-relaxed sm:max-w-xs">{step.desc}</p>
              </div>
              {/* Mobile vertical connector */}
              {i < steps.length - 1 && (
                <div className="sm:hidden mt-6 ml-8 w-px h-8 bg-white/[0.08]" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
