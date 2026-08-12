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

  const clicks = await prisma.click.findMany({
    where: { linkId: link.id },
    select: { clickedAt: true },
  });

  const counts: Record<string, number> = {};

  for (const click of clicks) {
    const day = click.clickedAt.toISOString().slice(0, 10);
    counts[day] = (counts[day] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getClicksPerDevice(linkSlug: string) {
  const link = await prisma.link.findUnique({ where: { slug: linkSlug } });

  if (!link) {
    return null;
  }

  const clicks = await prisma.click.findMany({
    where: { linkId: link.id },
    select: { device: true },
  });

  const counts: Record<string, number> = {};

  for (const click of clicks) {
    const device = click.device ?? 'unknown';
    counts[device] = (counts[device] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);
}
