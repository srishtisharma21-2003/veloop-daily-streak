import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { register, login as loginApi } from '../services/authApi.js';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = isRegister
        ? await register({ name, email, password })
        : await loginApi({ email, password });
      login(res.data.token, res.data.user);
      navigate('/daily-streak');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>VELoop Rewards</h1>
        <p style={styles.subtitle}>{isRegister ? 'Create your account' : 'Welcome back'}</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <input
              style={styles.input}
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>

        <p style={styles.toggle} onClick={() => { setIsRegister(!isRegister); setError(''); }}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0416 0%, #1a0b2e 50%, #0f0520 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  card: {
    background: 'rgba(30, 15, 60, 0.9)', border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(168, 85, 247, 0.3)'
  },
  title: { color: '#fff', fontSize: '28px', fontWeight: '800', textAlign: 'center', margin: 0 },
  subtitle: { color: '#a78bfa', textAlign: 'center', marginTop: '8px', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  input: {
    padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(168,85,247,0.3)',
    background: 'rgba(15, 8, 30, 0.7)', color: '#fff', fontSize: '15px', outline: 'none'
  },
  button: {
    padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
    background: 'linear-gradient(135deg, #a855f7, #7c3aed)', color: '#fff',
    fontWeight: '700', fontSize: '16px', marginTop: '8px'
  },
  toggle: { color: '#a78bfa', textAlign: 'center', marginTop: '20px', cursor: 'pointer', fontSize: '14px' },
  error: {
    background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239,68,68,0.4)',
    color: '#fca5a5', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px'
  }
};
