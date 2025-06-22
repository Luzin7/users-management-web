import { env } from '@/env';
import { createApiClient } from '../../lib/createApiClient';

const apiUrl =
  env.VITE_ENV === 'development'
    ? 'http://localhost:8080'
    : env.VITE_API_URL;

export const apiPrivateClient = createApiClient({
  baseURL: apiUrl,
  withCredentials: true,
  includeAuthTokens: true,
  headers: { 'Content-Type': 'application/json' },
});

export const apiPublicClient = createApiClient({
  baseURL: apiUrl,
  withCredentials: true,
  includeAuthTokens: false,
  headers: { 'Content-Type': 'application/json' },
});