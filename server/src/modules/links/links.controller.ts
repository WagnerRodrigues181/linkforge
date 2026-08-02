import { Request, Response } from 'express';
import { createShortLink } from './links.service';

export async function createLinkHandler(req: Request, res: Response) {
  const { targetUrl } = req.body;

  if (!targetUrl) {
    return res.status(400).json({ error: 'targetUrl is required' });
  }

  const link = await createShortLink(targetUrl);
  return res.status(201).json(link);
}
