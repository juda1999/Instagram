import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';
import { AppContext, User } from '../../App';

export const SignIn: React.FC = () => {
  const {setUser} = useContext(AppContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleOnLoad() {
    const token = localStorage.getItem('accessToken');
          if(token) {
            try {
              const response = await axios.get<{ user: User; accessToken: string}>('http://localhost:3001/auth/refresh', { headers: { "Authorization": token}});
                if(response.data.user) {
                  localStorage.setItem("accessToken", response.data.accessToken)
                  console.log(response.data)
                  setUser(response.data.user)
                  navigate("/")
              }
            } catch (error) {
              console.error(error)
            }
          }
  }

  useEffect(() => {
    handleOnLoad();
  },
  [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    try {
      const response = await axios.post<{user: User; accessToken: string}>('http://localhost:3001/auth/login', { email, password });

      localStorage.setItem('accessToken', response.data.accessToken);
      setUser(response.data.user)
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className='sign-in-container'>
      <h2>Sign In</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className='email'>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button className='sign-in' type="submit">Sign In</button>
      </form>
      <button className='register' onClick={() => navigate("/signUp")}>Register</button>
    </div>
  );
};