import { prisma } from '../../db/prisma.client';
import { redis } from '../../cache/redis.client';

const CACHE_TTL_SECONDS = 3600;

export async function resolveSlug(slug: string): Promise<string | null> {
  let cached: string | null = null;

  try {
    cached = await redis.get(slug);
  } catch (err) {
    console.error('Redis unavailable, falling back to Postgres:', err);
  }

  if (cached) {
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

  return link.targetUrl;
}