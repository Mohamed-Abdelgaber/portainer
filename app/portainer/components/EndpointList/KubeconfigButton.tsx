import * as kcService from '@/kubernetes/services/kubeconfig.service';
import * as notifications from '@/portainer/services/notifications';
import { confirmKubeconfigSelection } from '@/portainer/services/modal.service/prompt';
import { Environment } from '@/portainer/environments/types';
import { isKubernetesEnvironment } from '@/portainer/environments/utils';

interface Props {
  endpoints?: Environment[];
}

export function KubeconfigButton({ endpoints }: Props) {
  if (!endpoints) {
    return null;
  }

  if (!isKubeconfigButtonVisible(endpoints)) {
    return null;
  }

  return (
    <button
      type="button"
      className="btn btn-sm btn-primary"
      onClick={() => showKubeconfigModal(endpoints)}
      analytics-on
      analytics-category="kubernetes"
      analytics-event="kubernetes-kubectl-kubeconfig-multi"
    >
      <i className="fas fa-download space-right" /> kubeconfig
    </button>
  );
}

function isKubeconfigButtonVisible(endpoints: Environment[]) {
  if (window.location.protocol !== 'https:') {
    return false;
  }
  return endpoints.some((endpoint) => isKubernetesEnvironment(endpoint.Type));
}

async function showKubeconfigModal(endpoints: Environment[]) {
  const kubeEnvironments = endpoints.filter((endpoint) =>
    isKubernetesEnvironment(endpoint.Type)
  );
  const options = kubeEnvironments.map((environment) => ({
    text: `${environment.Name} (${environment.URL})`,
    value: `${environment.Id}`,
  }));

  let expiryMessage = '';
  try {
    expiryMessage = await kcService.expiryMessage();
  } catch (e) {
    notifications.error('Failed fetching kubeconfig expiry time', e as Error);
  }

  confirmKubeconfigSelection(
    options,
    expiryMessage,
    async (selectedEnvironmentIDs: string[]) => {
      if (selectedEnvironmentIDs.length === 0) {
        notifications.warning('No environment was selected', '');
        return;
      }
      try {
        await kcService.downloadKubeconfigFile(
          selectedEnvironmentIDs.map((id) => parseInt(id, 10))
        );
      } catch (e) {
        notifications.error('Failed downloading kubeconfig file', e as Error);
      }
    }
  );
}
