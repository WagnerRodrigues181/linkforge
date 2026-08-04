import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveSlug } from '../src/modules/redirect/redirect.service';
import { redis } from '../src/cache/redis.client';
import { prisma } from '../src/db/prisma.client';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('resolveSlug', () => {
  it('returns the URL from cache on a hit, without querying Postgres', async () => {
    vi.spyOn(redis, 'get').mockResolvedValue('https://example.com');
    const findUniqueSpy = vi.spyOn(prisma.link, 'findUnique');

    const result = await resolveSlug('abc123');

    expect(result).toBe('https://example.com');
    expect(findUniqueSpy).not.toHaveBeenCalled();
  });

  it('falls back to Postgres and populates the cache on a miss', async () => {
    vi.spyOn(redis, 'get').mockResolvedValue(null);
    vi.spyOn(prisma.link, 'findUnique').mockResolvedValue({
      id: '1',
      slug: 'abc123',
      targetUrl: 'https://example.com',
      createdAt: new Date(),
    } as any);
    const setSpy = vi.spyOn(redis, 'set').mockResolvedValue('OK');

    const result = await resolveSlug('abc123');

    expect(result).toBe('https://example.com');
    expect(setSpy).toHaveBeenCalledWith('abc123', 'https://example.com', 'EX', 3600);
  });

  it('returns null for a nonexistent slug', async () => {
    vi.spyOn(redis, 'get').mockResolvedValue(null);
    vi.spyOn(prisma.link, 'findUnique').mockResolvedValue(null);

    const result = await resolveSlug('naoexiste');

    expect(result).toBeNull();
  });
});
