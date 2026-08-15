import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen bg-bg text-text overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(255,255,255,0.028) 0px, rgba(255,255,255,0.028) 1px, transparent 1px, transparent 3px)',
        }}
      />
      <div className="relative z-0">
        <header className="border-b border-border px-6 py-4">
          <h1 className="text-accent text-xl font-bold">LinkForge</h1>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>
      </div>
    </div>
  );
}