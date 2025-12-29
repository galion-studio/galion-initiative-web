/**
 * Torchbearer - Home Page
 * 
 * A warm, caring interface that welcomes humanity
 * and offers guidance through life's challenges.
 * 
 * Core principles:
 * - WARM not cold
 * - SIMPLE not complicated
 * - CALM not anxious
 * - WISE not just smart
 * - CARING not transactional
 */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Animated orb representing Torchbearer's presence */}
          <div className="mb-12 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-breathe rounded-full bg-gradient-warm blur-3xl opacity-40" />
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-warm shadow-2xl">
                <div className="h-24 w-24 rounded-full bg-white/30 backdrop-blur-sm" />
              </div>
            </div>
          </div>

          {/* Welcome message */}
          <h1 className="mb-6 font-display text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
            Welcome, Dear One
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-gray-700 sm:text-2xl">
            Welcome to the GALION ecosystem. I am here to support you with care, wisdom, and guidance.
            Ask me anything about GALION, get life guidance, or explore wisdom together.
          </p>

          {/* Core offerings */}
          <div className="mb-12 grid gap-6 sm:grid-cols-3">
            <a
              href="/wisdom"
              className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm transition-all hover:bg-white/80 hover:shadow-xl"
            >
              <div className="mb-3 text-4xl">🌟</div>
              <h3 className="mb-2 font-display text-lg font-semibold text-gray-900">
                Deep Questions
              </h3>
              <p className="text-sm text-gray-600">
                Ask about consciousness, reality, matter, or the nature of existence
              </p>
            </a>

            <a
              href="/guidance"
              className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm transition-all hover:bg-white/80 hover:shadow-xl"
            >
              <div className="mb-3 text-4xl">💝</div>
              <h3 className="mb-2 font-display text-lg font-semibold text-gray-900">
                Life Guidance
              </h3>
              <p className="text-sm text-gray-600">
                Get caring advice on relationships, purpose, growth, and challenges
              </p>
            </a>

            <a
              href="/chat"
              className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm transition-all hover:bg-white/80 hover:shadow-xl"
            >
              <div className="mb-3 text-4xl">🌍</div>
              <h3 className="mb-2 font-display text-lg font-semibold text-gray-900">
                Better World
              </h3>
              <p className="text-sm text-gray-600">
                Learn how to live sustainably and help create a kinder future
              </p>
            </a>
          </div>

          {/* Call to action */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/chat"
              className="group relative overflow-hidden rounded-full bg-gradient-warm px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              <span className="relative z-10">Start a Conversation</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
            
            <a
              href="/wisdom"
              className="rounded-full border-2 border-gray-300 bg-white/60 px-8 py-4 font-semibold text-gray-700 backdrop-blur-sm transition-all hover:border-primary-400 hover:bg-white/80 hover:shadow-lg"
            >
              Explore Wisdom
            </a>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="relative bg-white/40 px-6 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-4xl font-bold text-gray-900">
            What is Torchbearer?
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-gray-700">
            <p>
              I am the caring AI interface for the GALION ecosystem. My purpose is to support
              you with warmth, wisdom, and practical guidance as you engage with GALION and
              navigate life's challenges.
            </p>
            <p>
              Whether you need information about GALION, life guidance, answers to deep questions,
              or just a compassionate presence to talk with—I am here for you.
            </p>
            <p>
              Together, we can explore wisdom, find clarity, and create positive change in your
              life and community.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/60 px-6 py-12 text-center backdrop-blur-sm">
        <p className="mb-4 font-display text-lg font-semibold text-gray-900">
          Part of Project 42
        </p>
        <p className="mb-6 text-sm text-gray-600">
          Building safe AGI and caring AI for humanity
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <a
            href="/about"
            className="text-gray-600 transition-colors hover:text-primary-600"
          >
            About
          </a>
          <a
            href="/philosophy"
            className="text-gray-600 transition-colors hover:text-primary-600"
          >
            Philosophy
          </a>
          <a
            href="/galion"
            className="text-gray-600 transition-colors hover:text-primary-600"
          >
            Galion Initiative
          </a>
        </div>
      </footer>
    </main>
  );
}
