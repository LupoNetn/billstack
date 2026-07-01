"use client"

import { motion } from "framer-motion"

const steps = [
  {
    step: "01",
    title: "Create a Plan",
    description: "Define your pricing model—flat rate, tiered, or usage-based—with flexible billing intervals.",
  },
  {
    step: "02",
    title: "Subscribe Customers",
    description: "Tokenize customer cards or automatically assign a Dedicated Virtual Account (DVA) for seamless payments.",
  },
  {
    step: "03",
    title: "Collect Revenue Automatically",
    description: "Our infrastructure handles recurring charges, intelligent dunning, and automatic DVA fallback.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A simple, robust integration flow that gets you to revenue faster.
          </p>
        </div>

        <div className="relative mt-20 max-w-5xl mx-auto">
          {/* Connector Line */}
          <div className="absolute top-12 left-0 right-0 hidden h-px bg-border md:block" />

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-card border-4 border-background text-2xl font-bold text-primary shadow-xl">
                    {item.step}
                  </div>
                  <h3 className="mt-8 text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
