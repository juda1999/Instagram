import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AppContext, User } from '../../App';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useRequestAction } from '../../hooks';
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Stack,
  Box,
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{  
        backgroundImage: 'url("/house-bg.jpg")',
       backgroundSize: 'repeat',
       backgroundPosition: 'center',
       padding: 2,
     }}
    >
      <Box
        sx={{
          backgroundColor: '#ffffff', // Card background
          padding: 4,
          borderRadius: 2,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center',
          }}
          fontFamily={'cursive'}
        >
          Sign In
        </Typography>
        {error && (
          <Typography
            color="error"
            variant="body2"
            sx={{ marginBottom: 2, textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
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
              sx={{
                borderRadius: 2, // Rounded button
                textTransform: 'none', // Disable uppercase text
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#0056b3', // Darker hover color
                },
              }}
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
  containerProps={{
    style: { marginTop: 16, width: '100%' }, // Pass styles here
  }}
/>
        <Button
          onClick={() => navigate('/signUp')}
          color="primary"
          sx={{
            marginTop: 2,
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          Not registered? Register here
        </Button>
      </Box>
    </Box>
  );
};

type UserResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};