import { useState } from 'react';
import type { Link } from '../../services/api';

interface LinkListProps {
  links: Link[];
}

export function LinkList({ links }: LinkListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(link: Link) {
    const shortUrl = `${window.location.origin}/${link.slug}`;
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
        <li
          key={link.id}
          className="bg-surface px-4 py-3 rounded-md flex items-center justify-between gap-4"
        >
          <div className="min-w-0">
            <p className="text-accent font-mono truncate">/{link.slug}</p>
            <p className="text-text-muted text-sm truncate">{link.targetUrl}</p>
          </div>
          <button
            onClick={() => handleCopy(link)}
            className="text-text-muted hover:text-text shrink-0 text-sm"
          >
            {copiedId === link.id ? 'Copied!' : 'Copy'}
          </button>
        </li>
      ))}
    </ul>
  );
}
