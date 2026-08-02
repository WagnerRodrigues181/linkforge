import { nanoid } from 'nanoid';
import { createLink } from './links.repository';

function generateSlug(): string {
  return nanoid(6);
}

function isValidUrl(targetUrl: string): boolean {
  try {
    new URL(targetUrl);
    return true;
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