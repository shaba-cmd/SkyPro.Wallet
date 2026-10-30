import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  error?: boolean;
  markRequired?: boolean;
}

export function Input({
  error = false,
  markRequired = false,
  className,
  value,
  placeholder = "",
  type,
  ...props
}: Props) {
  const mirrorValue = type === "password" ? "•".repeat(value.length) : value;

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      <input
        className={[styles.input, error && styles.error]
          .filter(Boolean)
          .join(" ")}
        value={value}
        placeholder={placeholder || " "}
        type={type}
        aria-invalid={error}
        {...props}
      />
      {error && markRequired && (
        <span className={styles.mirror} aria-hidden="true">
          {mirrorValue ? (
            <span className={styles.mirrorText}>{mirrorValue}</span>
          ) : (
            <span className={styles.mirrorPlaceholder}>{placeholder}</span>
          )}
          <span className={styles.star}>*</span>
        </span>
      )}
    </div>
  );
}
