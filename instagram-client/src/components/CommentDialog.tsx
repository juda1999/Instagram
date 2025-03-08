import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { AppContext, Comment } from '../App';
import { useRequestAction } from '../hooks/useRequestAction';
import { Close } from '@mui/icons-material';

type CommentsDialogProps = {
  comments: Comment[];
  onSubmit: () => void;
  postId: string;
  onClose: () => void;
};

export const CommentsDialog: React.FC<CommentsDialogProps> = ({
  onClose,
  comments,
  postId,
  onSubmit,
}) => {
  const { user } = useContext(AppContext);
  const [newComment, setNewComment] = useState('');
  const options = useMemo(
    () => ({
      method: 'Post',
    }),
    []
  );

  const { action } = useRequestAction<Comment>('comment', options);
  async function handleAddComment() {
    await action({
      message: newComment,
      uploadedBy: user.username,
      post: postId,
      uploadedAt: new Date(),
    });

    setNewComment('');
    onSubmit();
  }

  return (
    <Fragment>
      <DialogTitle component="div">
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          <Typography>Comments</Typography>
          <Button sx={{ minWidth: 0, padding: 0 }} onClick={onClose}>
            <Close />
          </Button>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ flex: 'display', height: '500px', width: '500px' }}>
        <Stack
          spacing={2}
          sx={{
            overflow: 'hidden',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Stack spacing={1} sx={{ overflow: 'auto' }}>
            {comments?.length > 0 ? (
              comments.map((comment, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {comment.uploadedBy.charAt(0).toUpperCase()}
                  </Avatar>

                  <Stack flex={1} spacing={0.5}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="body1" fontWeight="bold">
                        {comment.uploadedBy}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(comment.uploadedAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                    <Typography variant="body2">{comment.message}</Typography>
                  </Stack>
                </Stack>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No comments yet.
              </Typography>
            )}
          </Stack>
          <TextField
            label="Add a Comment"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddComment} color="primary" variant="contained">
          Add Comment
        </Button>
      </DialogActions>
    </Fragment>
  );
};
