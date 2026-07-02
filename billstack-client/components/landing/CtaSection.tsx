'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CtaSection() {
  return (
    <section className="py-32 sm:py-40 px-4 sm:px-6 relative overflow-hidden bg-[#000000] border-t border-white/[0.05]">
      {/* Spotlight glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 px-2">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-semibold tracking-[-0.03em] text-white mb-7 leading-[1.04]"
          style={{ fontSize: 'clamp(36px, 7vw, 80px)' }}
        >
          Start building your
          <br />
          <span
            className="text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #818CF8 0%, #C4B5FD 35%, #93C5FD 65%, #6EE7B7 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            billing stack today.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#A1A1AA] mb-10 text-base sm:text-xl max-w-xl mx-auto leading-relaxed"
        >
          Create your account, integrate the API, and go live — all in the same day.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-white hover:bg-[#F0F0F0] text-black font-semibold text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-full transition-all hover:scale-[1.02] shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_10px_50px_-10px_rgba(255,255,255,0.3)]">
              Get started for free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
