import type { Book } from '../types';

export default function BookCard({ book }: { book: Book }) {
  return (
    <article className="book-card">
      <div className="book-cover">
        <img src={book.coverUrl} alt={book.title} />
      </div>
      <div className="book-info">
        <span className="pill">{book.genre}</span>
        <h3>{book.title}</h3>
        <p className="author">By {book.author}</p>
        <p className="description">{book.description}</p>
        <div className="book-footer">
          <strong>Rs. {book.price.toFixed(2)}</strong>
          {book.featured ? <span className="feature-tag">Featured</span> : null}
        </div>
      </div>
    </article>
  );
}
