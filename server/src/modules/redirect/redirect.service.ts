import { prisma } from '../../db/prisma.client';
import { redis } from '../../cache/redis.client';

const CACHE_TTL_SECONDS = 3600; // 1 hora

export async function resolveSlug(slug: string): Promise<string | null> {
  const cached = await redis.get(slug);

  if (cached) {
    return cached;
  }

  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link) {
    return null;
  }

  await redis.set(slug, link.targetUrl, 'EX', CACHE_TTL_SECONDS);

  return link.targetUrl;
}