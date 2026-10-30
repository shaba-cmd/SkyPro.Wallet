import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { GuestOnly, RequireAuth } from "./components/RouteGuards";
import { AnalyticsPage } from "./pages/AnalyticsPage/AnalyticsPage";
import { ExpensesPage } from "./pages/ExpensesPage/ExpensesPage";
import { LoginPage } from "./pages/LoginPage";
import { NewExpensePage } from "./pages/NewExpensePage";
import { PeriodPage } from "./pages/PeriodPage";
import { RegisterPage } from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/" element={<ExpensesPage />} />
          <Route path="/new" element={<NewExpensePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/analytics/period" element={<PeriodPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
