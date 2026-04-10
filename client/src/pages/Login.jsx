import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleEmailLogin = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login-email', { email });
      login(res.data.token, res.data.user);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email');
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at top left, #1e293b, #0f172a)'
    }}>
      <div className="card glass" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '3rem' }}>
        <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Layout color="white" size={32} />
        </div>
        <h1 style={{ marginBottom: '0.5rem', color: 'white' }}>Welcome Back</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem' }}>Collaborate and manage your projects with ease.</p>
        
        <form onSubmit={handleEmailLogin} style={{ marginBottom: '1.5rem' }}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            required
            className="card"
            style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Access with Email
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.2)' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid currentColor' }} />
          <span style={{ fontSize: '0.8rem' }}>OR</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid currentColor' }} />
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="btn-primary"
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px',
            background: 'white',
            color: '#1e293b',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
          }}
        >
          <FaGoogle color="#ea4335" /> Sign in with Google
        </button>
        
        <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>
          Only authorized team members can access.
        </p>
      </div>
    </div>
  );
};

export default Login;

