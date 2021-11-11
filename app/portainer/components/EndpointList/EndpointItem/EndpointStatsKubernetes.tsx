import { KubernetesSnapshot } from '@/portainer/environments/types';
import { humanize } from '@/portainer/filters/filters';

interface EndpointStatsKubernetesProps {
  snapshots: KubernetesSnapshot[];
}

export function EndpointStatsKubernetes({
  snapshots = [],
}: EndpointStatsKubernetesProps) {
  if (snapshots.length === 0) {
    return (
      <div className="blocklist-item-line endpoint-item">
        <span className="blocklist-item-desc">-</span>
      </div>
    );
  }

  const snapshot = snapshots[0];

  return (
    <div className="blocklist-item-line endpoint-item">
      <span className="blocklist-item-desc">
        <span>
          <span style={{ padding: '0 7px 0 0' }}>
            <i className="fa fa-microchip space-right" aria-hidden="true" />
            {snapshot.TotalCPU} CPU
          </span>
          <span style={{ padding: '0 7px 0 7px' }}>
            <i className="fa fa-memory space-right" aria-hidden="true" />
            {humanize(snapshot.TotalMemory)} RAM
          </span>
        </span>
      </span>

      <span className="small text-muted">
        Kubernetes {snapshot.KubernetesVersion}
        <span style={{ padding: '0 0 0 7px' }}>
          <i className="fa fa-hdd space-left space-right" aria-hidden="true" />
          {snapshot.NodeCount} {snapshot.NodeCount === 1 ? 'node' : 'nodes'}
        </span>
      </span>
    </div>
  );
}
