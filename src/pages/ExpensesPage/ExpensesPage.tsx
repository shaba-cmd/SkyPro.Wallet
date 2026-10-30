import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { ExpenseForm } from "../../components/ExpenseForm/ExpenseForm";
import { ExpensesTable } from "../../components/ExpensesTable/ExpensesTable";
import { PlusCircleIcon } from "../../components/icons";
import { BottomBar, PageTitle } from "../../components/Layout/Layout";
import layoutStyles from "../../components/Layout/Layout.module.css";
import { useTransactions } from "../../context/transactions/useTransactions";
import { useIsMobile } from "../../hooks/useMediaQuery";
import styles from "./ExpensesPage.module.css";

export function ExpensesPage() {
  const isMobile = useIsMobile();
  const { transactions, isLoading, error, deleteTransaction } =
    useTransactions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const message = isLoading ? "Загрузка..." : error;

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      setSelectedId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Не удалось удалить расход");
    }
  };

  if (isMobile) {
    return (
      <>
        <div className={styles.titleRow}>
          <PageTitle>Мои расходы</PageTitle>
          <Link to="/new" className={styles.newLink}>
            <PlusCircleIcon />
            Новый расход
          </Link>
        </div>
        <ExpensesTable
          transactions={transactions}
          message={message}
          isMobile
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <BottomBar>
          <Button
            disabled={!selectedId}
            onClick={() => selectedId && handleDelete(selectedId)}
          >
            Удалить расход
          </Button>
        </BottomBar>
      </>
    );
  }

  return (
    <>
      <PageTitle>Мои расходы</PageTitle>
      <div className={styles.grid}>
        <ExpensesTable
          title="Таблица расходов"
          transactions={transactions}
          message={message}
          isMobile={false}
          onDelete={handleDelete}
        />
        <section className={`${layoutStyles.card} ${styles.formCard}`}>
          <ExpenseForm isMobile={false} />
        </section>
      </div>
    </>
  );
}
