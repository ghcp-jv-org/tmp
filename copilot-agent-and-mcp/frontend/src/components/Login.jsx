import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // generated-by-copilot: Updated to use new REST endpoint /api/v1/auth/tokens
      const res = await fetch('http://localhost:4000/api/v1/auth/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      // generated-by-copilot: Handle new standardized error response format
      if (!res.ok) {
        throw new Error(data.error?.message || data.message || 'Login failed');
      }
      
      // Username and token are now stored in Redux and localStorage by setUser
      dispatch(setUser({ token: data.token, username }));
      navigate('/favorites');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input
        name="username"
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button id="login" type="submit">Login</button>
    </form>
  );
};

export default Login;
