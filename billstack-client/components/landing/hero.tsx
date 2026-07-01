"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#2D2D35_1px,transparent_1px),linear-gradient(to_bottom,#2D2D35_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"
      />
      <div className="absolute inset-0 z-0 bg-background [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,transparent_20%,black_100%)]" />

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[100px]"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-success/10 blur-[100px]"
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-muted-foreground"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Built on Nomba • Infrastructure Track
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              The subscription billing layer{" "}
              <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                Nigerian SaaS
              </span>{" "}
              was missing.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              One API integration. Recurring billing, intelligent dunning, DVA payments, and revenue intelligence — built for how Nigerian customers actually pay.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button size="lg">Get Started</Button>
            <Button variant="ghost" size="lg">View Documentation</Button>
          </motion.div>

          {/* Code Snippet Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 w-full max-w-3xl rounded-xl border border-border bg-[#0a0a0a] shadow-2xl overflow-hidden text-left"
          >
            <div className="flex items-center px-4 py-3 border-b border-border/50 bg-[#1A1A1F]">
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-danger"></div>
                <div className="h-3 w-3 rounded-full bg-warning"></div>
                <div className="h-3 w-3 rounded-full bg-success"></div>
              </div>
              <div className="ml-4 flex-1 text-center font-mono text-xs text-muted-foreground">
                create-subscription.ts
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed text-[#A1A1AA]">
                <code>
                  <span className="text-[#4F46E5]">import</span> {"{ Noitrex }"} <span className="text-[#4F46E5]">from</span> <span className="text-success">"@noitrex/node"</span>;{"\n\n"}
                  <span className="text-[#4F46E5]">const</span> noitrex = <span className="text-[#4F46E5]">new</span> Noitrex(process.env.<span className="text-foreground">NOITREX_SECRET_KEY</span>);{"\n\n"}
                  <span className="text-muted">// Create a subscription with automatic DVA fallback</span>{"\n"}
                  <span className="text-[#4F46E5]">const</span> subscription = <span className="text-[#4F46E5]">await</span> noitrex.subscriptions.<span className="text-foreground">create</span>({"{"}{"\n"}
                  customer: <span className="text-success">"cus_9s8f7d6f5g4"</span>,{"\n"}
                  plan: <span className="text-success">"plan_premium_monthly"</span>,{"\n"}
                  payment_methods: [<span className="text-success">"card"</span>, <span className="text-success">"dva"</span>],{"\n"}
                  dunning_strategy: <span className="text-success">"nigerian_salary_optimized"</span>{"\n"}
                  {"}"});{"\n\n"}
                  console.<span className="text-foreground">log</span>(subscription.status); <span className="text-muted">// 'active'</span>
                </code>
              </pre>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
