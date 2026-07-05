import { useState, useEffect } from 'react';
import { Terminal, RefreshCw, Dot, MessageCircleWarning, CircleAlert, CircleCheck, CircleX } from 'lucide-react';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { fetchCommands } from '../api/command.api';
import { formatDate } from '../utils/formatDate';

import TablePagination from '../components/ui/TablePagination';

function getStatusVariant(status) {
  const map = {
    completed: 'success',
    success: 'success',
    failed: 'error',
    error: 'error',
    processing: 'warning',
    pending: 'warning',
  };
  return map[status?.toLowerCase()] || 'default';
}

export default function CommandPage() {
  const [commands, setCommands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [serverFilter, setServerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
const [page, setPage] = useState(1);
const [pagination, setPagination] = useState(null);


useEffect(() => {
  loadCommands();
}, [page, serverFilter, statusFilter]);

const loadCommands = async () => {
  try {
    setIsLoading(true);
    setError("");

    const data = await fetchCommands({
      page,
      limit: 10,
    //   serverId: serverFilter,
    //   status: statusFilter,
    });

    console.log(data)

    setCommands(data.data.logs);
    setPagination(data.data.pagination);
  } catch (err) {
    setError("Failed to load command log");
  } finally {
    setIsLoading(false);
  }
};
 

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900">Command Log</h1>
          <p className="text-gray-500 text-sm mt-1">Audit and monitor bot interaction.</p>
        </div>
        <Button onClick={loadCommands} variant="secondary" size="sm">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Filter by Server
            </label>
            <input
              type="text"
              value={serverFilter}
              onChange={(e) => setServerFilter(e.target.value)}
              placeholder="Server name..."
              className="input"
            />
          </div>
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">All statuses</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </Card> */}

      {error && (
        <div className="rounded-lg bg-error-50 border border-error-200 p-4 mb-6">
          <p className="text-error-700">{error}</p>
          <Button onClick={loadCommands} variant="ghost" size="sm" className="mt-2">
            Try again
          </Button>
        </div>
      )}

      {/* Desktop Table View */}
      <Card className="hidden lg:block overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={10} cols={7} />
          </div>
        ) : commands?.length === 0 ? (
          <EmptyState
            icon={Terminal}
            title="No commands logged yet"
            description="Commands will appear here as they are executed."
          />
        ) : (
            <>
        
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Timestamp</TableHeader>
                <TableHeader>Server</TableHeader>
                <TableHeader>Command</TableHeader>
                <TableHeader>User</TableHeader>
                <TableHeader>Input</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Mirror</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {commands.map((cmd) => (
                <TableRow key={cmd.id}>
                  <TableCell className="whitespace-nowrap text-gray-500">
                    {formatDate(cmd.createdAt)}
                  </TableCell>
                  <TableCell>{cmd.Server.guildName}</TableCell>
                  <TableCell className="text-primary-dark ">
                  
                    <span className='bg-primary-extra-light px-2 py-1 rounded-2xl'>
                        /{cmd.commandName}
                        </span>
                        </TableCell>
                 
                  <TableCell>{cmd.discordUsername}</TableCell>
                  <TableCell className="max-w-xs truncate text-surface-500">
                    {cmd.inputText || '-'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge variant={getStatusVariant(cmd.status)}>
                     {cmd.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
           
                      
                     {
                        cmd.mirrorStatus === "pending" ? (
                            <CircleAlert size={16} className='text-amber-500'/>
                        ) : cmd.mirrorStatus === "sent" ? (
                            <span>
                                <CircleCheck size={16} className='text-green-500'/>
                            </span>
                        ) : (
                            <span>
                                <CircleX size={16} className='text-danger'/>
                            </span>
                        )
                        }
                   
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           <TablePagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={setPage}
      />
             </> 
        )}
      </Card>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-4 bg-surface-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-surface-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-surface-200 rounded w-2/3" />
              </Card>
            ))}
          </>
        ) : commands.length === 0 ? (
          <EmptyState
            icon={Terminal}
            title="No commands logged yet"
            description="Commands will appear here as they are executed."
          />
        ) : (
          commands.map((cmd) => (
            <Card key={cmd.id}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-surface-900">{cmd.commandName}</p>
                  <p className="text-sm text-surface-500">{formatDate(cmd.timestamp)}</p>
                </div>
                <StatusBadge variant={getStatusVariant(cmd.status)}>
                  {cmd.status}
                </StatusBadge>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-500">Server:</span>
                  <span className="text-surface-900">{cmd.server}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">User:</span>
                  <span className="text-surface-900">{cmd.user}</span>
                </div>
                {cmd.inputText && (
                  <div className="pt-2">
                    <span className="text-surface-500">Input:</span>
                    <p className="text-surface-900 mt-0.5">{cmd.inputText}</p>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
