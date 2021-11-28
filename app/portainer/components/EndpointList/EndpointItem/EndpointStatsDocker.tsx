import clsx from 'clsx';

import { DockerSnapshot } from '@/portainer/environments/types';
import { pluralize } from '@/portainer/helpers/strings';

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
            {pluralize(snapshot.StackCount, 'stack')}
          </span>

          {!!snapshot.Swarm && (
            <span style={{ padding: '0 7px 0 7px' }}>
              <i className="fa fa-list-alt space-right" aria-hidden="true" />
              <span className="space-right">{snapshot.ServiceCount}</span>
              {pluralize(snapshot.ServiceCount, 'service')}
            </span>
          )}

          <span style={{ padding: '0 7px 0 7px' }}>
            <i className="fa fa-cubes space-right" aria-hidden="true" />
            <span className="space-right">{containersCount}</span>
            {pluralize(containersCount, 'container')}

            {containersCount > 0 && (
              <span>
                <span className="space-right space-left">-</span>
                <Stat
                  value={snapshot.RunningContainerCount}
                  iconClass="fa-power-off green-icon"
                />
                <Stat
                  value={snapshot.StoppedContainerCount}
                  iconClass="fa-power-off red-icon"
                />
                <span className="space-right space-left">/</span>
                <Stat
                  value={snapshot.HealthyContainerCount}
                  iconClass="fa-heartbeat green-icon"
                />
                <Stat
                  value={snapshot.UnhealthyContainerCount}
                  iconClass="fa-heartbeat orange-icon"
                />
              </span>
            )}
          </span>

          <span style={{ padding: '0 7px 0 7px' }}>
            <i className="fa fa-hdd space-right" aria-hidden="true" />
            <span className="space-right">{snapshot.VolumeCount}</span>
            {pluralize(snapshot.VolumeCount, 'volume')}
          </span>

          <span style={{ padding: '0 7px 0 7px' }}>
            <i className="fa fa-clone space-right" aria-hidden="true" />
            <span className="space-right">{snapshot.ImageCount}</span>
            {pluralize(snapshot.ImageCount, 'image')}
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
            {pluralize(snapshot.NodeCount, 'node')}
          </span>
        )}
      </span>
    </div>
  );
}

interface StatProps {
  value: number;
  iconClass: string;
}

function Stat({ value, iconClass }: StatProps) {
  return (
    <span className="space-right">
      <i className={clsx('fa  space-right', iconClass)} aria-hidden="true" />
      {value}
    </span>
  );
}
