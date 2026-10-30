import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { Calendar } from "../../components/Calendar/Calendar";
import { ExpensesChart } from "../../components/ExpensesChart/ExpensesChart";
import { BottomBar, PageTitle } from "../../components/Layout/Layout";
import layoutStyles from "../../components/Layout/Layout.module.css";
import { useTransactions } from "../../context/transactions/useTransactions";
import { useIsMobile } from "../../hooks/useMediaQuery";
import {
  getCalendarMonths,
  periodToSearch,
  readPeriod,
  type Period,
} from "../../utils/period";
import styles from "./AnalyticsPage.module.css";

export function AnalyticsPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { transactions } = useTransactions();
  const [searchParams, setSearchParams] = useSearchParams();
  const period = readPeriod(searchParams);
  const months = useMemo(
    () => getCalendarMonths(transactions, period),
    [transactions],
  );

  const setPeriod = (next: Period) =>
    setSearchParams(new URLSearchParams(periodToSearch(next)), {
      replace: true,
    });

  if (isMobile) {
    return (
      <>
        <PageTitle>Анализ расходов</PageTitle>
        <ExpensesChart transactions={transactions} period={period} />
        <BottomBar>
          <Button
            onClick={() =>
              navigate(`/analytics/period${periodToSearch(period)}`)
            }
          >
            Выбрать другой период
          </Button>
        </BottomBar>
      </>
    );
  }

  return (
    <>
      <PageTitle>Анализ расходов</PageTitle>
      <div className={styles.grid}>
        <section className={`${layoutStyles.card} ${styles.periodCard}`}>
          <h2 className={styles.periodTitle}>Период</h2>
          <Calendar
            className={styles.calendar}
            months={months}
            period={period}
            onChange={setPeriod}
          />
        </section>
        <section className={`${layoutStyles.card} ${styles.chartCard}`}>
          <ExpensesChart transactions={transactions} period={period} />
        </section>
      </div>
    </>
  );
}
