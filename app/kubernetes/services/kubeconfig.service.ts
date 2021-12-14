import { saveAs } from 'file-saver';
import { AxiosError } from 'axios';

import axios from '@/portainer/services/axios';
import { EnvironmentId } from '@/portainer/environments/types';
import { publicSettings } from '@/portainer/services/api/settings.service';

const baseUrl = 'kubernetes';

export async function downloadKubeconfigFile(environmentIds: EnvironmentId[]) {
  try {
    const { headers, data } = await axios.get<Blob>(`${baseUrl}/config`, {
      params: JSON.stringify(environmentIds),
      responseType: 'blob',
      headers: {
        Accept: 'text/yaml',
      },
    });
    const contentDispositionHeader = headers['content-disposition'];
    const filename = contentDispositionHeader.replace('attachment;', '').trim();
    saveAs(data, filename);
  } catch (e) {
    let err = e as Error;
    if ('isAxiosError' in err) {
      const axiosErr = err as AxiosError;
      err = new Error(axiosErr.response?.data.message);
    }

    throw err;
  }
}

export async function expiryMessage() {
  const settings = await publicSettings();
  const expiryDays = settings.KubeconfigExpiry;
  const prefix = 'Kubeconfig file will ';
  switch (expiryDays) {
    default:
    case '0':
      return `${prefix}not expire.`;
    case '24h':
      return `${prefix}expire in 1 day.`;
    case '168h':
      return `${prefix}expire in 7 days.`;
    case '720h':
      return `${prefix}expire in 30 days.`;
    case '8640h':
      return `${prefix}expire in 1 year.`;
  }
}
