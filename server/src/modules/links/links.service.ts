import { nanoid } from 'nanoid';
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

export async function createShortLink(targetUrl: string) {
  if (!isValidUrl(targetUrl)) {
    throw new InvalidUrlError('Invalid target URL');
  }

  const slug = generateSlug();
  return createLink(slug, targetUrl);
}