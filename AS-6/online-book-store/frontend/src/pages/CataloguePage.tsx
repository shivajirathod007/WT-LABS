import { useEffect, useState } from 'react';
import api from '../api/client';
import BookCard from '../components/BookCard';
import type { Book } from '../types';

const fallbackBooks: Book[] = [
  {
    id: '1',
    title: 'Learning React',
    author: 'Alex Banks',
    genre: 'Programming',
    description: 'A practical guide to modern React concepts and component design.',
    price: 499,
    coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    id: '2',
    title: 'Spring Boot in Action',
    author: 'Craig Walls',
    genre: 'Backend',
    description: 'Build production-ready applications with the Spring Boot ecosystem.',
    price: 599,
    coverUrl: 'https://images.unsplash.com/photo-1455885666463-0d4b10be1b34?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    title: 'Database Essentials',
    author: 'R. Malik',
    genre: 'Database',
    description: 'Understand data modeling, queries, and collection-based storage patterns.',
    price: 399,
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
  },
];

export default function CataloguePage() {
  const [books, setBooks] = useState<Book[]>(fallbackBooks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadBooks = async () => {
      try {
        const response = await api.get<Book[]>('/books');
        if (active && response.data.length > 0) {
          setBooks(response.data);
        }
      } catch (requestError) {
        if (active) {
          setError('Showing sample catalogue data because the backend is unavailable.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadBooks();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="catalogue-section">
      <div className="section-heading">
        <span className="eyebrow">Catalogue Page</span>
        <h1>Featured books available in the store</h1>
        <p>
          The catalogue page loads records from the Spring Boot API and falls back to sample data
          if the backend is not connected yet.
        </p>
      </div>

      {loading ? <p className="status info">Loading books...</p> : null}
      {error ? <p className="status warning">{error}</p> : null}

      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
