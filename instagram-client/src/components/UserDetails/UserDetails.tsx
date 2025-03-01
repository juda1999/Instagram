import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext, User } from '../../App';
import { useRequest } from '../../hooks/useRequest';
import { PostList } from '../PostList';
import { ProfilePic } from '../ProfilePic';
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
  Stack,
  FormLabel,
} from '@mui/material'; // Import Material UI components
import { useRequestAction } from '../../hooks';
import { Close, PhotoCamera } from '@mui/icons-material';
import { HomeContext } from '../Home';

interface UserDetailsProps {
  userId: string;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ userId }) => {
  const { user, setUser } = useContext(AppContext);
  const { setUserDetailsId } = useContext(HomeContext);
  const [currentUser, setCurrentUser] = useState<User>();
  const [editMode, setEditMode] = useState(false)
  const [error, setError] = useState("")

  const options = useMemo(() => ({ method: 'get' }), []);
  const updateUserOptions = useMemo(() => ({ method: 'post' }), []);
  const { data: userInfo } = useRequest<User>(`user/userInfo/${userId}`, options);
  const { action: updateUserAction } = useRequestAction(`user/update/${currentUser?._id}`, updateUserOptions)

  useEffect(() => setCurrentUser(userInfo), [userInfo]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUser((prevUser) => ({ ...prevUser, username: e.target.value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUser((prevUser) => ({ ...prevUser, email: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setCurrentUser((prevUser) => ({ ...prevUser, profilePic: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser?.username || !currentUser?.email) {
      alert('Please fill out all fields');
      return;
    }

    try {
      await updateUserAction(currentUser);
      setUser?.(currentUser);
      setEditMode(false)
    } catch (error) {
      setError("Failed to update user details")
    }
  };

  return (
    <Card sx={{ backgroundColor: "#f0f4f8"}}>
      <CardHeader
        title={<Typography variant="h6">User Details</Typography>}
        action={
          <Button onClick={() => setUserDetailsId(undefined)} sx={{ minWidth: 0 }}>
            <Close />
          </Button>
        } />
      <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
        <CardContent sx={{ width: "50%" }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <ProfilePic path={currentUser?.profilePicture} />
          </Box>

          {editMode ? (
            <>
              <TextField
                label="Username"
                value={currentUser?.username || ''}
                onChange={handleUsernameChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                value={currentUser?.email || ''}
                onChange={handleEmailChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Button variant="contained" component="label" startIcon={<PhotoCamera />}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ marginRight: '1rem' }} />
              </Button>
            </>
          ) : (
            <Box marginTop="1rem">
              <Stack direction="column" spacing={0.5}>
                <FormLabel sx={{ fontSize: '0.875rem' }}>Username</FormLabel>
                <Typography>
                  {currentUser?.username}
                </Typography>

                <FormLabel sx={{ fontSize: '0.875rem' }}>Email</FormLabel>
                <Typography>
                  {currentUser?.email}
                </Typography>
              </Stack>
            </Box>
          )}
        </CardContent>

        <CardActions>
          {userId === user?._id &&
            editMode ? (
            <Stack spacing="1" direction="row">
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Save Changes
              </Button>
              <Button onClick={() => setEditMode(false)} variant="contained" color="primary">
                cancel
              </Button>
            </Stack>
          ) : (
            <Button
              onClick={() => setEditMode(true)}
              variant="outlined"
              color="primary">
              Edit Details
            </Button>
          )}
        </CardActions>

        <CardContent>
          <PostList userId={userId} />
        </CardContent>
      </Stack>
    </Card>
  );
};
