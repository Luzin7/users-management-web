import { restoreAuthentication } from "@/services/auth/restoreAuthentication";
import { useAuthStore } from "@/stores/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export const AuthLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { accessToken } = await restoreAuthentication();

      if (accessToken !== null) {
        useAuthStore.getState().setAccessToken(accessToken);
        navigate("/", { replace: true });
      } else {
        useAuthStore.getState().clearAccessToken();
        navigate("/login", { replace: true });
      }

      setIsLoading(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return children;
};
