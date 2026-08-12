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

export async function getClicksPerDay(linkSlug: string) {
  const link = await prisma.link.findUnique({ where: { slug: linkSlug } });

  if (!link) {
    return null;
  }

  const grouped = await prisma.$queryRaw<{ date: string; count: bigint }[]>`
    SELECT TO_CHAR("clickedAt", 'YYYY-MM-DD') as date, COUNT(*) as count
    FROM "Click"
    WHERE "linkId" = ${link.id}
    GROUP BY date
    ORDER BY date ASC
  `;

  return grouped.map((row) => ({ date: row.date, count: Number(row.count) }));
}

export async function getClicksPerDevice(linkSlug: string) {
  const link = await prisma.link.findUnique({ where: { slug: linkSlug } });

  if (!link) {
    return null;
  }

  const grouped = await prisma.click.groupBy({
    by: ['device'],
    where: { linkId: link.id },
    _count: { device: true },
  });

  return grouped
    .map((row) => ({ device: row.device ?? 'unknown', count: row._count.device }))
    .sort((a, b) => b.count - a.count);
}