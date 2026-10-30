import { Navigate, useNavigate } from "react-router-dom";
import { ExpenseForm } from "../components/ExpenseForm/ExpenseForm";
import { BackLink, PageTitle } from "../components/Layout/Layout";
import { useIsMobile } from "../hooks/useMediaQuery";

export function NewExpensePage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (!isMobile) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <BackLink to="/">Мои расходы</BackLink>
      <PageTitle>Новый расход</PageTitle>
      <ExpenseForm isMobile onAdded={() => navigate("/")} />
    </>
  );
}
