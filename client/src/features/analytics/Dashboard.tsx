import { useAnalytics } from './useAnalytics';
import { ClicksPerDayChart } from './ClicksPerDayChart';
import { ClicksPerDeviceChart } from './ClicksPerDeviceChart';

interface DashboardProps {
  slug: string;
  onClose: () => void;
}

export function Dashboard({ slug, onClose }: DashboardProps) {
  const { clicksPerDay, clicksPerDevice, loading, error } = useAnalytics(slug);

  return (
    <div className="bg-surface rounded-md p-4 mt-2 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-text font-mono text-sm">/{slug}</p>
        <button onClick={onClose} className="text-text-muted text-sm hover:text-text">
          Close
        </button>
      </div>

      {loading && <p className="text-text-muted text-sm">Loading...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading && !error && (
        <>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wide mb-2">Clicks per day</p>
            <ClicksPerDayChart data={clicksPerDay} />
          </div>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wide mb-2">Clicks per device</p>
            <ClicksPerDeviceChart data={clicksPerDevice} />
          </div>
        </>
      )}
    </div>
  );
}