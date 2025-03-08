import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AppContext } from '../App';
import {
  Button,
  TextField,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useRequestAction } from '../hooks';

export const SignUp: React.FC = () => {
  const { setUser, setNavbarItems } = useContext(AppContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: 'onTouched' });

  const options = useMemo(
    () => ({
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    []
  );
  const { action: signUp, loading } = useRequestAction(
    'auth/register',
    options
  );

  const profilePicture = watch('profilePicture');

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'profilePicture' && data[key]?.[0]) {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      const response = await signUp(formData);
      setUser(response.data.user);
      localStorage.setItem('accessToken', response.data.accessToken);
      navigate('/');
    } catch (err) {
      setError('Failed to sign up. Please try again.');
    }
  };

  useEffect(() => setNavbarItems(null), []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f0f4f8"
    >
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      {error && (
        <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        style={{ width: '100%', maxWidth: 400 }}
      >
        <Stack spacing={2} alignItems="center">
          <label htmlFor="image">
            <Avatar
              alt="User"
              src={
                profilePicture?.[0]
                  ? URL.createObjectURL(profilePicture[0])
                  : ''
              }
              sx={{
                width: 100,
                height: 100,
                cursor: 'pointer',
                '&:hover': { opacity: 0.9 },
              }}
            />
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            {...register('profilePicture')}
            style={{ display: 'none' }}
          />
          <TextField
            label="Username"
            fullWidth
            {...register('username', { required: 'Username is required' })}
            error={!!errors.username}
            helperText={(errors.username?.message as string) ?? ''}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={(errors.email?.message as string) ?? ''}
          />
          <TextField
            label="First Name"
            fullWidth
            {...register('firstName', { required: 'First name is required' })}
            error={!!errors.firstName}
            helperText={(errors.firstName?.message as string) ?? ''}
          />
          <TextField
            label="Last Name"
            fullWidth
            {...register('lastName', { required: 'Last name is required' })}
            error={!!errors.lastName}
            helperText={(errors.lastName?.message as string) ?? ''}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={(errors.password?.message as string) ?? ''}
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
              'Register'
            )}
          </Button>
        </Stack>
      </form>
      <Button
        onClick={() => navigate('/signIn')}
        color="primary"
        sx={{ marginTop: 2 }}
      >
        Already registered? Sign In
      </Button>
    </Box>
  );
};
