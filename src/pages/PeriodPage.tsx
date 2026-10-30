import { useMemo, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button/Button";
import { Calendar } from "../components/Calendar/Calendar";
import { BackLink, BottomBar, PageTitle } from "../components/Layout/Layout";
import { useTransactions } from "../context/transactions/useTransactions";
import { useIsMobile } from "../hooks/useMediaQuery";
import { getCalendarMonths, periodToSearch, readPeriod } from "../utils/period";

export function PeriodPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { transactions } = useTransactions();
  const [searchParams] = useSearchParams();
  const [period, setPeriod] = useState(() => readPeriod(searchParams));
  const months = useMemo(
    () => getCalendarMonths(transactions, period),
    [transactions],
  );

  if (!isMobile) {
    return <Navigate to={`/analytics?${searchParams}`} replace />;
  }

  const analyticsUrl = `/analytics${periodToSearch(period)}`;

  return (
    <>
      <BackLink to={analyticsUrl}>Анализ расходов</BackLink>
      <PageTitle>Выбор периода</PageTitle>
      <Calendar months={months} period={period} onChange={setPeriod} />
      <BottomBar>
        <Button onClick={() => navigate(analyticsUrl)}>Выбрать период</Button>
      </BottomBar>
    </>
  );
}
