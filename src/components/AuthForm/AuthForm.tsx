import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../Button/Button";
import { Header } from "../Header/Header";
import { Input } from "../Input/Input";
import styles from "./AuthForm.module.css";

export interface AuthField {
  name: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  validate: (value: string) => boolean;
}

interface Props {
  title: string;
  submitLabel: string;
  fields: AuthField[];
  footerText: string;
  footerLink: { to: string; label: string };
  onSubmit: (values: Record<string, string>) => Promise<void>;
}

const ERROR_MESSAGE =
  "Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку.";

export function AuthForm({
  title,
  submitLabel,
  fields,
  footerText,
  footerLink,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, ""])),
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** Ответ сервера, например «Пользователь с таким логином уже существует» */
  const [serverError, setServerError] = useState<string | null>(null);
  const hasErrors = Object.values(errors).some(Boolean);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (serverError !== null) {
      setServerError(null);
      setErrors({});
    } else {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = Object.fromEntries(
      fields.map((field) => [field.name, !field.validate(values[field.name])]),
    );
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setErrors(Object.fromEntries(fields.map((field) => [field.name, true])));
      setServerError(err instanceof Error ? err.message : "");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.page}>
        <form className={styles.card} onSubmit={handleSubmit} noValidate>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.fields}>
            {fields.map((field) => (
              <Input
                key={field.name}
                name={field.name}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                aria-label={field.placeholder}
                value={values[field.name]}
                error={errors[field.name]}
                markRequired
                onChange={(event) =>
                  handleChange(field.name, event.target.value)
                }
              />
            ))}
          </div>
          {hasErrors && (
            <p className={styles.error}>
              {ERROR_MESSAGE}
              {serverError && (
                <>
                  <br />
                  {serverError}
                </>
              )}
            </p>
          )}
          <Button
            type="submit"
            className={styles.submit}
            disabled={hasErrors || isSubmitting}
          >
            {submitLabel}
          </Button>
          <p className={styles.footer}>
            {footerText}
            <br />
            <Link to={footerLink.to}>{footerLink.label}</Link>
          </p>
        </form>
      </main>
    </>
  );
}
