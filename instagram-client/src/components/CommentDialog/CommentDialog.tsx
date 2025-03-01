import { Box, Button, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material"
import React, { useContext, useMemo, useState } from "react"
import { Fragment } from "react/jsx-runtime"
import { AppContext, Comment } from "../../App";
import { useRequestAction } from "../../hooks/useRequestAction";
import { AxiosRequestConfig } from "axios";

type CommentsDialogProps = {
  comments: Comment[];
  postId: string;
  onClose: () => void;
};

export const CommentsDialog: React.FC<CommentsDialogProps> = ({ onClose, comments, postId }) => {
  const { user } = useContext(AppContext);
  const [newComment, setNewComment] = useState("")
  const options =
    useMemo(
      (): AxiosRequestConfig => ({
        method: "Post",
      }),
      []);

  const { action } = useRequestAction<Comment>("comment", options);
  function handleAddComment() {
    action({
      message: newComment,
      uploadedBy: user._id,
      post: postId,
      uploadedAt: new Date()
    })

    onClose();
  }

  return (
    <Fragment>
      <DialogTitle>Comments</DialogTitle>
      <DialogContent>
        <Box sx={{ maxHeight: 400, overflowY: 'auto', mb: 2 }}>
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
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button onClick={handleAddComment} color="primary" variant="contained">
          Add Comment
        </Button>
      </DialogActions>
    </Fragment>)
}