import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './SignIn.css';
import { AppContext, User } from '../../App';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useRequestAction } from '../../hooks';
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Stack,
} from '@mui/material';

export const SignIn: React.FC = () => {
  const { setUser, setNavbarItems } = useContext(AppContext);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const postRequestOptions = useMemo(() => ({ method: 'post' }), []);
  const { action: googleLoginRequest } = useRequestAction(
    'auth/googleLogin',
    postRequestOptions
  );

  const { action: loginRequest } = useRequestAction(
    'auth/login',
    postRequestOptions
  );

  const { action: tokenLogin } = useRequestAction('auth/tokenLogin');

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

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await loginRequest(data);
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
      <form className="sign-in-form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email?.message as string}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message as string}
          />
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
        </Stack>
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
