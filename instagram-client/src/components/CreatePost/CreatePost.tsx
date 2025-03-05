import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import {
  Button,
  Stack,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Typography,
  FormLabel,
  CardMedia,
} from '@mui/material';
import { useRequestAction } from '../../hooks';
import { head, method } from 'lodash';
import api from '../../api';

export const CreatePost = () => {
  const { setNavbarItems, user } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const summarizeRequestOptions = useMemo(
    () => ({
      method: 'post',
    }),
    []
  );

  const { action: summarizeRequest } = useRequestAction(
    'post/summarize',
    summarizeRequestOptions
  );

  const createPostOptions = useMemo(
    () => ({
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    []
  );

  const { action: createPost } = useRequestAction(
    'post/create',
    createPostOptions
  );

  useEffect(() => {
    setNavbarItems(
      <Button
        sx={{
          textTransform: 'none',
          backgroundColor: 'aliceblue',
          height: '50%',
        }}
        onClick={() => navigate('/')}
      >
        Posts
      </Button>
    );
  }, []);

  async function handleSummarize() {
    const response = await summarizeRequest({ text: content });
    console.log(response);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
      const response = await createPost(formData);

      if (response.status === 200) {
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
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
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
            onChange={(e) => setTitle(e.target.value)}
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
                sx={{ textTransform: 'none', textAlign: 'left' }}
              >
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
                }}
              />
            </Box>
          )}

          <FormLabel htmlFor="content">Content</FormLabel>
          <TextField
            id="content"
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
          <Button
            sx={{ textTransform: 'none' }}
            onClick={() => handleSummarize()}
          >
            Summarize Using Ai
          </Button>

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ textTransform: 'none' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Post'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
