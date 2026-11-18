'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Server, Network, Cpu, Printer, Globe, HardDrive,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusDot } from '@/components/ui/StatusDot';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchApi, formatDuration, formatRelativeTime } from '@/lib/utils';
import type { TailscaleNode, ServiceHealth, PrinterStatus } from '@/lib/types';
import { mockNodes, mockServices, mockPrinters } from '@/lib/mock-data';

interface StatusResponse {
  ok: boolean;
  data?: {
    nodes?: TailscaleNode[];
    services?: ServiceHealth[];
    printers?: PrinterStatus[];
  };
  error?: string;
}

function NodeCard({ node }: { node: TailscaleNode }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusDot status={node.status} />
          <span className="text-foreground font-medium text-sm">{node.hostname}</span>
        </div>
        <Badge variant={node.status === 'online' ? 'success' : 'danger'}>
          {node.status}
        </Badge>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-muted">IP</span>
          <span className="text-dim font-mono">{node.ip}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">OS</span>
          <span className="text-dim">{node.os}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Last Seen</span>
          <span className="text-dim">{formatRelativeTime(node.lastSeen)}</span>
        </div>
      </div>
    </Card>
  );
}

function ServiceRow({ service }: { service: ServiceHealth }) {
  const statusMap: Record<string, 'running' | 'stopped' | 'error'> = {
    running: 'running',
    stopped: 'stopped',
    error: 'error',
  };

  return (
    <tr className="border-b border-edge last:border-b-0 hover:bg-highlight/30 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <StatusDot status={statusMap[service.status] || 'stopped'} />
          <span className="text-foreground text-sm font-medium">{service.name}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge
          variant={
            service.status === 'running' ? 'success' :
            service.status === 'error' ? 'danger' : 'warning'
          }
        >
          {service.status}
        </Badge>
      </td>
      <td className="py-3 px-4 text-dim text-sm font-mono">
        {service.pid ?? '—'}
      </td>
      <td className="py-3 px-4 text-dim text-sm font-mono">
        {service.port ?? '—'}
      </td>
      <td className="py-3 px-4 text-dim text-sm">
        {service.uptime != null ? formatDuration(service.uptime) : '—'}
      </td>
      <td className="py-3 px-4 text-dim text-sm font-mono">
        {service.memory != null ? `${(service.memory / 1024 / 1024).toFixed(0)} MB` : '—'}
      </td>
    </tr>
  );
}

function PrinterCard({ printer }: { printer: PrinterStatus }) {
  const statusMap: Record<string, 'idle' | 'running' | 'error' | 'offline'> = {
    idle: 'idle',
    printing: 'running',
    error: 'error',
    offline: 'offline',
  };

  const badgeVariant = (() => {
    switch (printer.status) {
      case 'idle': return 'default' as const;
      case 'printing': return 'warning' as const;
      case 'error': return 'danger' as const;
      case 'offline': return 'danger' as const;
      default: return 'default' as const;
    }
  })();

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusDot status={statusMap[printer.status] || 'offline'} />
          <span className="text-foreground font-medium text-sm">{printer.name}</span>
        </div>
        <Badge variant={badgeVariant}>
          {printer.status}
        </Badge>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-muted">Model</span>
          <span className="text-dim">{printer.model}</span>
        </div>
        {printer.status === 'printing' && printer.progress != null && (
          <>
            <div className="flex justify-between">
              <span className="text-muted">Progress</span>
              <span className="text-foreground font-mono">{printer.progress}%</span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full border border-edge overflow-hidden">
              <div
                className="h-full bg-warning rounded-full transition-all duration-500"
                style={{ width: `${printer.progress}%` }}
              />
            </div>
            {printer.currentJob && (
              <div className="flex justify-between">
                <span className="text-muted">Job</span>
                <span className="text-dim truncate max-w-[140px]">{printer.currentJob}</span>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

export default function InfraPage() {
  const [nodes, setNodes] = useState<TailscaleNode[]>([]);
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [printers, setPrinters] = useState<PrinterStatus[]>([]);
  const [loading, setLoading] = useState(true);


  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchApi<StatusResponse>('/api/status');
      if (res.ok && res.data) {
        setNodes(res.data.nodes || []);
        setServices(res.data.services || []);
        setPrinters(res.data.printers || []);
      } else {
        setNodes(mockNodes);
        setServices(mockServices);
        setPrinters(mockPrinters);
      }
    } catch {
      setNodes(mockNodes);
      setServices(mockServices);
      setPrinters(mockPrinters);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Server size={24} className="text-primary" />
        <div>
          <h2 className="text-foreground text-xl font-bold">Infrastructure</h2>
          <p className="text-muted text-sm">Server and node monitoring</p>
        </div>
      </div>

      {/* Tailscale Nodes */}
      <section>
        <Card padding={false}>
          <div className="p-5 pb-0">
            <CardHeader>
              <CardTitle>
                <span className="flex items-center gap-2">
                  <Network size={16} className="text-primary" />
                  Tailscale Nodes
                </span>
              </CardTitle>
              {!loading && nodes.length > 0 && (
                <Badge variant="default">{nodes.length} nodes</Badge>
              )}
            </CardHeader>
          </div>
          <div className="p-5 pt-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : nodes.length === 0 ? (
              <EmptyState
                icon={Globe}
                title="No Tailscale nodes"
                description="Node data will appear here when the Tailscale integration is available"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nodes.map((node) => (
                  <NodeCard key={node.id} node={node} />
                ))}
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Services */}
      <section>
        <Card padding={false}>
          <div className="p-5 pb-0">
            <CardHeader>
              <CardTitle>
                <span className="flex items-center gap-2">
                  <Cpu size={16} className="text-primary" />
                  Services
                </span>
              </CardTitle>
              {!loading && services.length > 0 && (
                <Badge variant="default">{services.length} services</Badge>
              )}
            </CardHeader>
          </div>
          <div className="px-5 pb-5">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-highlight rounded animate-pulse" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <EmptyState
                icon={HardDrive}
                title="No services detected"
                description="Service monitoring data will appear here when PM2 or process data is available"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-edge">
                      <th className="py-2 px-4 text-left text-muted text-xs uppercase tracking-wider font-medium">Name</th>
                      <th className="py-2 px-4 text-left text-muted text-xs uppercase tracking-wider font-medium">Status</th>
                      <th className="py-2 px-4 text-left text-muted text-xs uppercase tracking-wider font-medium">PID</th>
                      <th className="py-2 px-4 text-left text-muted text-xs uppercase tracking-wider font-medium">Port</th>
                      <th className="py-2 px-4 text-left text-muted text-xs uppercase tracking-wider font-medium">Uptime</th>
                      <th className="py-2 px-4 text-left text-muted text-xs uppercase tracking-wider font-medium">Memory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <ServiceRow key={service.name} service={service} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Print Farm */}
      <section>
        <Card padding={false}>
          <div className="p-5 pb-0">
            <CardHeader>
              <CardTitle>
                <span className="flex items-center gap-2">
                  <Printer size={16} className="text-primary" />
                  Print Farm
                </span>
              </CardTitle>
              {!loading && printers.length > 0 && (
                <Badge variant="default">{printers.length} printers</Badge>
              )}
            </CardHeader>
          </div>
          <div className="p-5 pt-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : printers.length === 0 ? (
              <EmptyState
                icon={Printer}
                title="No printers found"
                description="Printer status will appear here when the print farm integration is connected"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {printers.map((printer) => (
                  <PrinterCard key={printer.id} printer={printer} />
                ))}
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
