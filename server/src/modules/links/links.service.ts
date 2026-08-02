import { randomBytes } from 'crypto';
import { createLink } from './links.repository';

function generateSlug(): string {
  return randomBytes(4).toString('hex');
}

export async function createShortLink(targetUrl: string) {
  const slug = generateSlug();
  return createLink(slug, targetUrl);
}
