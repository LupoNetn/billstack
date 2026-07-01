'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Code2, Globe2, ShieldCheck, Zap, ChevronRight, BarChart3, Repeat, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#5B21B6] selection:text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-[#0A0A0A]/80 backdrop-blur-md border-white/10 py-3' : 'bg-transparent border-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center shadow-lg shadow-[#5B21B6]/20">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Billstack</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="#products" className="hover:text-white transition-colors">Products</Link>
            <Link href="#developers" className="hover:text-white transition-colors">Developers</Link>
            <Link href="#company" className="hover:text-white transition-colors">Company</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link href="/register">
              <Button className="bg-white text-[#0A0A0A] hover:bg-gray-200 rounded-full px-5 font-semibold transition-all">
                Start building <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5B21B6]/20 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-[#A78BFA] mb-8 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="flex h-2 w-2 rounded-full bg-[#A78BFA] animate-pulse"></span>
            Introducing Multi-Split Routing API <ChevronRight className="w-3 h-3" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8 leading-[1.1] max-w-4xl mx-auto">
            The subscription infrastructure for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]">Nigerian SaaS</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Billstack handles the complexities of recurring billing, dunning, and payment routing so you can focus on building your product. Accept payments via cards, transfers, and DVAs instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button className="bg-[#5B21B6] hover:bg-[#7C3AED] text-white rounded-full px-8 py-6 text-base font-semibold shadow-[0_0_40px_rgba(91,33,182,0.4)] transition-all hover:scale-105">
                Create an account
              </Button>
            </Link>
            <Link href="#contact">
              <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base font-semibold transition-all">
                Contact sales
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 relative bg-[#0A0A0A]">
            <div className="h-8 bg-[#171717] border-b border-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            {/* Faux Dashboard UI */}
            <div className="p-8 grid grid-cols-4 gap-6 bg-[#0A0A0A]">
              <div className="col-span-1 space-y-4">
                <div className="h-6 w-24 bg-white/10 rounded" />
                <div className="h-4 w-32 bg-white/5 rounded" />
                <div className="h-4 w-28 bg-white/5 rounded" />
                <div className="h-4 w-36 bg-white/5 rounded" />
              </div>
              <div className="col-span-3 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1 h-32 bg-white/5 rounded-xl border border-white/10 p-5 flex flex-col justify-end">
                    <div className="h-8 w-32 bg-gradient-to-r from-[#7C3AED] to-transparent rounded" />
                  </div>
                  <div className="flex-1 h-32 bg-white/5 rounded-xl border border-white/10 p-5 flex flex-col justify-end">
                    <div className="h-8 w-24 bg-white/20 rounded" />
                  </div>
                  <div className="flex-1 h-32 bg-white/5 rounded-xl border border-white/10 p-5 flex flex-col justify-end">
                    <div className="h-8 w-28 bg-white/20 rounded" />
                  </div>
                </div>
                <div className="h-64 bg-white/5 rounded-xl border border-white/10 p-6 relative overflow-hidden">
                  {/* Faux chart lines */}
                  <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,100 L0,80 Q25,60 50,70 T100,20 L100,100 Z" fill="url(#grad)" opacity="0.2" />
                    <path d="M0,80 Q25,60 50,70 T100,20" fill="none" stroke="#A78BFA" strokeWidth="2" />
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-t border-b border-white/5 bg-[#0D0D0D] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '₦0 →∞', label: 'Revenue processed' },
              { value: '< 200ms', label: 'API response time' },
              { value: '99.9%', label: 'Platform uptime' },
              { value: '4 steps', label: 'To go live' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white tabular-nums mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">Go live in minutes.</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            No payment processing setup. No bank integration headaches. Just clean, composable APIs.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[#5B21B6]/50 to-transparent" />
          {[
            { step: '01', title: 'Create an account', desc: 'Sign up and complete your merchant profile in under 2 minutes.' },
            { step: '02', title: 'Build your plans', desc: 'Define flat-rate or tiered pricing plans with flexible billing cadences.' },
            { step: '03', title: 'Integrate the API', desc: 'Use your API key to create subscriptions from your backend.' },
            { step: '04', title: 'Automate & grow', desc: 'Let Billstack handle renewals, retries, and routing automatically.' },
          ].map((step, i) => (
            <div key={i} className="relative text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-[#111111] border border-white/10 flex flex-col items-center justify-center mb-6 z-10 relative group hover:border-[#5B21B6]/50 hover:bg-[#151515] transition-all">
                <span className="text-[10px] font-bold text-[#5B21B6] tracking-widest mb-0.5">{step.step}</span>
                <div className="w-6 h-px bg-[#5B21B6]/50" />
              </div>
              <h4 className="font-semibold text-white mb-2">{step.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="products" className="py-24 px-6 bg-black relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              A fully integrated suite for recurring revenue.
            </h2>
            <p className="text-lg text-gray-400">
              We abstracted away the complexities of Nigerian payments, bank transfers, and dunning so you can build billing flows in minutes, not months.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#111111] border border-white/10 p-8 rounded-2xl hover:bg-[#151515] transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Repeat className="w-6 h-6 text-[#A78BFA]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Retries & Dunning</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Recover lost revenue with ML-powered retry logic tailored to Nigerian salary cycles. We automatically handle failed card charges safely.
              </p>
            </div>
            
            <div className="bg-[#111111] border border-white/10 p-8 rounded-2xl hover:bg-[#151515] transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-[#A78BFA]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Multi-Split Routing</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Split subscription revenue instantly between your platform, agents, and merchants using percentages or fixed amounts via Nomba.
              </p>
            </div>

            <div className="bg-[#111111] border border-white/10 p-8 rounded-2xl hover:bg-[#151515] transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe2 className="w-6 h-6 text-[#A78BFA]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Dedicated Virtual Accounts</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Give every subscriber their own permanent bank account number for seamless, automated subscription renewals without cards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section id="developers" className="py-24 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5B21B6]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Designed for developers.
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              A powerful, composable API built on Go. Integrate subscription infrastructure into your Next.js, Node, or Go application with just a few lines of code.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">RESTful & Predictable</h4>
                  <p className="text-gray-400 text-sm">Clean JSON responses and standard HTTP codes.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Idempotent Requests</h4>
                  <p className="text-gray-400 text-sm">Safely retry network requests without double-charging.</p>
                </div>
              </div>
            </div>
            
            <Button variant="link" className="text-[#A78BFA] hover:text-white p-0 mt-8 group">
              Read the documentation <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          {/* Code Window */}
          <div className="rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#111111] border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-xs text-gray-500 font-mono">create_subscription.js</span>
            </div>
            <div className="p-6 text-sm font-mono leading-relaxed overflow-x-auto">
              <span className="text-[#F47067]">const</span> <span className="text-[#D1D5DB]">billstack</span> <span className="text-[#F47067]">=</span> <span className="text-[#DCCAFC]">require</span><span className="text-[#D1D5DB]">(</span><span className="text-[#96D0FF]">'billstack'</span><span className="text-[#D1D5DB]">)(</span><span className="text-[#96D0FF]">'bsk_live_...'</span><span className="text-[#D1D5DB]">);</span>
              <br/><br/>
              <span className="text-[#F47067]">const</span> <span className="text-[#D1D5DB]">subscription</span> <span className="text-[#F47067]">=</span> <span className="text-[#F47067]">await</span> <span className="text-[#D1D5DB]">billstack.subscriptions.</span><span className="text-[#DCCAFC]">create</span><span className="text-[#D1D5DB]">({'{'}</span>
              <br/>
              <span className="text-[#D1D5DB]">  customer: </span><span className="text-[#96D0FF]">'cus_9s8d7f6g5h4j'</span><span className="text-[#D1D5DB]">,</span>
              <br/>
              <span className="text-[#D1D5DB]">  plan: </span><span className="text-[#96D0FF]">'pln_pro_monthly'</span><span className="text-[#D1D5DB]">,</span>
              <br/>
              <span className="text-[#D1D5DB]">  payment_method: </span><span className="text-[#96D0FF]">'dva'</span><span className="text-[#D1D5DB]">,</span>
              <br/>
              <span className="text-[#D1D5DB]">  split_rules: [{'{'}</span>
              <br/>
              <span className="text-[#D1D5DB]">    account_id: </span><span className="text-[#96D0FF]">'acct_agent_123'</span><span className="text-[#D1D5DB]">,</span>
              <br/>
              <span className="text-[#D1D5DB]">    percentage: </span><span className="text-[#79C0FF]">15</span>
              <br/>
              <span className="text-[#D1D5DB]">  {'}'}]</span>
              <br/>
              <span className="text-[#D1D5DB]">{'}'});</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">Transparent pricing.</h2>
            <p className="text-gray-400 text-lg">Pay only for what you use. No hidden fees, no surprises.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: 'Free',
                desc: 'Perfect for validating your idea.',
                features: ['Up to 10 active subscriptions', 'Basic dunning (3 retries)', 'Webhook events', 'Test & Live environments'],
                cta: 'Start free',
                highlight: false,
              },
              {
                name: 'Growth',
                price: '₦25,000',
                period: '/mo',
                desc: 'Built for scaling Nigerian SaaS businesses.',
                features: ['Unlimited subscriptions', 'Smart retry engine', 'Multi-Split routing', 'Dedicated virtual accounts', 'Priority support'],
                cta: 'Get started',
                highlight: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                desc: 'For high-volume platforms and aggregators.',
                features: ['Everything in Growth', 'Custom SLA', 'Dedicated account manager', 'On-prem deployment option', 'Advanced analytics API'],
                cta: 'Talk to sales',
                highlight: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 border flex flex-col ${plan.highlight
                  ? 'bg-gradient-to-b from-[#1e0a3c] to-[#0D0D0D] border-[#5B21B6]/50 shadow-[0_0_60px_rgba(91,33,182,0.2)]'
                  : 'bg-[#111111] border-white/10'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#5B21B6] text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-400 mb-1">{plan.period}</span>}
                  </div>
                  <p className="text-gray-400 text-sm">{plan.desc}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#A78BFA] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button className={`w-full rounded-full font-semibold transition-all ${plan.highlight
                    ? 'bg-[#5B21B6] hover:bg-[#7C3AED] text-white shadow-lg shadow-[#5B21B6]/30'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">Built for founders who ship.</h2>
            <p className="text-gray-400">See what early adopters are saying.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "We went from zero billing infrastructure to fully automated subscriptions in a weekend. Billstack just works.",
                name: "Tobi Oluwaseun",
                title: "CTO, PayNaira",
                initials: "TO",
              },
              {
                quote: "The DVA integration completely eliminated failed payments from bank transfer subscribers. Revenue recovery improved by 40%.",
                name: "Chioma Eze",
                title: "Founder, SchoolBridge",
                initials: "CE",
              },
              {
                quote: "Split routing for our agent network used to require custom code. Now it's a one-time configuration in the dashboard.",
                name: "Emeka Obi",
                title: "Head of Engineering, AgentPay",
                initials: "EO",
              },
            ].map((t, i) => (
              <div key={i} className="bg-[#111111] border border-white/10 p-8 rounded-2xl flex flex-col gap-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <svg key={si} className="w-4 h-4 text-[#A78BFA]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#5B21B6]/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to scale your recurring revenue?</h2>
          <p className="text-gray-400 mb-10 text-lg">Join forward-thinking Nigerian startups building on Billstack.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-white text-[#0A0A0A] hover:bg-gray-200 rounded-full px-8 py-6 text-base font-semibold shadow-lg transition-transform hover:scale-105">
                Start building for free
              </Button>
            </Link>
            <Link href="#contact">
              <Button variant="outline" className="bg-[#111111] border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base font-semibold transition-all">
                Talk to an expert
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-white">Billstack</span>
            <span className="text-sm">© 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
