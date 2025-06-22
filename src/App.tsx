import { Toaster as Sonner } from "@/components/ui/sonner";
import { restoreAuthentication } from "@/services/auth/restoreAuthentication";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

const AppRoutes = () => {
  const { user } = useUserStore();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/" replace /> : <Register />} 
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/"
        element={
          user ? (
            user.role === "admin" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/profile" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const { isInitialized, setAccessToken, clearAccessToken, setInitialized } = useAuthStore();
  const { clearUser } = useUserStore();

  useEffect(() => {
    (async () => {
      const { accessToken } = await restoreAuthentication();
      
      if (accessToken) {
        setAccessToken(accessToken);
      } else {
        clearAccessToken();
        clearUser();
      }
      
      setInitialized();
    })();
  }, [setAccessToken, clearAccessToken, clearUser, setInitialized]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Sonner position="top-right" />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
};

export default App;