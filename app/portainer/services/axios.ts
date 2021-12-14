import axiosOrigin, { AxiosRequestConfig } from 'axios';

import { get as localStorageGet } from '../hooks/useLocalStorage';

import {
  portainerAgentManagerOperation,
  portainerAgentTargetHeader,
} from './http-request.helper';

const axios = axiosOrigin.create({ baseURL: '/api' });

export default axios;

axios.interceptors.request.use(async (config) => {
  const newConfig = { ...config };

  const jwt = localStorageGet('JWT', '');
  if (jwt) {
    newConfig.headers = {
      Authorization: `Bearer ${jwt}`,
    };
  }

  return newConfig;
});

export function agentInterceptor(config: AxiosRequestConfig) {
  if (!config.url || !config.url.includes('/docker/')) {
    return config;
  }

  const newConfig = { headers: config.headers || {}, ...config };

  newConfig.headers['X-PortainerAgent-Target'] = portainerAgentTargetHeader();
  if (portainerAgentManagerOperation()) {
    newConfig.headers['X-PortainerAgent-ManagerOperation'] = '1';
  }

  return newConfig;
}

axios.interceptors.request.use(agentInterceptor);
