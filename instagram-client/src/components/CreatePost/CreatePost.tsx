import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { Button, Stack, TextField, CircularProgress, Snackbar, Alert, Box, Typography, FormLabel, CardMedia, AvatarGroup, Avatar } from '@mui/material';

export const CreatePost = () => {
  const { setNavbarItems, user } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setNavbarItems(
      <Button
        sx={{
          backgroundColor: 'aliceblue',
          height: '50%',
        }}
        onClick={() => navigate('/')}>
        Posts
      </Button>
    );
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
    formData.append('content', content);
    formData.append('uploadedBy', user._id);

    try {
      const response = await axios.post('http://localhost:3001/post/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': localStorage.getItem('accessToken'),
        },
      });

      if (response.status === 200) {
        setSuccess(true);
        navigate('/');
      } else {
        throw new Error('Failed to create post');
      }
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Create a New Post
      </Typography>
      {error && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setSuccess(false)}>
          <Alert onClose={() => setSuccess(false)} severity="success">
            Post created successfully!
          </Alert>
        </Snackbar>
      )}
      <form onSubmit={handleSubmit}>
        <Stack direction="column" spacing={2}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <TextField
            id="title"
            variant="outlined"
            value={title}
            onChange={handleTitleChange}
            fullWidth
            required
          />

          <Stack direction="column" spacing={1}>
            <FormLabel htmlFor="image">Image</FormLabel>
            <label htmlFor="image">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ textAlign: 'left' }}>
                Choose Image
              </Button>
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </Stack>

          {imagePreview && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <CardMedia
                component="img"
                image={imagePreview}
                sx={{
                  width: '100%',
                  maxHeight: 200,
                  objectFit: 'cover',
                }}/>
            </Box>
          )}

          <FormLabel htmlFor="content">Content</FormLabel>
          <TextField
            id="content"
            variant="outlined"
            value={content}
            onChange={handleContentChange}
            fullWidth
            multiline
            rows={4}
          />

          <Button variant="contained" type="submit" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Create Post'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};