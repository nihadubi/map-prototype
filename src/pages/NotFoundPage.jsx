import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="stack">
      <h1>Page not found</h1>
      <p className="muted">The page you requested does not exist.</p>
      <div>
        <Link to="/">Back to map</Link>
      </div>
    </section>
  );
}
