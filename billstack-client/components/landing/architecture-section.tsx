"use client"

import { motion } from "framer-motion"
import { ArrowDown, Database, Server, CreditCard, Building, User } from "lucide-react"

export function ArchitectureSection() {
  return (
    <section className="py-24 bg-[#0a0a0a] border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Engineered for reliability
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A fault-tolerant payment routing architecture that ensures you never miss a billing cycle.
          </p>
        </div>

        <div className="mx-auto max-w-3xl relative">
          {/* Background grid */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#2D2D35_1px,transparent_1px),linear-gradient(to_bottom,#2D2D35_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_70%,transparent_100%)]" />

          <div className="relative z-10 flex flex-col items-center space-y-4 py-12">

            {/* Customer Node */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 rounded-lg border border-border bg-elevated px-6 py-4 shadow-lg w-64 justify-center"
            >
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="font-mono text-sm font-medium">Customer</span>
            </motion.div>

            {/* Arrow */}
            <AnimatedArrow delay={0.2} />

            {/* Noitrex Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative flex flex-col items-center rounded-xl border border-primary/50 bg-primary/10 p-8 shadow-[0_0_40px_rgba(79,70,229,0.15)] w-80 text-center"
            >
              <Server className="mb-3 h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Noitrex Engine</span>
              <span className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">Routing & Dunning</span>

              {/* Data streams */}
              <div className="absolute -left-12 top-1/2 h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
              <div className="absolute -right-12 top-1/2 h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
            </motion.div>

            {/* Fork Arrows */}
            <div className="flex w-64 justify-between relative h-16">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-px bg-border absolute left-8 top-0"
              />
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-px bg-border absolute right-8 top-0"
              />
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "calc(100% - 4rem)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="h-px bg-border absolute left-8 top-0"
              />
            </div>

            {/* Payment Methods Layer */}
            <div className="flex w-full max-w-md justify-between -mt-4 z-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="flex flex-col items-center space-y-2 rounded-lg border border-border bg-card px-4 py-4 w-40 text-center"
              >
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="font-mono text-xs">Card Token</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="flex flex-col items-center space-y-2 rounded-lg border border-border bg-card px-4 py-4 w-40 text-center"
              >
                <Database className="h-5 w-5 text-muted-foreground" />
                <span className="font-mono text-xs">Dedicated VA</span>
              </motion.div>
            </div>

            {/* Merge Arrows */}
            <div className="flex w-64 justify-between relative h-16 -mt-2">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="w-px bg-success/50 absolute left-8 bottom-0"
              />
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="w-px bg-success/50 absolute right-8 bottom-0"
              />
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "calc(100% - 4rem)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="h-px bg-success/50 absolute left-8 bottom-0"
              />
            </div>

            {/* Final Arrow */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: 32 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 1.1 }}
              className="w-px bg-success relative"
            >
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-success" />
            </motion.div>

            {/* Merchant Node */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.3 }}
              className="flex items-center space-x-3 rounded-lg border border-success/30 bg-success/10 px-6 py-4 shadow-lg w-64 justify-center z-10"
            >
              <Building className="h-5 w-5 text-success" />
              <span className="font-mono text-sm font-medium text-success">Merchant Account</span>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}

function AnimatedArrow({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      whileInView={{ height: 48, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="relative w-px bg-border"
    >
      <motion.div
        animate={{ y: [0, 48] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay }}
        className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-px bg-primary"
      />
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-border">
        <ArrowDown className="h-4 w-4" />
      </div>
    </motion.div>
  )
}
