import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import type { LoginFormState } from '../types';

const initialState: LoginFormState = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const updateField = (field: keyof LoginFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await api.post('/auth/login', form);
      setMessage(response.data.message ?? 'Login successful.');
    } catch (submitError) {
      setError('Login failed. Check your credentials or backend connection.');
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-copy card">
        <span className="eyebrow">Welcome back</span>
        <h1>Login Page</h1>
        <p>Use the registered email address and password to access the bookstore system.</p>
        <div className="auth-note">
          <p>
            New user? <Link to="/register">Create an account here.</Link>
          </p>
        </div>
      </div>

      <form className="card auth-form" onSubmit={handleSubmit}>
        <label>
          Email Address
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="student@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            placeholder="Enter password"
            required
          />
        </label>

        <button className="primary-btn" type="submit">
          Login
        </button>

        {message ? <p className="status success">{message}</p> : null}
        {error ? <p className="status error">{error}</p> : null}
      </form>
    </section>
  );
}
