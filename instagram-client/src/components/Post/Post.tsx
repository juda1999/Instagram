import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Avatar } from '@mui/material';
import { Post as PostInterface } from '../../App';

interface PostProps {
  post: PostInterface;
}

export const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2, overflow: 'hidden', margin: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
        <Avatar sx={{ width: 32, height: 32, marginRight: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {post.uploadedBy}
        </Typography>
      </Box>

      <CardMedia
        component="img"
        height="200"
        image={post.photo}
        alt="Post Image"
        sx={{ objectFit: 'cover' }}
      />

      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
          {post.description}
        </Typography>

        {/* Uploaded at date */}
        <Typography variant="caption" color="text.secondary">
          {new Date(post.uploadedAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};