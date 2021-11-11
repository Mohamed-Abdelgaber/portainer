import { DockerSnapshot } from '@/portainer/environments/types';

interface EndpointStatsDockerProps {
  snapshots: DockerSnapshot[];
  type: number;
}

export function EndpointStatsDocker({
  snapshots = [],
  type,
}: EndpointStatsDockerProps) {
  if (snapshots.length === 0) {
    return (
      <div className="blocklist-item-line endpoint-item">
        <span className="blocklist-item-desc">No snapshot available</span>
      </div>
    );
  }

  const snapshot = snapshots[0];

  const containersCount =
    snapshot.RunningContainerCount + snapshot.StoppedContainerCount;

  return (
    <div className="blocklist-item-line endpoint-item">
      <span className="blocklist-item-desc">
        <span>
          <span style={{ padding: '0 7px 0 0' }}>
            <i className="fa fa-th-list space-right" aria-hidden="true" />
            <span className="space-right">{snapshot.StackCount}</span>
            {snapshot.StackCount === 1 ? 'stack' : 'stacks'}
          </span>

          {snapshot.Swarm ? (
            <span style={{ padding: '0 7px 0 7px' }}>
              <i className="fa fa-list-alt space-right" aria-hidden="true" />
              <span className="space-right">{snapshot.ServiceCount}</span>
              {snapshot.ServiceCount === 1 ? 'service' : 'services'}
            </span>
          ) : null}

          <span style={{ padding: '0 7px 0 7px' }}>
            <i className="fa fa-cubes space-right" aria-hidden="true" />
            <span className="space-right">{containersCount}</span>
            {containersCount === 1 ? 'container' : 'containers'}
            {containersCount > 0 && (
              <span>
                <span className="space-right space-left">-</span>
                <span className="space-right">
                  <i
                    className="fa fa-power-off green-icon space-right"
                    aria-hidden="true"
                  />
                  {snapshot.RunningContainerCount}
                </span>
                <span className="space-right">
                  <i
                    className="fa fa-power-off red-icon space-right"
                    aria-hidden="true"
                  />
                  {snapshot.StoppedContainerCount}
                </span>
                <span className="space-right space-left">/</span>
                <span className="space-right">
                  <i
                    className="fa fa-heartbeat green-icon space-right"
                    aria-hidden="true"
                  />
                  {snapshot.HealthyContainerCount}
                </span>
                <span className="space-right">
                  <i
                    className="fa fa-heartbeat orange-icon space-right"
                    aria-hidden="true"
                  />
                  {snapshot.UnhealthyContainerCount}
                </span>
              </span>
            )}
          </span>

          <span style={{ padding: '0 7px 0 7px' }}>
            <i className="fa fa-hdd space-right" aria-hidden="true" />
            <span className="space-right">{snapshot.VolumeCount}</span>
            {snapshot.VolumeCount === 1 ? 'volume' : 'volumes'}
          </span>

          <span style={{ padding: '0 7px 0 7px' }}>
            <i className="fa fa-clone space-right" aria-hidden="true" />
            <span className="space-right">{snapshot.ImageCount}</span>
            {snapshot.ImageCount === 1 ? 'image' : 'images'}
          </span>
        </span>
      </span>

      <span className="small text-muted">
        {snapshot.Swarm ? 'Swarm' : 'Standalone'} {snapshot.DockerVersion}
        {type === 2 && (
          <span>
            + <i className="fa fa-bolt" aria-hidden="true" /> Agent
          </span>
        )}
        {snapshot.Swarm && (
          <span style={{ padding: '0 7px 0 0' }}>
            <i
              className="fa fa-hdd space-left space-right"
              aria-hidden="true"
            />
            <span className="space-right">{snapshot.NodeCount}</span>
            {snapshot.NodeCount === 1 ? 'node' : 'nodes'}
          </span>
        )}
      </span>
    </div>
  );
}
