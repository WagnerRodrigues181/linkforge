import { useState } from 'react';
import type { Link } from '../../services/api';
import { Dashboard } from '../analytics/Dashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface LinkListProps {
  links: Link[];
}

export function LinkList({ links }: LinkListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  async function handleCopy(link: Link) {
    const shortUrl = `${API_URL}/${link.slug}`;
    await navigator.clipboard.writeText(shortUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (links.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-2 mt-6">
      {links.map((link) => (
        <li key={link.id} className="flex flex-col">
          <div className="bg-surface px-4 py-3 rounded-md flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-accent font-mono truncate">/{link.slug}</p>
              <p className="text-text-muted text-sm truncate">{link.targetUrl}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setExpandedSlug(expandedSlug === link.slug ? null : link.slug)}
                className="text-sm px-3 py-1 rounded text-text-muted hover:text-text hover:bg-bg transition-colors"
              >
                {expandedSlug === link.slug ? 'Hide stats' : 'Stats'}
              </button>
              <button
                onClick={() => handleCopy(link)}
                className={`text-sm px-3 py-1 rounded transition-colors ${
                  copiedId === link.id
                    ? 'bg-accent text-bg'
                    : 'text-text-muted hover:text-text hover:bg-bg'
                }`}
              >
                {copiedId === link.id ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          {expandedSlug === link.slug && (
            <Dashboard slug={link.slug} onClose={() => setExpandedSlug(null)} />
          )}
        </li>
      ))}
    </ul>
  );
}