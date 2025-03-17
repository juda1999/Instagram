import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AppContext } from '../App';
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
import { useRequestAction } from '../hooks';

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

  useEffect(() => { setNavbarItems( <Button sx={{ textTransform: 'none', backgroundColor: 'aliceblue', height: '50%', fontFamily: 'cursive' }} onClick={() => navigate('/')} > Posts </Button> ); }, []);
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        backgroundImage: 'url("/house-bg.jpg")', // Background image
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
          maxWidth: 600,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          fontFamily="cursive"
          sx={{
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center',
          }}
        >
          Create a New Post
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
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Stack spacing={2}>
            <TextField
              label="Title"
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
                  sx={{
                    textTransform: 'none',
                    textAlign: 'left',
                  }}
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
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                />
              </Box>
            )}
            <TextField
              label="Description"
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
            <Button
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
              }}
              onClick={handleSummarize}
              disabled={summarizeLoading}
            >
              Make Better Using AI
              {summarizeLoading && (
                <CircularProgress size="16px" sx={{ marginLeft: 1 }} />
              )}
            </Button>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#0056b3',
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Post'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};