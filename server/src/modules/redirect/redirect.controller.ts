import { Request, Response } from 'express';
import { resolveSlug } from './redirect.service';
import { recordClick } from '../analytics/analytics.service';

export async function redirectHandler(req: Request<{ slug: string }>, res: Response) {
  const { slug } = req.params;

  const targetUrl = await resolveSlug(slug);

  if (!targetUrl) {
    return res.status(404).json({ error: 'Link not found' });
  }

  recordClick(slug, req.headers['user-agent']).catch((err) => {
    console.error('Failed to record click:', err);
  });

  return res.redirect(targetUrl);
}