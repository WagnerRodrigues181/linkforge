import { nanoid } from 'nanoid';
import { createLink } from './links.repository';

function generateSlug(): string {
  return nanoid(6);
}

export async function createShortLink(targetUrl: string) {
  const slug = generateSlug();
  return createLink(slug, targetUrl);
}
