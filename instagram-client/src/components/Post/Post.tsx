import React, { useContext, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  Dialog,
  Button,
  Stack,
  Badge,
  IconButton,
} from '@mui/material';
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { AppContext, Comment, Post as PostInterface, User } from '../../App';
import { useRequest } from '../../hooks/useRequest';
import { CommentsDialog } from '../CommentDialog/CommentDialog';
import { useRequestAction } from '../../hooks';
import { data } from 'react-router-dom';
import _ from 'lodash';

interface PostProps {
  post: PostInterface;
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const { user, setUser } = useContext(AppContext)
  const options = useMemo(() => ({ method: 'get' }), []);
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const updateUserOptions = useMemo(() => ({ method: 'post' }), []);
  const { action, error } = useRequestAction(`user/update/${user._id}`, updateUserOptions)

  const { data: comments, refetch } = useRequest<Comment[]>(
    `comment/postId/${post._id}`,
    options
  );
  const { data: userData } = useRequest<{ user: User }>(
    `user/userInfo/${post.uploadedBy}`,
    options
  );

  function handleLiked() {
    const likedPosts: string[] =
      user.likedPosts.includes(post._id)
        ? _.remove(user.likedPosts, post._id)
        : [...user.likedPosts, post._id];

    action({ likedPosts })
    if (!error) {
      setUser({
        ...user,
        likedPosts
      })
    }

  };

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

        <Stack direction="row" justifyContent="space-between">
          <Button
            onClick={() => setCommentModalOpen(true)}
            sx={{ mt: 1 }}
            variant="outlined">
            View Comments
          </Button>
          <IconButton onClick={handleLiked}>
            {user.likedPosts.includes(post._id) ? (
              <Favorite color="error" />
            ) : (
              <FavoriteBorder color="action" />
            )}
          </IconButton>
        </Stack>
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
