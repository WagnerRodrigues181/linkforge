import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { createLink, type Link } from '../../services/api';

interface ShortenFormProps {
  onLinkCreated: (link: Link) => void;
}

export function ShortenForm({ onLinkCreated }: ShortenFormProps) {
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const link = await createLink(targetUrl);
      onLinkCreated(link);
      setTargetUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="url"
        required
        placeholder="https://example.com/very-long-url"
        value={targetUrl}
        onChange={(e) => setTargetUrl(e.target.value)}
        className="bg-surface text-text px-4 py-2 rounded-md outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-bg font-semibold px-4 py-2 rounded-md disabled:opacity-50"
      >
        {loading ? 'Shortening...' : 'Shorten'}
      </button>
      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-md">{error}</p>
      )}
    </form>
  );
}