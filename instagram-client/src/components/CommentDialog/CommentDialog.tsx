import {
  Box,
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
import { AppContext, Comment } from '../../App';
import { useRequestAction } from '../../hooks/useRequestAction';
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
  function handleAddComment() {
    action({
      message: newComment,
      uploadedBy: user._id,
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
      <DialogContent sx={{ height: '500px', width: '500px' }}>
        <Box>
          {comments?.length > 0 ? (
            comments.map((comment, index) => (
              <Box key={index} sx={{ marginBottom: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {comment.message}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No comments yet.
            </Typography>
          )}
        </Box>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddComment} color="primary" variant="contained">
          Add Comment
        </Button>
      </DialogActions>
    </Fragment>
  );
};
