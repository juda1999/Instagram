import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Button, TextField } from '@mui/material';

const CreatePost = () => {
  const {setNavbarItems} = useContext(AppContext)
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
    if (!title || !content || !image) {
      setError('All fields are required!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
    formData.append('content', content);

    try {
      const response = await axios('/api/posts', {
        method: 'POST',
        data: formData,
      });

      if (!response.status) {
        throw new Error('Failed to create post');
      }

      navigate("/")
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create a New Post</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter post title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <TextField
            id="content"
            value={content}
            onChange={handleContentChange}
            rows={3}/>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
