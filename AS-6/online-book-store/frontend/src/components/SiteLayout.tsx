import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
];

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">B</span>
          <span>
            <strong>BookNest</strong>
            <small>Online Book Store</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="content">{children}</main>

      <footer className="footer">
        <p>Responsive bookstore demo for academic submission.</p>
      </footer>
    </div>
  );
}
