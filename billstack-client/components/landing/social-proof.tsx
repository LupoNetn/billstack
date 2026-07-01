"use client"

import { motion } from "framer-motion"
import { BookOpen, CreditCard, Video, Users, MessageSquare, ShoppingBag } from "lucide-react"

const industries = [
  { name: "EdTech", icon: BookOpen },
  { name: "FinTech", icon: CreditCard },
  { name: "Creator Platforms", icon: Video },
  { name: "Membership Businesses", icon: Users },
  { name: "Communities", icon: MessageSquare },
  { name: "Marketplaces", icon: ShoppingBag },
]

export function SocialProof() {
  return (
    <section className="py-24 bg-background border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-foreground">
            Built for modern Nigerian SaaS
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {industries.map((industry, index) => {
            const Icon = industry.icon
            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-6 rounded-xl border border-border bg-card hover:bg-elevated transition-colors"
              >
                <Icon className="h-8 w-8 text-muted-foreground mb-3" />
                <span className="text-sm font-medium text-muted-foreground text-center">
                  {industry.name}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
