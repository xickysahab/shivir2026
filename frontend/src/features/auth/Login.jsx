import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.styles';

export default function Login() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isAdmin) {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: loginId, password }),
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userRole', 'admin');
          navigate('/admin');
        } else {
          setError(data.message || 'Invalid admin credentials');
        }
      } else {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login_id: loginId, password }),
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userName', data.name);
          localStorage.setItem('userRole', data.role);
          if (data.level) localStorage.setItem('userLevel', data.level);
          navigate(data.role === 'teacher' ? '/teacher' : '/mentor');
        } else {
          setError(data.message || 'Invalid Login ID or Password');
        }
      }
    } catch (err) {
      setError('Unable to connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Animated Background Orbs */}
      <div style={styles.orb1}></div>
      <div style={styles.orb2}></div>
      <div style={styles.orb3}></div>

      {/* Grid Pattern Overlay */}
      <div style={styles.gridOverlay}></div>

      {/* Brand */}
      <div style={{ ...styles.brand, animation: 'slideDown 0.6s ease' }}>
        <div style={styles.logoMark}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
            <text x="14" y="19" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Inter, sans-serif">S</text>
          </svg>
        </div>
        <span style={styles.logoText}>Shivir 2026</span>
      </div>

      {/* Heading */}
      <h1 style={{ ...styles.heading, animation: 'slideUp 0.6s ease 0.1s both' }}>
        {isAdmin ? 'Admin Portal' : 'Welcome Back'}
      </h1>
      <p style={{ ...styles.subheading, animation: 'slideUp 0.6s ease 0.15s both' }}>
        {isAdmin ? 'Sign in to the admin dashboard' : 'Sign in to continue to your dashboard'}
      </p>

      {/* Toggle Tabs */}
      <div style={{ ...styles.tabContainer, animation: 'slideUp 0.6s ease 0.2s both' }}>
        <div style={styles.tabBg}>
          <button
            type="button"
            onClick={() => { setIsAdmin(false); setError(''); }}
            style={{
              ...styles.tab,
              ...(! isAdmin ? styles.tabActive : {}),
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            User
          </button>
          <button
            type="button"
            onClick={() => { setIsAdmin(true); setError(''); }}
            style={{
              ...styles.tab,
              ...(isAdmin ? styles.tabActive : {}),
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Admin
          </button>
        </div>
      </div>

      {/* Login Card */}
      <div style={{ ...styles.card, animation: 'slideUp 0.6s ease 0.25s both' }}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Login ID / Username */}
          <div style={styles.fieldGroup}>
            <label htmlFor="loginId" style={styles.label}>
              {isAdmin ? 'Username' : 'Login ID'}
            </label>
            <div style={styles.inputWrapper} className="input-focus-ring">
              <div style={styles.inputIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <input
                type="text"
                id="loginId"
                placeholder={isAdmin ? 'admin' : 'e.g. rahul_123'}
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.inputWrapper} className="input-focus-ring">
              <div style={styles.inputIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={styles.errorBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.25)';
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                Sign In
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p style={{ ...styles.footer, animation: 'fadeIn 0.6s ease 0.4s both' }}>
        Shivir 2026 • Event Management Portal
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
