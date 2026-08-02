import { Request, Response } from 'express';
import { createShortLink, InvalidUrlError } from './links.service';

export async function createLinkHandler(req: Request, res: Response) {
  const { targetUrl } = req.body;

  if (!targetUrl) {
    return res.status(400).json({ error: 'targetUrl is required' });
  }

  try {
    const link = await createShortLink(targetUrl);
    return res.status(201).json(link);
  } catch (err) {
    if (err instanceof InvalidUrlError) {
      return res.status(400).json({ error: err.message });
    }
    throw err;
  }
}