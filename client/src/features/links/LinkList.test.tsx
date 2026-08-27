import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LinkList } from '../shorten/LinkList';
import type { Link } from '../../services/api';

vi.mock('../analytics/Dashboard', () => ({
  Dashboard: ({ slug, onClose }: { slug: string; onClose: () => void }) => (
    <div data-testid="dashboard-mock">
      <span>dashboard for {slug}</span>
      <button onClick={onClose}>close-dashboard</button>
    </div>
  ),
}));

const links: Link[] = [
  { id: '1', slug: 'foo', targetUrl: 'https://foo.com', createdAt: '2026-08-25T10:00:00.000Z' },
  { id: '2', slug: 'bar', targetUrl: 'https://bar.com', createdAt: '2026-08-25T11:00:00.000Z' },
];

const writeTextMock = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  writeTextMock.mockClear();
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: writeTextMock },
    writable: true,
    configurable: true,
  });
});

describe('LinkList', () => {
  it('renders nothing when there are no links', () => {
    const { container } = render(<LinkList links={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a row for each link', () => {
    render(<LinkList links={links} />);

    expect(screen.getByText('/foo')).toBeInTheDocument();
    expect(screen.getByText('/bar')).toBeInTheDocument();
    expect(screen.getByText('https://foo.com')).toBeInTheDocument();
  });

  it('copies the short url and shows feedback that reverts after a timeout', async () => {
    render(<LinkList links={links} />);
    const copyButton = screen.getAllByRole('button', { name: /^copy$/i })[0];

    vi.useFakeTimers();
    try {
      fireEvent.click(copyButton);
      await vi.waitFor(() => expect(writeTextMock).toHaveBeenCalledWith(`${window.location.origin}/foo`));
      await vi.waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument());

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('toggles the stats panel for a link', async () => {
    const user = userEvent.setup();
    render(<LinkList links={links} />);

    await user.click(screen.getAllByRole('button', { name: /^stats$/i })[0]);
    expect(screen.getByTestId('dashboard-mock')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /hide stats/i }));
    expect(screen.queryByTestId('dashboard-mock')).not.toBeInTheDocument();
  });
});