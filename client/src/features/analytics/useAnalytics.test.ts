import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import { getClicksPerDay, getClicksPerDevice } from '../../services/api';

vi.mock('../../services/api', () => ({
  getClicksPerDay: vi.fn(),
  getClicksPerDevice: vi.fn(),
}));

const mockedGetClicksPerDay = vi.mocked(getClicksPerDay);
const mockedGetClicksPerDevice = vi.mocked(getClicksPerDevice);

describe('useAnalytics', () => {
  beforeEach(() => {
    mockedGetClicksPerDay.mockReset();
    mockedGetClicksPerDevice.mockReset();
  });

  it('starts in a loading state with empty data', () => {
    mockedGetClicksPerDay.mockReturnValue(new Promise(() => {}));
    mockedGetClicksPerDevice.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useAnalytics('foo'));

    expect(result.current.loading).toBe(true);
    expect(result.current.clicksPerDay).toEqual([]);
    expect(result.current.clicksPerDevice).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('populates data and clears loading on success', async () => {
    mockedGetClicksPerDay.mockResolvedValueOnce([{ date: '2026-08-25', count: 3 }]);
    mockedGetClicksPerDevice.mockResolvedValueOnce([{ device: 'mobile', count: 3 }]);

    const { result } = renderHook(() => useAnalytics('foo'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.clicksPerDay).toEqual([{ date: '2026-08-25', count: 3 }]);
    expect(result.current.clicksPerDevice).toEqual([{ device: 'mobile', count: 3 }]);
    expect(result.current.error).toBeNull();
  });

  it('sets an error message when the request fails', async () => {
    mockedGetClicksPerDay.mockRejectedValueOnce(new Error('network down'));
    mockedGetClicksPerDevice.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useAnalytics('foo'));

    await waitFor(() => expect(result.current.error).toBe('network down'));
    expect(result.current.loading).toBe(false);
  });
});