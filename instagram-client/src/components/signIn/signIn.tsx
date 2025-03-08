import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import { AppContext, User } from '../../App';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useRequestAction } from '../../hooks';
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Grid2,
  Stack,
} from '@mui/material';
import api from '../../api';

export const SignIn: React.FC = () => {
  const { setUser, setNavbarItems } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const googleLoginOptions = useMemo(() => ({ method: 'post' }), []);
  const { action: googleLoginRequest } = useRequestAction(
    'auth/googleLogin',
    googleLoginOptions
  );

  const tokenLoginOptions = useMemo(() => ({ method: 'get' }), []);
  const { action: tokenLogin } = useRequestAction(
    'auth/tokenLogin',
    tokenLoginOptions
  );

  async function handleOnLoad() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await tokenLogin();
        if (response.data.user) {
          handleSuccessLogin(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleSuccessLogin(userResponse: UserResponse) {
    localStorage.setItem('accessToken', userResponse.accessToken);
    localStorage.setItem('refreshToken', userResponse.refreshToken);
    setUser(userResponse.user);
    navigate('/');
  }

  useEffect(() => {
    handleOnLoad();
    setNavbarItems(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await api.request<UserResponse>({
        data: { email, password },
      });
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
      setLoading(true);

      const response = await googleLoginRequest({ googleToken: credential });
      handleSuccessLogin(response.data);
    } catch {
      setError('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      sx={{ height: '100vh', backgroundColor: '#f0f4f8' }}
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>
      {error && (
        <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}
      <form className="sign-in-form" onSubmit={handleSubmit}>
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
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </Grid2>
        </Grid2>
      </form>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={() => setError('Google login failed')}
        useOneTap
        size="large"
        theme="outline"
      />
      <Button
        onClick={() => navigate('/signUp')}
        color="primary"
        sx={{ marginTop: 2 }}
      >
        Register
      </Button>
    </Stack>
  );
};

type UserResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
