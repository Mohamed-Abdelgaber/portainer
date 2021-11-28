import { Environment, PlatformType } from '@/portainer/environments/types';
import { getPlatformType } from '@/portainer/environments/utils';

import { EndpointStatsDocker } from './EndpointStatsDocker';
import { EndpointStatsKubernetes } from './EndpointStatsKubernetes';

interface EndpointStatsProps {
  model: Environment;
}

export function EndpointStats({ model }: EndpointStatsProps) {
  const platform = getPlatformType(model.Type);
  switch (platform) {
    case PlatformType.Kubernetes:
      return <EndpointStatsKubernetes snapshots={model.Kubernetes.Snapshots} />;
    case PlatformType.Docker:
      return (
        <EndpointStatsDocker snapshots={model.Snapshots} type={model.Type} />
      );
    default:
      return (
        <div className="blocklist-item-line endpoint-item">
          <span className="blocklist-item-desc">-</span>
        </div>
      );
  }
}
