import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | undefined>();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') await login(email, password);
      else await register(name, email, password, 'student');
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="login-page">
      <h2 className="login-page__title">{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form className="login-page__form" onSubmit={onSubmit}>
        {mode === 'register' && (
          <label className="login-page__field">
            <span className="login-page__label">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        )}
        <label className="login-page__field">
          <span className="login-page__label">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="login-page__field">
          <span className="login-page__label">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div className="login-page__error">{error}</div>}
        <div className="login-page__actions">
          <button className="login-page__submit" type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
          <button type="button" className="login-page__toggle" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

