import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import { TransactionsProvider } from "../context/transactions/TransactionsProvider";

export function RequireAuth() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <TransactionsProvider key={user.id} token={user.token}>
      <Outlet />
    </TransactionsProvider>
  );
}

export function GuestOnly() {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
