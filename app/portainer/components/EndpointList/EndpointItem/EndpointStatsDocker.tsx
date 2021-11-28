import clsx from 'clsx';
import { PropsWithChildren } from 'react';

import {
  DockerSnapshot,
  EnvironmentType,
} from '@/portainer/environments/types';
import { pluralize } from '@/portainer/helpers/strings';

import styles from './EndpointStatsDocker.module.css';

interface EndpointStatsDockerProps {
  snapshots: DockerSnapshot[];
  type: EnvironmentType;
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

  return (
    <div className="blocklist-item-line endpoint-item">
      <span className={clsx('blocklist-item-desc', styles.description)}>
        <Stat value={snapshot.StackCount} type="stack" icon="fa-th-list" />

        {!!snapshot.Swarm && (
          <Stat
            value={snapshot.ServiceCount}
            type="service"
            icon="fa-list-alt"
          />
        )}

        <ContainerStats
          running={snapshot.RunningContainerCount}
          stopped={snapshot.StoppedContainerCount}
          healthy={snapshot.HealthyContainerCount}
          unhealthy={snapshot.UnhealthyContainerCount}
        />

        <Stat type="volume" value={snapshot.VolumeCount} icon="fa-hdd" />
        <Stat type="image" value={snapshot.ImageCount} icon="fa-clone" />
      </span>

      <span className="small text-muted">
        {snapshot.Swarm ? 'Swarm' : 'Standalone'} {snapshot.DockerVersion}
        {type === EnvironmentType.AgentOnDocker && (
          <span>
            + <i className="fa fa-bolt" aria-hidden="true" /> Agent
          </span>
        )}
        {snapshot.Swarm && (
          <Stat type="node" value={snapshot.NodeCount} icon="fa-hdd" />
        )}
      </span>
    </div>
  );
}

interface ContainerStatsProps {
  running: number;
  stopped: number;
  healthy: number;
  unhealthy: number;
}

function ContainerStats({
  running,
  stopped,
  healthy,
  unhealthy,
}: ContainerStatsProps) {
  const containersCount = running + stopped;

  return (
    <Stat value={containersCount} type="container" icon="fa-cubes">
      {containersCount > 0 && (
        <span>
          <span className="space-right space-left">-</span>
          <ContainerStat value={running} iconClass="fa-power-off green-icon" />
          <ContainerStat value={stopped} iconClass="fa-power-off red-icon" />
          <span className="space-right space-left">/</span>
          <ContainerStat value={healthy} iconClass="fa-heartbeat green-icon" />
          <ContainerStat
            value={unhealthy}
            iconClass="fa-heartbeat orange-icon"
          />
        </span>
      )}
    </Stat>
  );

  interface ContainerStatProps {
    value: number;
    iconClass: string;
  }

  function ContainerStat({ value, iconClass }: ContainerStatProps) {
    return (
      <span className="space-right">
        <i className={clsx('fa  space-right', iconClass)} aria-hidden="true" />
        {value}
      </span>
    );
  }
}

interface StatProps {
  value: number;
  type: string;
  icon: string;
}

function Stat({ value, type, icon, children }: PropsWithChildren<StatProps>) {
  return (
    <span>
      <i className={clsx('fa space-right', icon)} aria-hidden="true" />
      <span className="space-right">{value}</span>
      {pluralize(value, type)}
      {children}
    </span>
  );
}
