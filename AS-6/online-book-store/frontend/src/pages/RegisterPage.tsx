import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import type { RegisterFormState } from '../types';

const initialState: RegisterFormState = {
  name: '',
  email: '',
  password: '',
  phone: '',
  address: '',
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const updateField = (field: keyof RegisterFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await api.post('/auth/register', form);
      setMessage(response.data.message ?? 'Registration successful.');
      setForm(initialState);
    } catch (submitError) {
      setError('Registration failed. Check the form data or backend connection.');
    }
  };

  return (
    <section className="auth-layout register-layout">
      <div className="auth-copy card">
        <span className="eyebrow">Join the store</span>
        <h1>Registration Page</h1>
        <p>Store student or customer details in MongoDB for the bookstore application.</p>
        <div className="auth-note">
          <p>
            Already registered? <Link to="/login">Go back to login.</Link>
          </p>
        </div>
      </div>

      <form className="card auth-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Enter full name"
            required
          />
        </label>

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
            placeholder="Create password"
            required
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            placeholder="9876543210"
            required
          />
        </label>

        <label>
          Address
          <textarea
            value={form.address}
            onChange={(event) => updateField('address', event.target.value)}
            placeholder="Enter address"
            rows={4}
            required
          />
        </label>

        <button className="primary-btn" type="submit">
          Register
        </button>

        {message ? <p className="status success">{message}</p> : null}
        {error ? <p className="status error">{error}</p> : null}
      </form>
    </section>
  );
}
