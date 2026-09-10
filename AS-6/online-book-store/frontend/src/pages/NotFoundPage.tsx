import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="card not-found">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <p>The requested route does not exist in the bookstore project.</p>
      <Link className="primary-btn" to="/">
        Return Home
      </Link>
    </section>
  );
}
