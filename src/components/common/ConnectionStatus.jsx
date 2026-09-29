import { useConnection } from '../../contexts/ConnectionContext.jsx';

export default function ConnectionStatus() {
  const { isOnline, status } = useConnection();

  const config = {
    online: { dot: 'bg-green-500', ring: 'ring-green-200', label: 'Connected' },
    slow: { dot: 'bg-amber-500', ring: 'ring-amber-200', label: 'Slow' },
    offline: { dot: 'bg-orange-500', ring: 'ring-orange-200', label: 'Offline' },
  };

  const c = config[status] || config.offline;

  return (
    <div className="flex items-center gap-1.5" title={c.label}>
      <span className="relative flex h-2.5 w-2.5">
        {isOnline && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.dot} opacity-50`} />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${c.dot}`} />
      </span>
      <span className="text-xs font-medium text-gray-500 hidden sm:inline">{c.label}</span>
    </div>
  );
}
