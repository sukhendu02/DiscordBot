import { useState, useEffect } from 'react';
import { Activity, Server, AlertTriangle, RefreshCw,Check,X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/TableSkeleton';
import { fetchDashboardSummary } from '../api/dashboard.api';

const statusStyles = {
  completed: 'bg-green-50 text-green-700',
  failed: 'bg-red-50 text-red-700',
  processing: 'bg-amber-50 text-amber-700',
  received: 'bg-gray-100 text-gray-600',
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        statusStyles[status] || statusStyles.received
      }`}
    >
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, tone = 'primary' }) {
  return (
    <Card className="flex items-center shadow-sm ring-1 ring-black/5 rounded-2xl gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          tone === 'error' ? 'bg-error-50 text-error-600' : 'bg-primary-50 text-primary-600'
        } dark:bg-opacity-20`}
      >
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await fetchDashboardSummary();
      console.log(data)
      setSummary(data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const rows = [
  { label: 'Requires input text', status: false, report: true },
  { label: 'Checked against rules', status: false, report: true },
  { label: 'Mirrored to second channel', status: false, report: true },
];
 
function CellIcon({ value }) {
  return value ? (
    <Check className="w-4 h-4 text-success-600 mx-auto" />
  ) : (
    <X className="w-4 h-4 text-surface-300 mx-auto" />
  );
}


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Overview of your connected servers</p>
        </div>
        <Button onClick={loadSummary} variant="secondary" className='shadow-sm ring-1 ring-black/5' size="sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {error && (
        <div className="">
          <p className="text-red-700">{error}</p>
          <Button onClick={loadSummary} variant="ghost" size="sm" className="mt-2">
            Retry
          </Button>
        </div>
      )}

      {isLoading ? (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <CardSkeleton />
        </>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <StatCard
              icon={Activity}
              label="Commands today"
              value={summary?.totalCommandsToday ?? 0}
            />
            <StatCard
              icon={Server}
              label="Connected servers"
              value={summary?.activeServersCount ?? 0}
            />
            <StatCard
              icon={AlertTriangle}
              label="Failed mirror deliveries"
              value={summary?.failedMirrorCount ?? 0}
              tone={summary?.failedMirrorCount > 0 ? 'error' : 'primary'}
            />
          </div>

<div className='flex flex-col justify-between gap-1 lg:flex-row'>
 


          <Card className='bg-slate-100  p-5 rounded-2xl'>
            <h2 className="text-xl  font-semibold text-gray-700 dark:text-gray-50 mb-4">
              Recent activity
            </h2>

            {!summary?.recentActivity || summary.recentActivity.length === 0 ? (
              <EmptyState
                title="No activity yet"
                description="Run a slash command in your connected Discord server to see it appear here."
              />
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {summary.recentActivity.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-primary dark:text-gray-50 truncate">
                        /{log.commandName}{' '}
                        <span className="font-normal text-gray-500">
                          — {log.Server?.guildName || 'Unknown server'}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {log.inputText || 'No input'} · Action: {log.actionTaken || 'pending'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={log.status} />
                      <span className="text-xs text-gray-400">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>


           <div>

  </div>
          </div>
        </>
      )}
    </div>
  );
}