import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShortenForm } from './ShortenForm';
import { createLink } from '../../services/api';
import type { Link } from '../../services/api';

vi.mock('../../services/api', () => ({
  createLink: vi.fn(),
}));

const mockedCreateLink = vi.mocked(createLink);

describe('ShortenForm', () => {
  beforeEach(() => {
    mockedCreateLink.mockReset();
  });

  it('renders the url input and submit button', () => {
    render(<ShortenForm onLinkCreated={vi.fn()} />);

    expect(screen.getByPlaceholderText(/https:\/\/example.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shorten/i })).toBeInTheDocument();
  });

  it('creates a link and clears the input on success', async () => {
    const user = userEvent.setup();
    const onLinkCreated = vi.fn();
    const fakeLink: Link = {
      id: '1',
      slug: 'abc123',
      targetUrl: 'https://example.com',
      createdAt: new Date().toISOString(),
    };
    mockedCreateLink.mockResolvedValueOnce(fakeLink);

    render(<ShortenForm onLinkCreated={onLinkCreated} />);
    const input = screen.getByPlaceholderText(/https:\/\/example.com/i);

    await user.type(input, 'https://example.com');
    await user.click(screen.getByRole('button', { name: /shorten/i }));

    await waitFor(() => expect(onLinkCreated).toHaveBeenCalledWith(fakeLink));
    expect(input).toHaveValue('');
  });

  it('shows an error message when the request fails', async () => {
    const user = userEvent.setup();
    mockedCreateLink.mockRejectedValueOnce(new Error('Slug generation failed'));

    render(<ShortenForm onLinkCreated={vi.fn()} />);
    await user.type(screen.getByPlaceholderText(/https:\/\/example.com/i), 'https://example.com');
    await user.click(screen.getByRole('button', { name: /shorten/i }));

    expect(await screen.findByText('Slug generation failed')).toBeInTheDocument();
  });

  it('disables the submit button while the request is in flight', async () => {
    const user = userEvent.setup();
    let resolveCreate!: (link: Link) => void;
    mockedCreateLink.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveCreate = resolve;
        })
    );

    render(<ShortenForm onLinkCreated={vi.fn()} />);
    await user.type(screen.getByPlaceholderText(/https:\/\/example.com/i), 'https://example.com');
    await user.click(screen.getByRole('button', { name: /shorten/i }));

    const button = screen.getByRole('button', { name: /shortening/i });
    expect(button).toBeDisabled();

    resolveCreate({
      id: '1',
      slug: 'abc123',
      targetUrl: 'https://example.com',
      createdAt: new Date().toISOString(),
    });
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});