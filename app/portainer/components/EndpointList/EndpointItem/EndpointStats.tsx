import { Environment, EnvironmentType } from '@/portainer/environments/types';

import { EndpointStatsDocker } from './EndpointStatsDocker';
import { EndpointStatsKubernetes } from './EndpointStatsKubernetes';

interface EndpointStatsProps {
  model: Environment;
}

export function EndpointStats({ model }: EndpointStatsProps) {
  switch (model.Type) {
    case EnvironmentType.KubernetesLocal:
    case EnvironmentType.AgentOnKubernetes:
    case EnvironmentType.EdgeAgentOnKubernetes:
      return <EndpointStatsKubernetes snapshots={model.Kubernetes.Snapshots} />;
    case EnvironmentType.Docker:
    case EnvironmentType.AgentOnDocker:
    case EnvironmentType.EdgeAgentOnDocker:
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
