export const BASE_URL = 'https://auralis-online.ru/api/v1';

export const getRegisterBaseUrl = () => {
  return BASE_URL.endsWith('/api/v1') ? BASE_URL.slice(0, -'/api/v1'.length) : BASE_URL;
};
