"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const tiers = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for new projects and small startups validating their idea.",
    features: [
      "Up to 50 subscriptions",
      "Card payments",
      "Basic analytics",
      "Community support",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "5%",
    priceSuffix: "platform fee",
    description: "For scaling businesses that need DVA routing and smart dunning.",
    features: [
      "Unlimited subscriptions",
      "DVA support & routing",
      "Revenue forecasting",
      "Smart dunning (Salary-optimized)",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Scale",
    price: "Custom",
    description: "Enterprise-grade infrastructure for high-volume SaaS platforms.",
    features: [
      "Custom platform fee",
      "Dedicated support channel",
      "99.99% SLA guarantee",
      "Custom integrations",
      "Onboarding specialist",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start for free. Scale with a simple revenue share that only grows when you do.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <Card className={`h-full flex flex-col ${tier.highlighted ? "border-primary shadow-[0_0_30px_rgba(79,70,229,0.15)] bg-elevated/50" : "border-border/50 bg-card"}`}>
                {tier.highlighted && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                    <Badge className="bg-primary text-white border-none px-3 py-0.5">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription className="min-h-[40px]">{tier.description}</CardDescription>
                  <div className="mt-4 flex items-baseline text-4xl font-bold text-foreground">
                    {tier.price}
                    {tier.priceSuffix && (
                      <span className="ml-1 text-sm font-medium text-muted-foreground">
                        {tier.priceSuffix}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 shrink-0 text-primary mr-2" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={tier.highlighted ? "default" : "outline"}
                    size="lg"
                  >
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
