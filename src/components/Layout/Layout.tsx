import type { ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import { BackIcon } from "../icons";
import styles from "./Layout.module.css";

export function Layout() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className={styles.title}>{children}</h1>;
}

export function BackLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link to={to} className={styles.back}>
      <BackIcon />
      {children}
    </Link>
  );
}

export function BottomBar({ children }: { children: ReactNode }) {
  return <div className={styles.bottomBar}>{children}</div>;
}
