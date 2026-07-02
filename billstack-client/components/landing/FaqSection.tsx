'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'How does Multi-Split Routing work?',
    answer:
      'You define percentage or fixed-amount splits for any subscription plan. When a payment succeeds, funds are immediately routed to the specified Nomba accounts — no manual reconciliation needed.',
  },
  {
    question: 'Are Dedicated Virtual Accounts permanent?',
    answer:
      'Yes. Once a customer is created in Billstack, they receive a unique, permanent virtual account number. They can use this to pay for subscriptions at any time via bank transfer.',
  },
  {
    question: 'How are failed card payments handled?',
    answer:
      'Our intelligent dunning system automatically retries failed payments on an optimized schedule. If a card fails, the customer is notified with their DVA details to complete payment via transfer.',
  },
  {
    question: 'How difficult is the API integration?',
    answer:
      'Integration is designed to be completed in hours. We provide RESTful endpoints with clean JSON responses, idempotent requests to prevent double-charging, and webhook support for every event.',
  },
  {
    question: 'Can I customize the billing cadence?',
    answer:
      'Yes. Billstack supports monthly, annual, and custom billing intervals. You can also define trial periods and setup fees on a per-plan basis.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#000000] border-t border-white/[0.05]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 px-2"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-white mb-4">
            Frequently asked questions
          </h2>
          <p className="text-[#A1A1AA] text-base sm:text-lg">
            Everything you need to know about Billstack.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="border border-white/[0.08] bg-[#050505] rounded-[18px] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors gap-4"
                >
                  <span className="text-[14px] sm:text-[15px] font-medium text-white leading-snug">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#71717A] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-[#A1A1AA] text-[13px] sm:text-[14px] leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
