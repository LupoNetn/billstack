import Link from "next"

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">

          {/* Brand & Description */}
          <div className="flex flex-col items-center md:items-start max-w-sm text-center md:text-left">
            <div className="text-xl font-bold tracking-tight text-foreground flex items-center mb-4">
              <div className="h-6 w-6 rounded-md bg-primary mr-2 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white"></div>
              </div>
              Noitrex
            </div>
            <p className="text-sm text-muted-foreground">
              Subscription billing infrastructure for Nigerian SaaS.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Developers</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API Reference</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Status Page</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
          <p>Built on Nomba. © {new Date().getFullYear()} Noitrex.</p>
        </div>
      </div>
    </footer>
  )
}
