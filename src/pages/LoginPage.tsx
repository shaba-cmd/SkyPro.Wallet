import { AuthForm } from "../components/AuthForm/AuthForm";
import { useAuth } from "../context/auth/useAuth";
import { isValidEmail } from "../utils/validation";

const FIELDS = [
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
    autoComplete: "current-password",
    validate: (value: string) => value.length > 0,
  },
];

export function LoginPage() {
  const { login } = useAuth();

  return (
    <AuthForm
      title="Вход"
      submitLabel="Войти"
      fields={FIELDS}
      footerText="Нужно зарегистрироваться?"
      footerLink={{ to: "/register", label: "Регистрируйтесь здесь" }}
      onSubmit={(values) => login(values.login.trim(), values.password)}
    />
  );
}
