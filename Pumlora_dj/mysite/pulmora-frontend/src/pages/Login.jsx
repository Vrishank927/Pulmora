import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import API from '../api/api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const login = async () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await API.post('api-token-auth/', { username, password });
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await API.post('register/', { username, password, email });
      setSuccess('Registration successful! Please login with your credentials.');
      setIsRegistering(false);
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: '400px', width: '100%'}}>
      <Card>
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #007bff, #0056b3)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px'
          }}>
            🔒
          </div>
          <h1 style={{color: '#007bff', fontSize: '2.2rem', marginBottom: '8px'}}>Welcome to Pulmora</h1>
          <p style={{color: '#666', marginBottom: '0'}}>AI Pneumonia Detection Platform</p>
        </div>

        <div style={{display: 'flex', marginBottom: '24px', gap: '12px'}}>
          <button
            onClick={() => {
              setIsRegistering(false);
              setError('');
              setSuccess('');
            }}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              border: isRegistering ? '2px solid #e9ecef' : '2px solid #007bff',
              background: isRegistering ? 'white' : '#007bff',
              color: isRegistering ? '#333' : 'white',
              fontWeight: '500'
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsRegistering(true);
              setError('');
            }}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              border: !isRegistering ? '2px solid #e9ecef' : '2px solid #007bff',
              background: !isRegistering ? 'white' : '#007bff',
              color: !isRegistering ? '#333' : 'white',
              fontWeight: '500'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="error" style={{marginBottom: '20px'}}>
            {error}
          </div>
        )}
        {success && (
          <div className="success" style={{marginBottom: '20px'}}>
            {success}
          </div>
        )}

        <div>
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Username</label>
            <input
              className="input"
              style={{fontSize: '16px'}}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {isRegistering && (
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Email (optional)</label>
              <input
                className="input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Password</label>
            <input
              className="input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button 
            variant="primary"
            loading={loading}
            style={{width: '100%', marginTop: '12px'}}
            onClick={isRegistering ? register : login}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
