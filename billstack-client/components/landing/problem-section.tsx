import { Blocks, AlertTriangle, EyeOff } from "lucide-react"

const problems = [
  {
    title: "The Rebuilding Problem",
    description: "Every Nigerian SaaS team rebuilds billing from scratch. Months of engineering on infrastructure that is not your core product.",
    icon: Blocks,
  },
  {
    title: "The Recovery Problem",
    description: "Cards decline. DVA transfers arrive late. Dunning engines retry at 2am instead of after salary day. Revenue leaks through failed payments and poor retry logic.",
    icon: AlertTriangle,
  },
  {
    title: "The Visibility Problem",
    description: "You know what you charged this month. You don't know what next month's revenue looks like, which customers are about to churn, or your liquidity.",
    icon: EyeOff,
  },
]

export function ProblemSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why we built Noitrex
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The subscription billing layer in Nigeria is broken. SaaS companies are losing revenue and wasting engineering cycles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem) => {
            const Icon = problem.icon
            return (
              <div key={problem.title} className="relative flex flex-col p-8 rounded-2xl border border-border bg-card">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-elevated border border-border text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
