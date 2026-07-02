'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#000000]/60 backdrop-blur-xl border-b border-white/[0.05] py-4'
          : 'bg-transparent border-b border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-[8px] bg-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
            <Zap className="w-4 h-4 text-black fill-black" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">Billstack</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#A1A1AA]">
          <Link href="#workflow" className="hover:text-white transition-colors">Workflow</Link>
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#developers" className="hover:text-white transition-colors">Developers</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-[14px] font-medium text-[#A1A1AA] hover:text-white transition-colors">
            Sign in
          </Link>
          <Link href="/register">
            <button className="bg-white hover:bg-[#F4F4F5] text-black rounded-full px-5 h-9 font-medium text-[13px] transition-all">
              Start building
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/[0.08] text-[#A1A1AA] hover:text-white hover:bg-white/[0.04] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden absolute top-full left-0 w-full bg-[#030303]/95 backdrop-blur-xl border-b border-white/[0.05] shadow-2xl"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {['#workflow', '#features', '#developers', '#pricing', '#faq'].map((href, i) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[15px] font-medium text-[#A1A1AA] hover:text-white px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors capitalize"
                >
                  {href.replace('#', '')}
                </Link>
              ))}
              <div className="h-px bg-white/[0.05] my-2 mx-4" />
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-[15px] font-medium text-[#A1A1AA] hover:text-white px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors">
                Sign in
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="mt-1">
                <button className="w-full bg-white text-black font-semibold text-[15px] py-3 rounded-xl">
                  Start building free
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
