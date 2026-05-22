import { Button } from "@heroui/react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 py-12">
      <main className="flex flex-1 w-full flex-col items-center justify-center gap-12">
        {/* Hero Section */}
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/20">
            <span className="text-label text-primary">Fun AF</span>
          </div>

          <h1 className="text-display text-primary">
            QuPilot
          </h1>

          <p className="text-h2 text-text-secondary">
            Space explorer vibes for real degens
          </p>

          <p className="text-body-lg text-text-muted">
            Warm, bubbly, and bouncy. Your friendly companion for navigating the cosmos with style and confidence.
          </p>
        </div>

        {/* CTA Buttons - Using HeroUI Components */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            size="lg"
            variant="primary"
            className="px-8 py-4 rounded-lg bg-primary text-on-primary font-bold text-body-lg"
          >
            Get Started
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 rounded-lg border-2 border-secondary text-secondary font-bold text-body-lg hover:bg-secondary-light"
          >
            Learn More
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
          <div className="p-6 rounded-xl bg-surface border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-200">
            <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-h3 text-text-primary mb-2">Fast Launch</h3>
            <p className="text-body-sm text-text-secondary">
              Get up and running in seconds with our streamlined onboarding.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-border hover:border-secondary/30 hover:shadow-soft transition-all duration-200">
            <div className="w-12 h-12 rounded-lg bg-secondary-light flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-h3 text-text-primary mb-2">Playful Design</h3>
            <p className="text-body-sm text-text-secondary">
              Experience a warm, bouncy interface that makes work feel like play.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-border hover:border-accent/30 hover:shadow-soft transition-all duration-200">
            <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-h3 text-text-primary mb-2">Built for Degens</h3>
            <p className="text-body-sm text-text-secondary">
              Powerful features designed for those who know what they want.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-body-sm text-text-muted">
          <p>Ready to explore? Let&apos;s go. 🌟</p>
        </footer>
      </main>
    </div>
  );
}
