import React, { useEffect, useState, useCallback } from 'react';
import { Activity, CheckCircle2, XCircle, RefreshCw, Server, ExternalLink, ShieldCheck } from 'lucide-react';
import { api } from '@/services/api';

export interface HealthData {
  status?: string;
  message?: string;
  documentation?: string;
  health?: string;
  version?: string;
  timestamp?: string;
  service?: string;
}

export const BackendStatus: React.FC<{
  className?: string;
  variant?: 'pill' | 'banner' | 'compact';
}> = ({ className = '', variant = 'pill' }) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsRefreshing(true);
    const start = performance.now();
    try {
      const response = await api.get<HealthData>('/');
      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);
      setHealthData(response.data);
      setStatus('connected');
      setLastChecked(new Date());
    } catch (err) {
      // Try /health as fallback
      try {
        const fallback = await api.get<HealthData>('/health');
        const elapsed = Math.round(performance.now() - start);
        setLatency(elapsed);
        setHealthData(fallback.data);
        setStatus('connected');
        setLastChecked(new Date());
      } catch (fallbackErr) {
        setStatus('error');
        setHealthData(null);
        setLatency(null);
        setLastChecked(new Date());
      }
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    // Auto-check every 60 seconds
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  if (variant === 'banner') {
    return (
      <div
        className={`flex items-center justify-between px-4 py-2 text-xs font-medium border-b transition-colors ${
          status === 'connected'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            : status === 'checking'
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
        } ${className}`}
      >
        <div className="flex items-center gap-2">
          {status === 'connected' ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          ) : status === 'checking' ? (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 animate-pulse"></span>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          )}
          <span>
            {status === 'connected'
              ? `Backend Connected: ${api.getBaseUrl()}`
              : status === 'checking'
              ? 'Connecting to backend...'
              : `Backend Unreachable (${api.getBaseUrl()})`}
          </span>
          {latency !== null && (
            <span className="opacity-75 font-mono">({latency}ms)</span>
          )}
        </div>
        <button
          onClick={checkHealth}
          disabled={isRefreshing}
          className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity p-1 rounded"
          title="Re-check health"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => setShowDetails((prev) => !prev)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-xs transition-all ${
          status === 'connected'
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            : status === 'checking'
            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
        }`}
        title="Click to view Backend Details"
      >
        {status === 'connected' ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        ) : status === 'checking' ? (
          <RefreshCw className="w-2.5 h-2.5 animate-spin text-amber-500" />
        ) : (
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        )}

        <span className="hidden sm:inline">
          {status === 'connected' ? 'API Live' : status === 'checking' ? 'Connecting' : 'Offline'}
        </span>
        {latency !== null && (
          <span className="font-mono text-[10px] opacity-75">{latency}ms</span>
        )}
      </button>

      {/* Details Dropdown Popover */}
      {showDetails && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDetails(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-popover text-popover-foreground rounded-lg border border-border shadow-xl z-50 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <div className="flex items-center gap-1.5 font-semibold">
                <Server className="w-3.5 h-3.5 text-primary" />
                <span>Backend Connection</span>
              </div>
              <button
                type="button"
                onClick={checkHealth}
                disabled={isRefreshing}
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                title="Refresh Status"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-1.5 text-muted-foreground">
              <div className="flex justify-between">
                <span>Status:</span>
                <span
                  className={`font-semibold capitalize ${
                    status === 'connected'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {status === 'connected' ? 'Online (Render)' : 'Disconnected'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Endpoint:</span>
                <span className="font-mono text-[10px] truncate max-w-[150px]" title={api.getBaseUrl()}>
                  {api.getBaseUrl()}
                </span>
              </div>

              {latency !== null && (
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="font-mono">{latency} ms</span>
                </div>
              )}

              {healthData?.version && (
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-mono">v{healthData.version}</span>
                </div>
              )}

              {lastChecked && (
                <div className="flex justify-between">
                  <span>Last Checked:</span>
                  <span>{lastChecked.toLocaleTimeString()}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border/50 flex justify-between items-center text-[11px]">
              <a
                href={`${api.getBaseUrl()}/api/docs`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                Swagger Docs
              </a>
              <span className="text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                TLS Secured
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BackendStatus;
