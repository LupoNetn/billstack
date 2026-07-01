"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="relative py-24 bg-background overflow-hidden border-t border-border/50">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(79,70,229,0.15),transparent)]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Stop rebuilding billing.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Focus on your product. We'll handle subscriptions, DVA routing, and revenue recovery.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Read Docs</Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
