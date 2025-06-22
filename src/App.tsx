import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import { useUserStore } from "./stores/user";

const AppRoutes = () => {
  const { user } = useUserStore();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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

const App = () => (
  <>
    <Sonner position="top-right" />
    <BrowserRouter>
      <AuthLayout>
        <AppRoutes />
      </AuthLayout>
    </BrowserRouter>
  </>
);

export default App;
