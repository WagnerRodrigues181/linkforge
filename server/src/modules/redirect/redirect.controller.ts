import { Request, Response } from 'express';
import { resolveSlug } from './redirect.service';

export async function redirectHandler(req: Request<{ slug: string }>, res: Response) {
  const { slug } = req.params;

  const targetUrl = await resolveSlug(slug);

  if (!targetUrl) {
    return res.status(404).json({ error: 'Link not found' });
  }

  return res.redirect(targetUrl);
}