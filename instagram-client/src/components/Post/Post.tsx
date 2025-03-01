import React, { useMemo } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Avatar } from '@mui/material';
import { Post as PostInterface, User } from '../../App';
import { useRequest } from '../../hooks/useRequest';

interface PostProps {
  post: PostInterface;
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const options = useMemo(() => ({ method: "get" }),[])
  const { data } = useRequest<{user: User}>(`auth/userInfo?user=${post.uploadedBy}`, options)
  return (
    <Card sx={{ width: "500px", height: "500px", boxShadow: 3, borderRadius: 2, overflow: 'hidden', margin: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
        <Avatar sx={{ width: 32, height: 32, marginRight: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {data?.user?._id}
        </Typography>
      </Box>

      <CardMedia
        component="img"
        height="300"
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

        <Typography variant="caption" color="text.secondary">
          {new Date(post.uploadedAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};