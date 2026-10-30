import { AuthForm } from "../components/AuthForm/AuthForm";
import { useAuth } from "../context/auth/useAuth";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
} from "../utils/validation";

const FIELDS = [
  {
    name: "name",
    placeholder: "Имя",
    autoComplete: "name",
    validate: isValidName,
  },
  {
    name: "login",
    placeholder: "Эл. почта",
    type: "email",
    autoComplete: "email",
    validate: isValidEmail,
  },
  {
    name: "password",
    placeholder: "Пароль",
    type: "password",
    autoComplete: "new-password",
    validate: isValidPassword,
  },
];

export function RegisterPage() {
  const { register } = useAuth();

  return (
    <AuthForm
      title="Регистрация"
      submitLabel="Зарегистрироваться"
      fields={FIELDS}
      footerText="Уже есть аккаунт?"
      footerLink={{ to: "/login", label: "Войдите здесь" }}
      onSubmit={(values) =>
        register(values.name.trim(), values.login.trim(), values.password)
      }
    />
  );
}
