import { useUserStore } from "@/stores/user";
import { isTokenExpired } from "@/utils/jwt/isTokenExpired";
import { me, refreshToken } from "../api/modules/user";

export async function restoreAuthentication(): Promise<{
  accessToken: string | null;
}> {
  try {
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken && !isTokenExpired(accessToken)) {
      const user = await me();

      if (!user?.success || !user.data) {
        sessionStorage.removeItem("accessToken");
        return { accessToken: null };
      }
      useUserStore.getState().setUser({
        id: user.data.id,
        name: user.data.name,
        email: user.data.email,
        role: user.data.role,
        createdAt: user.data.created_at,
        updatedAt: user.data.updated_at,
        lastLoginAt: user.data.last_login_at,
      });
      return { accessToken };
    }

    const res = await refreshToken();

    if (!res?.success || !res.data?.access_token) {
      sessionStorage.removeItem("accessToken");
      return { accessToken: null };
    }
    sessionStorage.setItem("accessToken", res.data.access_token);

    const user = await me();

    if (!user?.success || !user.data) {
      sessionStorage.removeItem("accessToken");
      return { accessToken: null };
    }
    useUserStore.getState().setUser({
      id: user.data.id,
      name: user.data.name,
      email: user.data.email,
      role: user.data.role,
      createdAt: user.data.created_at,
      updatedAt: user.data.updated_at,
      lastLoginAt: user.data.last_login_at,
    });

    return { accessToken: res.data.access_token };
  } catch (e) {
    sessionStorage.removeItem("accessToken");
    return { accessToken: null };
  }
}
