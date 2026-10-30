import { useState, type FormEvent } from "react";
import { CATEGORIES } from "../../constants/categories";
import { useTransactions } from "../../context/transactions/useTransactions";
import type { CategoryId } from "../../types";
import { formatSum } from "../../utils/format";
import {
  isValidDescription,
  parseDate,
  parseSum,
} from "../../utils/validation";
import { Button } from "../Button/Button";
import { CATEGORY_ICONS } from "../icons";
import { Input } from "../Input/Input";
import { BottomBar } from "../Layout/Layout";
import styles from "./ExpenseForm.module.css";

type Field = "description" | "category" | "date" | "sum";

interface Props {
  isMobile: boolean;
  onAdded?: () => void;
}

const FORM_ID = "new-expense-form";

function maskDate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)]
    .filter(Boolean)
    .join(".");
}

export function ExpenseForm({ isMobile, onAdded }: Props) {
  const { addTransaction } = useTransactions();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [date, setDate] = useState("");
  const [sum, setSum] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, boolean>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasErrors = Object.values(errors).some(Boolean);

  const clearError = (field: Field) => {
    setErrors((prev) => ({ ...prev, [field]: false }));
    setSubmitError(null);
  };

  const handleSumBlur = () => {
    const parsed = parseSum(sum);
    if (parsed !== null) {
      setSum(isMobile ? formatSum(parsed) : formatSum(parsed).slice(0, -2));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsedDate = parseDate(date);
    const parsedSum = parseSum(sum);
    const nextErrors = {
      description: !isValidDescription(description),
      category: category === null,
      date: parsedDate === null,
      sum: parsedSum === null,
    };
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await addTransaction({
        description: description.trim(),
        category: category!,
        date: parsedDate!,
        sum: parsedSum!,
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Не удалось добавить расход",
      );
      return;
    } finally {
      setIsSubmitting(false);
    }
    setDescription("");
    setCategory(null);
    setDate("");
    setSum("");
    setErrors({});
    onAdded?.();
  };

  const label = (text: string, field: Field) => (
    <span className={styles.label}>
      {text}
      {errors[field] && <span className={styles.star}>*</span>}
    </span>
  );

  const submitButton = (
    <Button
      type="submit"
      form={FORM_ID}
      className={isMobile ? undefined : styles.submit}
      disabled={hasErrors || isSubmitting}
    >
      Добавить новый расход
    </Button>
  );

  return (
    <form
      id={FORM_ID}
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      {!isMobile && <h2 className={styles.title}>Новый расход</h2>}

      <label className={styles.field}>
        {label("Описание", "description")}
        <Input
          placeholder="Введите описание"
          value={description}
          error={errors.description}
          onChange={(event) => {
            setDescription(event.target.value);
            clearError("description");
          }}
        />
      </label>

      <div className={styles.field} role="group" aria-label="Категория">
        {label("Категория", "category")}
        <div className={styles.categories}>
          {CATEGORIES.map(({ id, label: categoryLabel }) => {
            const Icon = CATEGORY_ICONS[id];
            return (
              <button
                key={id}
                type="button"
                className={[styles.chip, category === id && styles.chipSelected]
                  .filter(Boolean)
                  .join(" ")}
                aria-pressed={category === id}
                onClick={() => {
                  setCategory(id);
                  clearError("category");
                }}
              >
                <Icon />
                {categoryLabel}
              </button>
            );
          })}
        </div>
      </div>

      <label className={styles.field}>
        {label("Дата", "date")}
        <Input
          placeholder="Введите дату"
          inputMode="numeric"
          value={date}
          error={errors.date}
          onChange={(event) => {
            setDate(maskDate(event.target.value));
            clearError("date");
          }}
        />
      </label>

      <label className={styles.field}>
        {label("Сумма", "sum")}
        <Input
          placeholder="Введите сумму"
          inputMode="decimal"
          value={sum}
          error={errors.sum}
          onChange={(event) => {
            setSum(event.target.value);
            clearError("sum");
          }}
          onBlur={handleSumBlur}
        />
      </label>

      {submitError && <p className={styles.submitError}>{submitError}</p>}

      {isMobile ? <BottomBar>{submitButton}</BottomBar> : submitButton}
    </form>
  );
}
