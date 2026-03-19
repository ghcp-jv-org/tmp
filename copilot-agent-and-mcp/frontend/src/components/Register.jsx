import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // generated-by-copilot: Updated to use new REST endpoint /api/v1/users
      const res = await fetch('http://localhost:4000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      // generated-by-copilot: Handle new standardized error response format
      if (!res.ok) {
        const errorMessage = data.error?.message || data.message || 'Registration failed';
        // generated-by-copilot: Show detailed validation errors if available
        const details = data.error?.details;
        if (details && details.length > 0) {
          throw new Error(`${errorMessage}: ${details.join(', ')}`);
        }
        throw new Error(errorMessage);
      }
      
      setSuccess('Registration successful! You can now log in.');
      // redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
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
      <button id="register" type="submit">Register</button>
    </form>
  );
};

export default Register;
