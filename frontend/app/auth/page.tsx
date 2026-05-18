'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const res = await fetch(`${API}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        setSuccess('Account created! You can now sign in.');
        setIsLogin(true);
        setPassword('');
      }
    } catch {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    transition: 'var(--transition)',
    outline: 'none',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--accent)';
    e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--border)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '16px 24px',
          }}
        >
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              🏠
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>ServiceBoard</span>
          </Link>
        </div>
      </header>

      {/* Auth form */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div
          className="animate-fade-in-up"
          style={{
            width: '100%',
            maxWidth: '400px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '36px',
          }}
        >
          {/* Icon */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                display: 'inline-flex',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '16px',
              }}
            >
              {isLogin ? '👋' : '✨'}
            </div>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
              {isLogin
                ? 'Sign in to post and manage service requests'
                : 'Register to start posting service requests'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="animate-slide-down"
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--danger-bg)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--danger)',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              className="animate-slide-down"
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--success-bg)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: 'var(--success)',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Email
              </label>
              <input
                id="email-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Password
              </label>
              <input
                id="password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={inputStyle}
              />
            </div>

            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: loading
                  ? 'var(--text-muted)'
                  : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'var(--transition)',
                boxShadow: loading ? 'none' : '0 0 20px rgba(59, 130, 246, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.35)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = loading
                  ? 'none'
                  : '0 0 20px rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading
                ? isLogin
                  ? 'Signing in...'
                  : 'Creating account...'
                : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border)',
            }}
          >
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}