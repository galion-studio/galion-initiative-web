'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="text-center flex flex-col items-center">
        <img src="/logo.webp" alt="The Galion Initiative" className="w-24 h-24 mb-8 object-contain opacity-50" />
        <h1 className="text-9xl font-bold text-primary-500/20 mb-4 select-none">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/">
          <Button size="lg" className="bg-primary-600 hover:bg-primary-500 text-white rounded-full px-8">
            Return Home
          </Button>
        </Link>
      </div>
    </main>
  );
}

