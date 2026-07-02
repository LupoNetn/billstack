'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

const navigation = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'FAQ', href: '#faq' },
  ],
  developers: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Status', href: '#' },
    { label: 'GitHub', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="px-6 bg-[#000000] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5 group inline-flex">
              <div className="w-7 h-7 rounded-[8px] bg-white flex items-center justify-center transition-transform group-hover:scale-105">
                <Zap className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="font-semibold text-base tracking-tight text-white">Billstack</span>
            </Link>
            <p className="text-[#71717A] text-[13px] leading-relaxed max-w-[200px]">
              Subscription infrastructure engineered for modern African SaaS.
            </p>
          </div>

          {/* Nav Columns */}
          <div>
            <h4 className="text-white font-medium mb-5 text-[13px] tracking-wide">Product</h4>
            <ul className="space-y-3.5">
              {navigation.product.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#71717A] hover:text-white text-[13px] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-5 text-[13px] tracking-wide">Developers</h4>
            <ul className="space-y-3.5">
              {navigation.developers.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#71717A] hover:text-white text-[13px] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-5 text-[13px] tracking-wide">Company</h4>
            <ul className="space-y-3.5">
              {navigation.company.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#71717A] hover:text-white text-[13px] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-5 text-[13px] tracking-wide">Legal</h4>
            <ul className="space-y-3.5">
              {navigation.legal.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#71717A] hover:text-white text-[13px] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#52525B] text-[13px]">
            © {new Date().getFullYear()} Billstack. All rights reserved.
          </p>
          <p className="text-[#52525B] text-[13px]">
            Built on the <span className="text-[#A1A1AA]">Nomba API</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
