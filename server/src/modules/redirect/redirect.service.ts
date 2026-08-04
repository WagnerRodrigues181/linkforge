import { prisma } from '../../db/prisma.client';
import { redis } from '../../cache/redis.client';

const CACHE_TTL_SECONDS = 3600;

export async function resolveSlug(slug: string): Promise<string | null> {
  const start = performance.now();
  let cached: string | null = null;

  try {
    cached = await redis.get(slug);
  } catch (err) {
    console.error('Redis unavailable, falling back to Postgres:', err);
  }

  if (cached) {
    const elapsed = performance.now() - start;
    console.log(`[perf] cache HIT for "${slug}" — ${elapsed.toFixed(2)}ms`);
    return cached;
  }

  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link) {
    return null;
  }

  try {
    await redis.set(slug, link.targetUrl, 'EX', CACHE_TTL_SECONDS);
  } catch (err) {
    console.error('Redis unavailable, skipping cache write:', err);
  }

  const elapsed = performance.now() - start;
  console.log(`[perf] cache MISS for "${slug}" — ${elapsed.toFixed(2)}ms`);

  return link.targetUrl;
}