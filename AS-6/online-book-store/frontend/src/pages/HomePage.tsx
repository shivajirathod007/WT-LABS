import { Link } from 'react-router-dom';

const highlights = [
  {
    title: 'Curated Titles',
    description: 'A simple catalogue layout that showcases academic, fiction, and reference books.',
  },
  {
    title: 'Fast Registration',
    description: 'New users can register directly and save their profile in MongoDB.',
  },
  {
    title: 'Responsive Layout',
    description: 'The interface adapts cleanly to mobile, tablet, and desktop screens.',
  },
];

export default function HomePage() {
  return (
    <section className="hero-grid">
      <div className="hero-copy">
        <span className="eyebrow">Online Book Store</span>
        <h1>Browse, register, and manage books in a polished full-stack demo.</h1>
        <p>
          This academic project uses React with TypeScript on the frontend, Spring Boot on the
          backend, and MongoDB for storing user registrations and book data.
        </p>
        <div className="hero-actions">
          <Link className="primary-btn" to="/catalogue">
            Explore Catalogue
          </Link>
          <Link className="secondary-btn" to="/register">
            Create Account
          </Link>
        </div>
      </div>

      <div className="hero-panel">
        <div className="panel-card accent">
          <p>What is included</p>
          <h2>Home, Login, Catalogue, and Registration pages</h2>
          <span>Spring Boot API + MongoDB database</span>
        </div>
        <div className="panel-list">
          {highlights.map((item) => (
            <article key={item.title} className="mini-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
