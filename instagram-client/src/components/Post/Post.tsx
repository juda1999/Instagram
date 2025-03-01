import React, { useContext, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
  Button,
  Stack,
  IconButton,
  TextField,
  FormLabel,
  Box,
} from '@mui/material';
import { Delete, Edit, Favorite, FavoriteBorder } from "@mui/icons-material";
import { AppContext, Comment, Post as PostInterface, User } from '../../App';
import { useRequest } from '../../hooks/useRequest';
import { CommentsDialog } from '../CommentDialog/CommentDialog';
import { useRequestAction } from '../../hooks';
import _ from 'lodash';
import { ProfilePic } from '../ProfilePic';
import { HomeContext } from '../Home';

interface PostProps {
  post: PostInterface;
  editEnabled?: boolean;
  deletePost?: () => void;
}

export const Post: React.FC<PostProps> = ({ deletePost, post, editEnabled = false }) => {
  const { user, setUser } = useContext(AppContext);
  const { setUserDetailsId } = useContext(HomeContext);
  const options = useMemo(() => ({ method: 'get' }), []);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState({ ...post });
  const [savedPost, setSavedPost] = useState({ ...post })

  const updateUserOptions = useMemo(() => ({ method: 'post' }), []);
  const { action: updateUserAction, error } = useRequestAction(`user/update/${user._id}`, updateUserOptions);
  const deletePostOptions = useMemo(() => ({ method: 'delete' }), []);
  const { action: deletePostAction } = useRequestAction(`post/${savedPost._id}`, deletePostOptions);
  const updatePostOptions = useMemo(() => ({ method: 'put' }), []);
  const { action: updatePostAction } = useRequestAction(`post/${savedPost._id}`, updatePostOptions);

  const { data: comments, refetch } = useRequest<Comment[]>(
    `comment/postId/${savedPost._id}`,
    options
  );
  const { data: postUserData } = useRequest<User>(
    `user/userInfo/${savedPost.uploadedBy}`,
    options
  );

  function handleLiked() {
    const likedPosts: string[] =
      user.likedPosts.includes(savedPost._id)
        ? _.filter(user.likedPosts, postId => postId !== savedPost._id)
        : [...user.likedPosts, savedPost._id];

    updateUserAction({ likedPosts });
    if (!error) {
      setUser({
        ...user,
        likedPosts
      });
    }
  }

  async function handleSaveEdit() {
    const response = await updatePostAction(editedPost)
    setSavedPost(response.data)
    setIsEditMode(false);
  }

  async function handleDeletePost() {
    await deletePostAction({});
    deletePost()
  }

  return (
    <Card
      sx={{
        width: '500px',
        height: 'auto',
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'hidden',
        margin: 2,
      }}>
      <Stack alignItems="center" direction="row" spacing={2} sx={{ padding: 2 }}>
        <ProfilePic path={postUserData?.profilePicture} onClick={() => setUserDetailsId(postUserData?._id)} />
        <Typography sx={{ flex: 1 }} color="text.secondary">
          {postUserData?.username}
        </Typography>
        {editEnabled && !isEditMode &&
          <Button
            sx={{}}
            onClick={() => setIsEditMode(true)}
            variant="text"
            color="primary">
            <Edit />
          </Button>}
        {isEditMode &&
          <Button onClick={() => handleDeletePost()}>
            <Delete/>
          </Button>}
      </Stack>

      <CardMedia
        component="img"
        height="200"
        image={`http://localhost:3001${editedPost.photo}`}
        alt="Post Image"
        sx={{ objectFit: 'cover' }} />

      <CardContent>
        {isEditMode ? (
          <>
            <TextField
              fullWidth
              variant="outlined"
              label="Title"
              value={editedPost.title}
              onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
              sx={{ marginBottom: 2 }} />
            <TextField
              fullWidth
              variant="outlined"
              label="Description"
              value={editedPost.description}
              onChange={(e) => setEditedPost({ ...editedPost, description: e.target.value })}
              sx={{ marginBottom: 2 }}
              multiline
              rows={3} />
            <Stack direction="column" spacing={1}>
              <label htmlFor="image">
                <Button
                  variant="outlined"
                  component="span"
                  sx={{ textAlign: 'left', marginBottom: 2 }}>
                  Choose Image
                </Button>
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setEditedPost({ ...editedPost, description: e.target.value })}
                style={{ display: 'none' }} />
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Button variant="text" onClick={handleSaveEdit}>
                Save Changes
              </Button>
              <Button onClick={() => setIsEditMode(false)}>
                Cancel
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Typography
              variant="h5"
              sx={{ fontWeight: 'bold', marginBottom: 1 }}>
              {savedPost.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: 2 }}>
              {savedPost.description}
            </Typography>
          </>
        )}

        <Typography
          variant="caption"
          color="text.secondary">
          {new Date(savedPost.uploadedAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          {comments?.length ?? 0} Comments
        </Typography>

        <Stack direction="row" justifyContent="space-between">
          <Box>
            {comments?.length > 0 &&
              <Button
                onClick={() => setCommentModalOpen(true)}
                sx={{ mt: 1 }}
                variant="outlined">
                View Comments
              </Button>}
          </Box>
          <IconButton onClick={handleLiked}>
            {user.likedPosts.includes(savedPost._id) ? (
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
          postId={savedPost._id}
          comments={comments}
        />
      </Dialog>
    </Card>
  );
};
