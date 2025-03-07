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
  Box,
} from '@mui/material';
import { Delete, Edit, Favorite, FavoriteBorder } from '@mui/icons-material';
import { AppContext, Comment, Post as PostInterface, User } from '../../App';
import { useRequest } from '../../hooks/useRequest';
import { CommentsDialog } from '../CommentDialog/CommentDialog';
import { useRequestAction } from '../../hooks';
import _ from 'lodash';
import { ProfilePic } from '../ProfilePic';
import { getImageRequestPath } from '../../api';
import { useNavigate } from 'react-router-dom';

interface PostProps {
  post: PostInterface;
  editEnabled?: boolean;
  deletePost?: () => void;
  onEditPost: (post: PostInterface) => void;
}

export const Post: React.FC<PostProps> = ({
  deletePost,
  post,
  onEditPost,
  editEnabled = false,
}) => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const options = useMemo(() => ({ method: 'get' }), []);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState({ ...post });
  const [savedPost, setSavedPost] = useState({ ...post });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const updateUserOptions = useMemo(() => ({ method: 'post' }), []);
  const { action: updateUserAction, error } = useRequestAction(
    `user/update/${user._id}`,
    updateUserOptions
  );
  const deletePostOptions = useMemo(() => ({ method: 'delete' }), []);
  const { action: deletePostAction } = useRequestAction(
    `post/${savedPost._id}`,
    deletePostOptions
  );
  const updatePostOptions = useMemo(
    () => ({
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    []
  );

  const { action: updatePostAction } = useRequestAction(
    `post/create`,
    updatePostOptions
  );

  const { data: comments, refetch } = useRequest<Comment[]>(
    `comment/postId/${savedPost._id}`,
    options
  );
  const { data: postUserData } = useRequest<User>(
    `user/userInfo/${savedPost.uploadedBy}`,
    options
  );

  function handleLiked() {
    const likedPosts: string[] = user.likedPosts.includes(savedPost._id)
      ? _.filter(user.likedPosts, (postId) => postId !== savedPost._id)
      : [...user.likedPosts, savedPost._id];

    updateUserAction({ likedPosts });
    if (!error) {
      setUser({
        ...user,
        likedPosts,
      });
    }
  }

  async function handleSaveEdit() {
    const formData = new FormData();
    formData.append('_id', editedPost._id);
    formData.append('image', image);
    formData.append('content', editedPost.description);
    formData.append('title', editedPost.title);
    formData.append('uploadedBy', editedPost.uploadedBy);

    const response = await updatePostAction(formData);
    setSavedPost(response.data);
    setIsEditMode(false);
    onEditPost(response.data);
  }

  async function handleDeletePost() {
    await deletePostAction({});
    deletePost();
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
      }}
    >
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        sx={{ padding: 2 }}
      >
        <ProfilePic
          path={postUserData?.profilePicture}
          name={postUserData?.firstName}
          onClick={() => navigate(`/user/${postUserData._id}`)}
        />
        <Typography sx={{ flex: 1 }} color="text.secondary">
          {postUserData?.username}
        </Typography>
        {editEnabled && !isEditMode && (
          <Button
            sx={{}}
            onClick={() => setIsEditMode(true)}
            variant="text"
            color="primary"
          >
            <Edit />
          </Button>
        )}
        {isEditMode && (
          <Button onClick={() => handleDeletePost()}>
            <Delete />
          </Button>
        )}
      </Stack>

      {(imagePreview || savedPost?.photo) && (
        <CardMedia
          alt="e"
          component="img"
          image={
            editEnabled
              ? (imagePreview ?? getImageRequestPath(savedPost?.photo))
              : getImageRequestPath(savedPost?.photo)
          }
          sx={{
            width: '100%',
            maxHeight: 200,
            objectFit: 'cover',
          }}
        />
      )}

      <CardContent>
        {isEditMode ? (
          <>
            <Stack direction="column" spacing={1}>
              <label htmlFor="image">
                <Button
                  variant="outlined"
                  component="span"
                  sx={{
                    textTransform: 'none',
                    textAlign: 'left',
                    marginBottom: 1,
                  }}
                >
                  Choose Image
                </Button>
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                style={{ display: 'none' }}
              />
            </Stack>
            <TextField
              fullWidth
              variant="outlined"
              label="Title"
              value={editedPost.title}
              onChange={(e) =>
                setEditedPost({ ...editedPost, title: e.target.value })
              }
              sx={{ marginBottom: 1 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Description"
              value={editedPost.description}
              onChange={(e) =>
                setEditedPost({ ...editedPost, description: e.target.value })
              }
              sx={{ marginBottom: 1 }}
              multiline
              rows={1}
            />

            <Stack direction="row" justifyContent="space-between">
              <Button
                sx={{ textTransform: 'none' }}
                variant="text"
                onClick={handleSaveEdit}
              >
                Save Changes
              </Button>
              <Button
                sx={{ textTransform: 'none' }}
                onClick={() => setIsEditMode(false)}
              >
                Cancel
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Typography
              variant="h5"
              sx={{ fontWeight: 'bold', marginBottom: 1 }}
            >
              {savedPost.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: 1 }}
            >
              {savedPost.description}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {new Date(savedPost.uploadedAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ margin: '8px 0' }}>
              {comments?.length ?? 0} Comments
            </Typography>

            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Button
                  onClick={() => setCommentModalOpen(true)}
                  sx={{ height: '30px', textTransform: 'none' }}
                  variant="outlined"
                >
                  <Typography variant="body2">Comments</Typography>
                </Button>
              </Box>
              <IconButton onClick={handleLiked}>
                {user.likedPosts.includes(savedPost?._id) ? (
                  <Favorite color="error" />
                ) : (
                  <FavoriteBorder color="action" />
                )}
              </IconButton>
            </Stack>
          </>
        )}
      </CardContent>

      <Dialog
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
      >
        <CommentsDialog
          onSubmit={() => {
            refetch();
          }}
          onClose={() => {
            setCommentModalOpen(false);
          }}
          postId={savedPost?._id}
          comments={comments}
        />
      </Dialog>
    </Card>
  );
};
