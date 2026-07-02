'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis } from 'recharts';
import { ArrowUpRight, Search, Bell, ChevronDown, Layers, CreditCard, Settings } from 'lucide-react';

const data = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5500 },
  { name: 'Thu', value: 4500 },
  { name: 'Fri', value: 7000 },
  { name: 'Sat', value: 6500 },
  { name: 'Sun', value: 8500 },
];

export function ProductPreview() {
  return (
    <section className="relative px-4 sm:px-6 -mt-16 sm:-mt-20 mb-28 sm:mb-40 max-w-6xl mx-auto z-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[20px] sm:rounded-[28px] border border-white/[0.08] bg-[#09090B] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden"
      >
        {/* Browser bar */}
        <div className="h-10 sm:h-12 bg-[#09090B] border-b border-white/[0.05] flex items-center justify-between px-4 sm:px-6">
          <div className="flex gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#EF4444]/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F59E0B]/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#10B981]/80" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4 text-[#71717A]">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        {/* Dashboard frame */}
        <div className="flex h-[300px] sm:h-[420px] lg:h-[500px] bg-[#000000]">
          {/* Sidebar — tablet+ */}
          <div className="w-44 sm:w-52 border-r border-white/[0.05] p-3 hidden sm:flex flex-col gap-1">
            <div className="px-3 py-2 mb-3 flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#6366F1] to-[#4F46E5]" />
              <span className="text-white font-medium text-[12px] sm:text-[13px]">Acme Corp</span>
              <ChevronDown className="w-3 h-3 text-[#71717A] ml-auto" />
            </div>
            <div className="text-[10px] font-semibold text-[#52525B] uppercase tracking-wider px-3 mb-1 mt-2">Overview</div>
            {[{ label: 'Home', active: true }, { label: 'Transactions', active: false }, { label: 'Customers', active: false }].map((item, i) => (
              <div key={i} className={`h-8 rounded-md px-3 flex items-center text-[12px] font-medium ${item.active ? 'bg-white/[0.06] text-white' : 'text-[#71717A]'}`}>
                {item.label}
              </div>
            ))}
            <div className="text-[10px] font-semibold text-[#52525B] uppercase tracking-wider px-3 mb-1 mt-4">Billing</div>
            {[{ label: 'Subscriptions', icon: CreditCard }, { label: 'Split Config', icon: Layers }, { label: 'Settings', icon: Settings }].map((item, i) => (
              <div key={i} className="h-8 rounded-md px-3 flex items-center gap-2 text-[12px] font-medium text-[#71717A]">
                <item.icon className="w-3 h-3" /> {item.label}
              </div>
            ))}
          </div>

          {/* Main canvas */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#4F46E5]/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div>
                <h3 className="text-white text-base sm:text-lg font-medium tracking-tight mb-0.5">Overview</h3>
                <p className="text-[11px] sm:text-[13px] text-[#52525B]">Last 30 days</p>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-md px-2.5 py-1.5 text-[11px] sm:text-[13px] text-[#D4D4D8] cursor-pointer">
                Monthly <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
              {[
                { title: 'MRR', val: '₦4.2M', inc: '+8.4%' },
                { title: 'Subscribers', val: '1,429', inc: '+5.1%' },
                { title: 'Recovered', val: '₦840K', inc: '+22%' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="bg-[#09090B] border border-white/[0.07] rounded-xl p-3 sm:p-4"
                >
                  <div className="text-[10px] sm:text-[11px] text-[#52525B] font-medium mb-1">{stat.title}</div>
                  <div className="text-sm sm:text-xl font-semibold text-white tracking-tight">{stat.val}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                    <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">{stat.inc}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="bg-[#09090B] border border-white/[0.07] rounded-xl p-3 sm:p-5 flex-1"
              style={{ height: 'calc(100% - 170px)' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" stroke="#3F3F46" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                  <Line type="monotone" dataKey="value" stroke="#818CF8" strokeWidth={2} dot={false} animationDuration={2000} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
