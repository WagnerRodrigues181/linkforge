import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createShortLink, InvalidUrlError } from '../src/modules/links/links.service';
import * as repository from '../src/modules/links/links.repository';

describe('createShortLink', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a link with a valid URL', async () => {
    vi.spyOn(repository, 'createLink').mockResolvedValue({
      id: '1',
      slug: 'abc123',
      targetUrl: 'https://example.com',
      createdAt: new Date(),
    } as any);

    const link = await createShortLink('https://example.com');

    expect(link.targetUrl).toBe('https://example.com');
    expect(repository.createLink).toHaveBeenCalledOnce();
  });

  it('rejects an invalid URL', async () => {
    await expect(createShortLink('javascript:alert(1)')).rejects.toThrow(InvalidUrlError);
  });

  it('throws when the repository reports a duplicate slug', async () => {
    const duplicateError = Object.assign(new Error('Unique constraint failed'), {
      code: 'P2002',
    });
    vi.spyOn(repository, 'createLink').mockRejectedValue(duplicateError);

    await expect(createShortLink('https://example.com')).rejects.toMatchObject({
      code: 'P2002',
    });
  });
});
