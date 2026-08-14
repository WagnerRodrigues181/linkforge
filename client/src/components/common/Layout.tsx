import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-surface px-6 py-4">
        <h1 className="text-accent text-xl font-bold">LinkForge</h1>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
