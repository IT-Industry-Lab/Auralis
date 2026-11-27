import { AUTH_API_BASE_URL } from '../../session/apiBaseUrl';

export const BASE_URL = AUTH_API_BASE_URL;

export const getRegisterBaseUrl = () => {
  return BASE_URL.endsWith('/api/v1') ? BASE_URL.slice(0, -'/api/v1'.length) : BASE_URL;
};
