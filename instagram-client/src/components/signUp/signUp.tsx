import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./SignUp.css";
import { User } from '../../App';

export const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post<{ user: User; accessToken: string}>('http://localhost:3001/auth/register', { username, email, password , firstName});
      localStorage.setItem('accessToken', response.data.accessToken);
      navigate('/home');
    } catch (err) {
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <div className='container'>
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className='username'>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='email'>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='firstname'>
          <label>FirstName:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className='password'>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='sign-up' type="submit">Register</button>
      </form>
      <button className='sign-in' onClick={() => navigate("/signIn")}>Already registered</button>
    </div>
  );
};