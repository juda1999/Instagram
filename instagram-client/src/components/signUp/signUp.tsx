import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../../App';
import { Button, TextField, Typography, Box, Grid2, Avatar, CircularProgress } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import './SignUp.css';

export const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('firstName', firstName);

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    setLoading(true);
    try {
      const response = await axios.post<{ user: User; accessToken: string }>(
        'http://localhost:3001/auth/register',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      localStorage.setItem('accessToken', response.data.accessToken);
      navigate('/');
    } catch (err) {
      setError('Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="sign-up-container" display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="#f0f4f8">
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
      {error && <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>{error}</Typography>}
      <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ width: '100%', maxWidth: 400 }}>
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Grid2>
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
              label="First Name"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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
            <Button variant="contained" component="label" fullWidth startIcon={<PhotoCamera />}>
              Upload Profile Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </Button>
          </Grid2>
          {profilePicture && (
            <Grid2 size={12} display="flex" justifyContent="center">
              <Avatar src={URL.createObjectURL(profilePicture)} sx={{ width: 100, height: 100, marginTop: 2 }} />
            </Grid2>
          )}
          <Grid2 size={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </Grid2>
        </Grid2>
      </form>
      <Button onClick={() => navigate('/signIn')} color="primary" sx={{ marginTop: 2 }}>
        Already registered? Sign In
      </Button>
    </Box>
  );
};
