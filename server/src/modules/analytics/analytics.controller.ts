import { Request, Response } from 'express';
import { getClicksPerDay } from './analytics.service';

export async function clicksPerDayHandler(req: Request<{ slug: string }>, res: Response) {
  const { slug } = req.params;

  const data = await getClicksPerDay(slug);

  if (data === null) {
    return res.status(404).json({ error: 'Link not found' });
  }

  return res.json(data);
}
