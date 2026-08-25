import { useState, useEffect } from 'react';
import { getClicksPerDay, getClicksPerDevice } from '../../services/api';
import type { ClicksPerDay, ClicksPerDevice } from '../../services/api';

interface UseAnalyticsResult {
  clicksPerDay: ClicksPerDay[];
  clicksPerDevice: ClicksPerDevice[];
  loading: boolean;
  error: string | null;
}

export function useAnalytics(slug: string): UseAnalyticsResult {
  const [clicksPerDay, setClicksPerDay] = useState<ClicksPerDay[]>([]);
  const [clicksPerDevice, setClicksPerDevice] = useState<ClicksPerDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  let cancelled = false;
  // eslint-disable-next-line react-hooks/set-state-in-effect -- deixando aqui um reset intencional de loading/error a cada troca de slug, antes do fetch assíncrono
  setLoading(true);
  setError(null);
  Promise.all([getClicksPerDay(slug), getClicksPerDevice(slug)])
    .then(([days, devices]) => {
      if (cancelled) return;
      setClicksPerDay(days);
      setClicksPerDevice(devices);
    })
    .catch((err) => {
      if (cancelled) return;
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    })
    .finally(() => {
      if (!cancelled) setLoading(false);
    });
  return () => {
    cancelled = true;
  };
}, [slug]);

  return { clicksPerDay, clicksPerDevice, loading, error };
}