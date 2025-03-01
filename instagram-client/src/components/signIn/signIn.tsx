import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';
import { AppContext, User } from '../../App';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useRequestAction } from '../../hooks';
import { Button, TextField, Typography, Box, Grid, CircularProgress, Grid2 } from '@mui/material';

export const SignIn: React.FC = () => {
  const { setUser } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const options = useMemo(() => ({ method: "post" }), []);
  const { action: googleLoginRequest } = useRequestAction("auth/googleLogin", options);

  async function handleOnLoad() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await axios.get<UserResponse>('http://localhost:3001/auth/refresh', { headers: { "Authorization": token } });
        if (response.data.user) {
          handleSuccessLogin(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleSuccessLogin(userResponse: UserResponse) {
    localStorage.setItem("accessToken", userResponse.accessToken);
    setUser(userResponse.user);
    navigate("/");
  }

  useEffect(() => {
    handleOnLoad();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<{ user: User; accessToken: string }>('http://localhost:3001/auth/login', { email, password });
      handleSuccessLogin(response.data);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
    const { credential } = response;
    try {
      const response = await googleLoginRequest({ googleToken: credential });
      handleSuccessLogin(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginFailure = () => {
    setError('Login Failed');
  };

  return (
    <Box className='sign-in-container' display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="#f0f4f8">
      <Typography variant="h4" gutterBottom>Sign In</Typography>
      {error && <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>{error}</Typography>}
      <form className='sign-in-form' onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid2>
          <Grid2 size={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Grid2>
        </Grid2>
      </form>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleLoginFailure}
        useOneTap
        size="large"
        theme="outline"
      />
      <Button onClick={() => navigate('/signUp')} color="primary" sx={{ marginTop: 2 }}>
        Register
      </Button>
    </Box>
  );
};

type UserResponse = {
  user: User;
  accessToken: string;
};
