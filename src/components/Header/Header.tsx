import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { LogoIcon, TriangleIcon } from "../icons";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { to: "/", label: "Мои расходы", desktop: true },
  { to: "/new", label: "Новый расход", desktop: false },
  { to: "/analytics", label: "Анализ расходов", desktop: true },
];

function getCurrentItem(pathname: string) {
  if (pathname.startsWith("/analytics")) return NAV_ITEMS[2];
  if (pathname.startsWith("/new")) return NAV_ITEMS[1];
  return NAV_ITEMS[0];
}

function MobileMenu() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const current = getCurrentItem(pathname);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <div className={styles.menu} ref={menuRef}>
      <button
        type="button"
        className={styles.menuButton}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={styles.active}>{current.label}</span>
        <TriangleIcon />
      </button>
      {isOpen && (
        <nav className={styles.dropdown}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={[
                styles.dropdownLink,
                item === current && styles.selected,
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

export function Header() {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <LogoIcon aria-label="Skypro.Wallet" />
        </Link>

        {user && !isMobile && (
          <nav className={styles.nav}>
            {NAV_ITEMS.filter((item) => item.desktop).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [styles.link, isActive && styles.active]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        {user && (
          <div className={styles.right}>
            {isMobile && <MobileMenu />}
            <button type="button" className={styles.logout} onClick={logout}>
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
