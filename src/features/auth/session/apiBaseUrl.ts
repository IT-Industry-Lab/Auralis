export const AUTH_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://auralis-online.ru/api/v1'
).replace(/\/$/, '');
