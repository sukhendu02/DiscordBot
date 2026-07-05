import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No data',
  description = 'Get started by creating your first item.',
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-surface-400" />
      </div>
      <h3 className="text-lg font-medium text-surface-900 mb-1">{title}</h3>
      <p className="text-sm text-surface-500 max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}
