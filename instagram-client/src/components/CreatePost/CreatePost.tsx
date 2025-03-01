import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { Button, Stack, TextField } from '@mui/material';

const CreatePost = () => {
  const {setNavbarItems, user} = useContext(AppContext)
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(
    () => {
      setNavbarItems(
        <Button
          sx={{
              backgroundColor: "aliceblue",
              height: "50%"
          }}
          onClick={() => navigate("/")}>
          Posts
        </Button>)
    },[])
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
      setError('Title Required');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
    formData.append('content', content);
    formData.append('uploadedBy', user._id)

    try {
      const response = await axios('http://localhost:3001/post/create', {
        method: 'POST',
        data: formData,
        headers: {
          "Authorization": localStorage.getItem("accessToken")
        }
      });

      if (!response.status) {
        throw new Error('Failed to create post');
      }

      navigate("/")
    } catch (error) {
      setError("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create a New Post</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Stack direction="column" className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter post title"
            required
          />
        </Stack>

        <Stack direction="column" className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}/>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </Stack>

        <Stack direction="column" className="form-group">
          <label htmlFor="content">Content</label>
          <TextField
            sx={{
              width: "50%"
            }}
            id="content"
            value={content}
            onChange={handleContentChange}
            rows={3}/>
        </Stack>

        <Button variant='contained' type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
