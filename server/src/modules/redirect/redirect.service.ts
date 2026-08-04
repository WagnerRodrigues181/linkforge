import { prisma } from '../../db/prisma.client';

export async function resolveSlug(slug: string): Promise<string | null> {
  const link = await prisma.link.findUnique({
    where: { slug },
  });

  return link?.targetUrl ?? null;
}
