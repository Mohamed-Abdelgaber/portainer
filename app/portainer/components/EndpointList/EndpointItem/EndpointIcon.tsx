import clsx from 'clsx';

import { endpointTypeIcon } from '@/portainer/filters/filters';
import dockerEdge from '@/assets/images/edge_endpoint.png';
import kube from '@/assets/images/kubernetes_endpoint.png';
import kubeEdge from '@/assets/images/kubernetes_edge_endpoint.png';
import { EnvironmentType } from '@/portainer/environments/types';

interface Props {
  type: EnvironmentType;
}

export function EndpointIcon({ type }: Props) {
  if (type === EnvironmentType.EdgeAgentOnDocker) {
    return (
      <img src={dockerEdge} alt="docker edge endpoint" aria-hidden="true" />
    );
  }

  if (
    [
      EnvironmentType.KubernetesLocal,
      EnvironmentType.AgentOnKubernetes,
    ].includes(type)
  ) {
    return <img src={kube} alt="kubernetes endpoint" aria-hidden="true" />;
  }

  if (type === EnvironmentType.EdgeAgentOnKubernetes) {
    return (
      <img src={kubeEdge} alt="kubernetes edge endpoint" aria-hidden="true" />
    );
  }

  return (
    <i
      className={clsx('fa-4x', 'blue-icon', endpointTypeIcon(type))}
      aria-hidden="true"
    />
  );
}
