import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createShortLink, InvalidUrlError } from '../src/modules/links/links.service';
import * as repository from '../src/modules/links/links.repository';
import { Prisma } from '../src/generated/prisma/client';

beforeEach(() => {
  vi.restoreAllMocks();
});

function makeDuplicateSlugError() {
  return new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
    code: 'P2002',
    clientVersion: '7.9.1',
  });
}

describe('createShortLink', () => {
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

  it('gives up after exhausting all slug retries on persistent collision', async () => {
    vi.spyOn(repository, 'createLink').mockRejectedValue(makeDuplicateSlugError());

    await expect(createShortLink('https://example.com')).rejects.toThrow(
      'Could not generate a unique slug after multiple attempts',
    );
    expect(repository.createLink).toHaveBeenCalledTimes(3);
  });
});

describe('createShortLink retry on collision', () => {
  it('retries slug generation when a collision occurs', async () => {
    vi.spyOn(repository, 'createLink')
      .mockRejectedValueOnce(makeDuplicateSlugError())
      .mockResolvedValueOnce({
        id: '2',
        slug: 'newslug',
        targetUrl: 'https://example.com',
        createdAt: new Date(),
      } as any);

    const link = await createShortLink('https://example.com');

    expect(link.slug).toBe('newslug');
    expect(repository.createLink).toHaveBeenCalledTimes(2);
  });
});
