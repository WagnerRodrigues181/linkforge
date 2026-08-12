import { describe, it, expect, vi, beforeEach } from 'vitest';
import { recordClick } from '../src/modules/analytics/analytics.service';
import { prisma } from '../src/db/prisma.client';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('recordClick', () => {
  it('creates a click linked to the correct link', async () => {
    vi.spyOn(prisma.link, 'findUnique').mockResolvedValue({
      id: 'link-1',
      slug: 'abc123',
      targetUrl: 'https://example.com',
      createdAt: new Date(),
    } as any);
    const createSpy = vi.spyOn(prisma.click, 'create').mockResolvedValue({} as any);

    await recordClick('abc123', 'curl/8.21.0');

    expect(createSpy).toHaveBeenCalledWith({
      data: { linkId: 'link-1', device: 'curl/8.21.0' },
    });
  });

  it('does nothing when the link does not exist', async () => {
    vi.spyOn(prisma.link, 'findUnique').mockResolvedValue(null);
    const createSpy = vi.spyOn(prisma.click, 'create');

    await recordClick('naoexiste', 'curl/8.21.0');

    expect(createSpy).not.toHaveBeenCalled();
  });

  it('does not block the caller when Postgres fails', async () => {
    vi.spyOn(prisma.link, 'findUnique').mockResolvedValue({
      id: 'link-1',
      slug: 'abc123',
      targetUrl: 'https://example.com',
      createdAt: new Date(),
    } as any);
    vi.spyOn(prisma.click, 'create').mockRejectedValue(new Error('DB unavailable'));

    await expect(recordClick('abc123', 'curl/8.21.0')).rejects.toThrow('DB unavailable');
  });
});
