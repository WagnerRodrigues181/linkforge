import { prisma } from '../../db/prisma.client';

export async function recordClick(linkSlug: string, userAgent?: string) {
  const link = await prisma.link.findUnique({ where: { slug: linkSlug } });

  if (!link) {
    return;
  }

  await prisma.click.create({
    data: {
      linkId: link.id,
      device: userAgent,
    },
  });
}
