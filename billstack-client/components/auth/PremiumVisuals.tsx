// ── Premium Visual Elements (Charts, Code Snippets, Payment Cards) ─────────────

'use client';

import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, Zap, Code, CheckCircle, ArrowUpRight } from 'lucide-react';

export function FloatingPaymentCard() {
  return (
    <motion.div
      className="relative w-72 h-44 rounded-2xl bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] p-6 shadow-2xl"
      animate={{
        y: [0, -10, 0],
        rotate: [0, 2, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
      <div className="relative h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-white fill-white" />
            <span className="text-white font-semibold tracking-tight">Billstack</span>
          </div>
          <CreditCard className="w-5 h-5 text-white/60" />
        </div>
        <div>
          <p className="text-white/60 text-xs mb-1">Balance</p>
          <p className="text-white text-2xl font-semibold tracking-tight">$124,592.00</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-white/60 text-xs">•••• 4289</p>
          <p className="text-white/80 text-xs">12/28</p>
        </div>
      </div>
    </motion.div>
  );
}

export function MiniChart() {
  return (
    <motion.div
      className="w-full h-24 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <svg className="w-full h-full" viewBox="0 0 200 60" fill="none">
        <motion.path
          d="M0 50 Q30 45 50 35 T100 25 T150 30 T200 15"
          stroke="url(#gradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <motion.path
          d="M0 50 Q30 45 50 35 T100 25 T150 30 T200 15 L200 60 L0 60 Z"
          fill="url(#gradientFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1 }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5B21B6" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="gradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5B21B6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-0 right-0 flex items-center gap-1 text-[#7C3AED]">
        <TrendingUp className="w-3 h-3" />
        <span className="text-xs font-medium">+24.5%</span>
      </div>
    </motion.div>
  );
}

export function CodeSnippet() {
  return (
    <motion.div
      className="bg-[#0A0A0B] rounded-xl p-4 border border-white/10 font-mono text-xs"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
      </div>
      <div className="space-y-1 text-[#A1A1AA]">
        <p><span className="text-[#7C3AED]">const</span> <span className="text-[#F472B6]">subscription</span> = <span className="text-[#7C3AED]">await</span></p>
        <p className="pl-4">billstack.<span className="text-[#60A5FA]">subscriptions</span>.<span className="text-[#60A5FA]">create</span>({`{`}</p>
        <p className="pl-8"><span className="text-[#A1A1AA]">plan:</span> <span className="text-[#34D399]">'pro_monthly'</span>,</p>
        <p className="pl-8"><span className="text-[#A1A1AA]">customer:</span> <span className="text-[#34D399]">'cus_123'</span></p>
        <p className="pl-4">{`}`});</p>
      </div>
    </motion.div>
  );
}

export function FeatureCard({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) {
  return (
    <motion.div
      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Icon className="w-5 h-5 text-[#7C3AED] mb-3" />
      <p className="text-white font-medium text-sm mb-1">{title}</p>
      <p className="text-white/60 text-xs">{description}</p>
    </motion.div>
  );
}

export function StatsRow() {
  const stats = [
    { label: 'Revenue', value: '$2.4M', change: '+12%' },
    { label: 'Subscriptions', value: '1,248', change: '+8%' },
    { label: 'Success Rate', value: '99.9%', change: '+0.2%' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="p-3 rounded-lg bg-white/5 border border-white/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        >
          <p className="text-white/60 text-xs mb-1">{stat.label}</p>
          <p className="text-white font-semibold text-sm">{stat.value}</p>
          <p className="text-[#34D399] text-xs flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            {stat.change}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export function SuccessNotification() {
  return (
    <motion.div
      className="flex items-center gap-3 p-3 rounded-lg bg-[#059669]/10 border border-[#059669]/20"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="w-8 h-8 rounded-full bg-[#059669]/20 flex items-center justify-center">
        <CheckCircle className="w-4 h-4 text-[#059669]" />
      </div>
      <div>
        <p className="text-white text-sm font-medium">Payment successful</p>
        <p className="text-white/60 text-xs">$49.00 from John Doe</p>
      </div>
    </motion.div>
  );
}
