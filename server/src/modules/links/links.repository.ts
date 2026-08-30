import { prisma } from '../../db/prisma.client';

export async function createLink(slug: string, targetUrl: string) {
  return prisma.link.create({
    data: { slug, targetUrl },
  });
}

export async function findLinkBySlug(slug: string) {
  return prisma.link.findUnique({ where: { slug } });
}