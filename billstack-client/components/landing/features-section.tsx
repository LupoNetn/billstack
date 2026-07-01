"use client"

import { motion } from "framer-motion"
import { CreditCard, CalendarClock, LineChart, Layers, GitMerge, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Dual Payment Architecture",
    description: "Card tokenization plus seamless DVA fallback. Treat bank transfers as a first-class recurring payment method.",
    icon: CreditCard,
  },
  {
    title: "Nigerian-Aware Dunning",
    description: "Insufficient funds? We schedule retries around the 27th—salary day—instead of arbitrary 24-hour intervals.",
    icon: CalendarClock,
  },
  {
    title: "Revenue Forecasting",
    description: "30-day projected cash flow calculated from your renewal schedule, weighted by historical payment success.",
    icon: LineChart,
  },
  {
    title: "Tiered Pricing Engine",
    description: "Define volume tiers, usage-based billing, and complex pricing models with zero additional backend logic.",
    icon: Layers,
  },
  {
    title: "Multi-Split Routing",
    description: "Automate revenue sharing, agent commissions, and platform fees at transaction time using native split primitives.",
    icon: GitMerge,
  },
  {
    title: "Subscription Health Scores",
    description: "Predict churn before it happens. Every subscription is scored nightly based on payment history and behavioral signals.",
    icon: Activity,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Infrastructure-grade features
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to build and scale your subscription revenue engine, ready on day one.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/50 transition-colors bg-card hover:bg-elevated/50 group">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
