import React, { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  Dialog,
  Button,
} from '@mui/material';
import { Comment, Post as PostInterface, User } from '../../App';
import { useRequest } from '../../hooks/useRequest';
import { CommentsDialog } from '../CommentDialog';

interface PostProps {
  post: PostInterface;
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const options = useMemo(() => ({ method: 'get' }), []);
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const { data: comments, refetch } = useRequest<Comment[]>(
    `comment/postId/${post._id}`,
    options
  );
  const { data: userData } = useRequest<{ user: User }>(
    `auth/userInfo?user=${post.uploadedBy}`,
    options
  );
  return (
    <Card
      sx={{
        width: '500px',
        height: '500px',
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'hidden',
        margin: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
        <Avatar sx={{ width: 32, height: 32, marginRight: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {userData?.user?._id}
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
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 'bold', marginBottom: 1 }}
        >
          {post.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: 2 }}
        >
          {post.description}
        </Typography>

        <Typography
            variant="caption"
            color="text.secondary">
          {new Date(post.uploadedAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          {comments?.length ?? 0} Comments
        </Typography>

        <Button
          onClick={() => setCommentModalOpen(true)}
          sx={{ mt: 1 }}
          variant="outlined"
        >
          View Comments
        </Button>
      </CardContent>
      <Dialog
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        maxWidth="lg">
        <CommentsDialog
          onClose={() => {
            refetch();
            setCommentModalOpen(false);
          }}
          postId={post._id}
          comments={comments}
        />
      </Dialog>
    </Card>
  );
};
