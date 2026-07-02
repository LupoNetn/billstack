'use client';

import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

const codeSnippet = `const billstack = require('billstack')('bsk_live_...');

// Create a subscription with split routing
const subscription = await billstack.subscriptions.create({
  customer: 'cus_9s8d7f6g5h4j',
  plan: 'pln_pro_monthly',
  payment_method: 'dva',
  split_rules: [
    {
      account_id: 'acct_agent_123',
      percentage: 15
    }
  ]
});`;

export function DeveloperSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developers" className="py-32 px-6 bg-[#000000] relative overflow-hidden border-t border-white/[0.05]">
      {/* Background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366F1]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-white mb-6">
            Developer first.
          </h2>
          <p className="text-lg text-[#A1A1AA] mb-10 leading-relaxed max-w-lg">
            A powerful, composable REST API built in Go. Integrate subscription infrastructure into your Next.js, Node, or Go application with predictable endpoints and idempotent requests.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="border-l border-white/[0.1] pl-5">
              <h4 className="text-white font-medium mb-2 text-[15px]">RESTful & Predictable</h4>
              <p className="text-[#71717A] text-[14px] leading-relaxed">Clean JSON responses and standard HTTP codes make integration seamless.</p>
            </div>
            <div className="border-l border-white/[0.1] pl-5">
              <h4 className="text-white font-medium mb-2 text-[15px]">Idempotency</h4>
              <p className="text-[#71717A] text-[14px] leading-relaxed">Safely retry network requests without accidentally double-charging customers.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[20px] border border-white/[0.08] bg-[#050505] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 bg-[#09090B] border-b border-white/[0.05]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3F3F46]" />
              <div className="w-3 h-3 rounded-full bg-[#3F3F46]" />
              <div className="w-3 h-3 rounded-full bg-[#3F3F46]" />
            </div>
            <span className="text-[12px] text-[#71717A] font-mono tracking-wide">create_subscription.js</span>
            <button 
              onClick={handleCopy}
              className="text-[#71717A] hover:text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="p-6 md:p-8 overflow-x-auto text-[13px] md:text-[14px] font-mono leading-relaxed bg-[#050505]">
            <pre className="text-[#E4E4E7]">
              <span className="text-[#F47067]">const</span> billstack <span className="text-[#F47067]">=</span> <span className="text-[#DCCAFC]">require</span>(<span className="text-[#96D0FF]">'billstack'</span>)(<span className="text-[#96D0FF]">'bsk_live_...'</span>);
              <br/><br/>
              <span className="text-[#71717A] italic">// Create a subscription with split routing</span><br/>
              <span className="text-[#F47067]">const</span> subscription <span className="text-[#F47067]">= await</span> billstack.subscriptions.<span className="text-[#DCCAFC]">create</span>({'{'}
              <br/>
              {'  '}customer: <span className="text-[#96D0FF]">'cus_9s8d7f6g5h4j'</span>,
              <br/>
              {'  '}plan: <span className="text-[#96D0FF]">'pln_pro_monthly'</span>,
              <br/>
              {'  '}payment_method: <span className="text-[#96D0FF]">'dva'</span>,
              <br/>
              {'  '}split_rules: [{'{'}
              <br/>
              {'    '}account_id: <span className="text-[#96D0FF]">'acct_agent_123'</span>,
              <br/>
              {'    '}percentage: <span className="text-[#79C0FF]">15</span>
              <br/>
              {'  }'}]
              <br/>
              {'}'});
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
