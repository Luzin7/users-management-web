// src/services/api/createApiClient.ts
import { apiPublicClient } from "@/services/api/client";
import { useAuthStore } from "@/stores/auth";
import { isTokenExpired } from "@/utils/jwt/isTokenExpired";
import axios, { CreateAxiosDefaults, InternalAxiosRequestConfig } from "axios";

export function createApiClient({
  includeAuthTokens,
  ...axiosConfig
}: { includeAuthTokens?: boolean } & CreateAxiosDefaults) {
  let isRefreshing = false;
  let refreshSubscribers: ((token: string) => void)[] = [];

  function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
  }

  function onRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
  }

  const client = axios.create(axiosConfig);

  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (!includeAuthTokens) return config;

      let accessToken =
        sessionStorage.getItem("accessToken")

      if (!accessToken || isTokenExpired(accessToken)) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const { data } = await apiPublicClient.post(
              "/auth/refresh",
              {},
              { withCredentials: true }
            );
            accessToken = data.accessToken;
            sessionStorage.setItem("accessToken", accessToken);
            useAuthStore.getState().setAccessToken(accessToken);
            onRefreshed(accessToken);
            config.headers.Authorization = `Bearer ${accessToken}`;
          } catch {
            sessionStorage.removeItem("accessToken");
            useAuthStore.getState().clearAccessToken();
            window.location.href = "/login";
          } finally {
            isRefreshing = false;
          }
        } else {
          await new Promise<void>((resolve) => {
            subscribeTokenRefresh((token: string) => {
              config.headers.Authorization = `Bearer ${token}`;
              resolve();
            });
          });
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    }
  );

  return client;
}
