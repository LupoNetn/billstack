'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'For developers building and testing.',
    features: ['50 active subscriptions', 'Basic dunning (3 retries)', 'Standard webhooks', 'Test & Live environments'],
    cta: 'Start for free',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '₦25,000',
    period: '/mo',
    desc: 'For scaling Nigerian SaaS businesses.',
    features: ['Unlimited subscriptions', 'Smart retry engine', 'Multi-Split routing', 'Dedicated virtual accounts', 'Priority support'],
    cta: 'Get started',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'For high-volume platforms.',
    features: ['Everything in Growth', 'Custom SLA', 'Dedicated account manager', 'Advanced analytics API'],
    cta: 'Talk to sales',
    highlight: false,
  },
];

export function PricingSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#000000] border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 sm:mb-20 px-2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-white mb-5"
          >
            Simple, transparent pricing.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#A1A1AA] text-base sm:text-lg"
          >
            Pay only for what you use. No hidden fees.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 items-start sm:items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`relative rounded-[20px] sm:rounded-[24px] p-7 sm:p-8 flex flex-col transition-all duration-300 ${
                plan.highlight
                  ? 'bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_30px_70px_-20px_rgba(255,255,255,0.12)] sm:-my-6 sm:py-14'
                  : `bg-[#050505] border border-white/[0.08] ${hovered === i ? 'border-white/[0.15]' : ''}`
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-black text-white text-[11px] font-semibold px-4 py-1.5 rounded-full border border-white/[0.15]">
                    Most popular
                  </div>
                </div>
              )}

              <div className="mb-7 sm:mb-8">
                <h3 className={`text-[14px] font-semibold mb-4 ${plan.highlight ? 'text-black/60' : 'text-[#A1A1AA]'}`}>{plan.name}</h3>
                <div className="flex items-end gap-1 mb-3">
                  <span className={`text-4xl sm:text-5xl font-semibold tracking-tight ${plan.highlight ? 'text-black' : 'text-white'}`}>{plan.price}</span>
                  {plan.period && <span className={`mb-2 text-[14px] ${plan.highlight ? 'text-black/50' : 'text-[#71717A]'}`}>{plan.period}</span>}
                </div>
                <p className={`text-[13px] sm:text-[14px] leading-relaxed ${plan.highlight ? 'text-black/60' : 'text-[#71717A]'}`}>{plan.desc}</p>
              </div>

              <ul className="space-y-3.5 flex-1 mb-7 sm:mb-8">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-3 text-[13px] sm:text-[14px]">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? 'text-black/70' : 'text-[#71717A]'}`} />
                    <span className={plan.highlight ? 'text-black/70' : 'text-[#D4D4D8]'}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/register" className="w-full">
                <button className={`w-full rounded-full py-3.5 sm:py-4 font-semibold text-[14px] sm:text-[15px] transition-all ${
                  plan.highlight
                    ? 'bg-black hover:bg-[#111111] text-white'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08]'
                }`}>
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
