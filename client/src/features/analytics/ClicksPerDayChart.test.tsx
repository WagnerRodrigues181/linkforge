import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClicksPerDayChart } from './ClicksPerDayChart';

describe('ClicksPerDayChart', () => {
  it('shows an empty state message when there is no data', () => {
    render(<ClicksPerDayChart data={[]} />);
    expect(screen.getByText('No clicks yet.')).toBeInTheDocument();
  });
});