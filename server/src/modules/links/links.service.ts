import { nanoid } from 'nanoid';
import { Prisma } from '../../generated/prisma/client';
import { createLink } from './links.repository';

function generateSlug(): string {
  return nanoid(6);
}

function isValidUrl(targetUrl: string): boolean {
  try {
    const url = new URL(targetUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export class InvalidUrlError extends Error {}

const MAX_SLUG_RETRIES = 3;

export async function createShortLink(targetUrl: string) {
  if (!isValidUrl(targetUrl)) {
    throw new InvalidUrlError('Invalid target URL');
  }

  let attempts = 0;

  while (attempts < MAX_SLUG_RETRIES) {
    const slug = generateSlug();
    try {
      return await createLink(slug, targetUrl);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        attempts++;
        continue;
      }
      throw err;
    }
  }

  throw new Error('Could not generate a unique slug after multiple attempts');
}