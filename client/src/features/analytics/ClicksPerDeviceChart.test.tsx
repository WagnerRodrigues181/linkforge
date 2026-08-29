import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClicksPerDeviceChart } from './ClicksPerDeviceChart';

describe('ClicksPerDeviceChart', () => {
  it('shows an empty state message when there is no data', () => {
    render(<ClicksPerDeviceChart data={[]} />);
    expect(screen.getByText('No clicks yet.')).toBeInTheDocument();
  });
});