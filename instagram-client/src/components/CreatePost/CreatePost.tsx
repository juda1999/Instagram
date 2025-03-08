import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AppContext } from '../../App';
import {
  Button,
  Stack,
  TextField,
  CircularProgress,
  Box,
  Typography,
  FormLabel,
  CardMedia,
} from '@mui/material';
import { useRequestAction } from '../../hooks';

interface PostFormData {
  title: string;
  image: FileList;
  description: string;
}

export const CreatePost = () => {
  const { setNavbarItems, user } = useContext(AppContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PostFormData>({ mode: 'onTouched' });

  const [error, setError] = useState('');
  const options = useMemo(
    () => ({
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    []
  );

  const summarizeRequestOptions = useMemo(
    () => ({
      method: 'post',
    }),
    []
  );

  const { action: createPost, loading } = useRequestAction(
    'post/create',
    options
  );
  const { action: summarizeRequest, loading: summarizeLoading } =
    useRequestAction('post/summarize', summarizeRequestOptions);

  const image = watch('image');
  const description = watch('description');

  async function handleSummarize() {
    try {
      const { data } = await summarizeRequest({ text: description });
      setValue('description', data);
    } catch (error) {
      setError('Failed request to AI');
    }
  }

  const onSubmit: SubmitHandler<PostFormData> = async (data) => {
    const formData = new FormData();

    if (!data.image?.[0]) {
      setError('Image is required');
      return;
    }

    Object.keys(data).forEach((key) => {
      if (key === 'image' && data[key]?.[0]) {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    });
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
    }
  };

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

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Create a New Post
      </Typography>
      {error && <Typography sx={{ color: 'red' }}>* {error}</Typography>}
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Stack direction="column" spacing={2}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <TextField
            id="title"
            variant="outlined"
            fullWidth
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={(errors.title?.message as string) || ''}
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
              {...register('image')}
              style={{ display: 'none' }}
            />
          </Stack>

          {image?.[0] && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <CardMedia
                component="img"
                image={URL.createObjectURL(image[0])}
                sx={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
              />
            </Box>
          )}

          <FormLabel htmlFor="description">Description</FormLabel>
          <TextField
            id="description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            {...register('description', {
              required: 'Description is required',
            })}
            error={!!errors.description}
            helperText={(errors.description?.message as string) || ''}
          />
          <Button sx={{ textTransform: 'none' }} onClick={handleSummarize}>
            <Typography sx={{ marginRight: '16px' }}>
              Make Better Using AI
            </Typography>
            {summarizeLoading && <CircularProgress size="16px" />}
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
