"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export function CodeExampleSection() {
  const [activeTab, setActiveTab] = useState<"node" | "curl">("node")

  return (
    <section className="py-24 bg-[#0a0a0a] overflow-hidden border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Developer-first API
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A meticulously designed API that abstracts away the complexity of Nigerian payment edge cases. Strongly typed SDKs, predictable errors, and webhook primitives built for scale.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-muted-foreground">Automatic Idempotency</p>
              </div>
              <div className="flex items-start">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-muted-foreground">100% test coverage with simulation endpoints</p>
              </div>
              <div className="flex items-start">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-muted-foreground">OpenAPI specs & native TypeScript types</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full max-w-2xl"
          >
            <div className="rounded-xl border border-border bg-[#1A1A1F] shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-[#242429]">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab("node")}
                    className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${activeTab === "node" ? "bg-primary text-white" : "text-muted-foreground hover:bg-elevated hover:text-foreground"
                      }`}
                  >
                    Node.js
                  </button>
                  <button
                    onClick={() => setActiveTab("curl")}
                    className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${activeTab === "curl" ? "bg-primary text-white" : "text-muted-foreground hover:bg-elevated hover:text-foreground"
                      }`}
                  >
                    cURL
                  </button>
                </div>
                <div className="flex space-x-1.5">
                  <div className="h-3 w-3 rounded-full bg-danger"></div>
                  <div className="h-3 w-3 rounded-full bg-warning"></div>
                  <div className="h-3 w-3 rounded-full bg-success"></div>
                </div>
              </div>
              <div className="p-6 overflow-x-auto h-[320px] bg-[#0a0a0a]">
                <pre className="font-mono text-sm leading-relaxed text-[#A1A1AA]">
                  {activeTab === "node" ? (
                    <code>
                      <span className="text-muted">// Subscribe a customer to a tiered plan</span>{"\n"}
                      <span className="text-[#4F46E5]">const</span> subscription = <span className="text-[#4F46E5]">await</span> noitrex.subscriptions.<span className="text-foreground">create</span>({"{"}{"\n"}
                      customer: <span className="text-success">"cus_01HTJ9ZK8R"</span>,{"\n"}
                      plan: <span className="text-success">"plan_api_tiered"</span>,{"\n"}
                      payment_behavior: <span className="text-success">"default_incomplete"</span>,{"\n"}
                      collection_method: <span className="text-success">"charge_automatically"</span>,{"\n"}
                      metadata: {"{"}{"\n"}
                      internal_org_id: <span className="text-success">"org_9942"</span>{"\n"}
                      {"}"}{"\n"}
                      {"}"});{"\n\n"}
                      <span className="text-muted">// Record usage for the current period</span>{"\n"}
                      <span className="text-[#4F46E5]">await</span> noitrex.subscriptions.<span className="text-foreground">recordUsage</span>(subscription.id, {"{"}{"\n"}
                      action: <span className="text-success">"increment"</span>,{"\n"}
                      quantity: <span className="text-warning">1500</span>,{"\n"}
                      timestamp: Math.<span className="text-foreground">floor</span>(Date.<span className="text-foreground">now</span>() / <span className="text-warning">1000</span>){"\n"}
                      {"}"});
                    </code>
                  ) : (
                    <code>
                      <span className="text-muted"># Subscribe a customer to a tiered plan</span>{"\n"}
                      <span className="text-[#4F46E5]">curl</span> https://api.noitrex.dev/v1/subscriptions \{"\n"}
                      <span className="text-[#4F46E5]">-H</span> <span className="text-success">"Authorization: Bearer sk_live_..."</span> \{"\n"}
                      <span className="text-[#4F46E5]">-H</span> <span className="text-success">"Content-Type: application/json"</span> \{"\n"}
                      <span className="text-[#4F46E5]">-d</span> <span className="text-success">'{`{
  "customer": "cus_01HTJ9ZK8R",
  "plan": "plan_api_tiered",
  "payment_behavior": "default_incomplete",
  "collection_method": "charge_automatically"
}`}</span>{"\n\n"}
                      <span className="text-muted"># Response</span>{"\n"}
                      {"{"}{"\n"}
                      <span className="text-foreground">"id"</span>: <span className="text-success">"sub_01HVK1XY9M"</span>,{"\n"}
                      <span className="text-foreground">"status"</span>: <span className="text-success">"incomplete"</span>,{"\n"}
                      <span className="text-foreground">"current_period_end"</span>: <span className="text-warning">1716383633</span>{"\n"}
                      {"}"}
                    </code>
                  )}
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
