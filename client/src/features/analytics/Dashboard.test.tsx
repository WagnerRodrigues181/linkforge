import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from './Dashboard';
import { useAnalytics } from './useAnalytics';

vi.mock('./useAnalytics', () => ({
  useAnalytics: vi.fn(),
}));

vi.mock('./ClicksPerDayChart', () => ({
  ClicksPerDayChart: () => <div data-testid="day-chart" />,
}));

vi.mock('./ClicksPerDeviceChart', () => ({
  ClicksPerDeviceChart: () => <div data-testid="device-chart" />,
}));

const mockedUseAnalytics = vi.mocked(useAnalytics);

describe('Dashboard', () => {
  beforeEach(() => {
    mockedUseAnalytics.mockReset();
  });

  it('shows a loading message while fetching', () => {
    mockedUseAnalytics.mockReturnValue({
      clicksPerDay: [],
      clicksPerDevice: [],
      loading: true,
      error: null,
    });

    render(<Dashboard slug="foo" onClose={vi.fn()} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows the error message and hides the charts on failure', () => {
    mockedUseAnalytics.mockReturnValue({
      clicksPerDay: [],
      clicksPerDevice: [],
      loading: false,
      error: 'Failed to load analytics',
    });

    render(<Dashboard slug="foo" onClose={vi.fn()} />);
    expect(screen.getByText('Failed to load analytics')).toBeInTheDocument();
    expect(screen.queryByTestId('day-chart')).not.toBeInTheDocument();
  });

  it('renders both charts once data is loaded', () => {
    mockedUseAnalytics.mockReturnValue({
      clicksPerDay: [{ date: '2026-08-25', count: 1 }],
      clicksPerDevice: [{ device: 'mobile', count: 1 }],
      loading: false,
      error: null,
    });

    render(<Dashboard slug="foo" onClose={vi.fn()} />);
    expect(screen.getByTestId('day-chart')).toBeInTheDocument();
    expect(screen.getByTestId('device-chart')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    mockedUseAnalytics.mockReturnValue({
      clicksPerDay: [],
      clicksPerDevice: [],
      loading: false,
      error: null,
    });

    render(<Dashboard slug="foo" onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});