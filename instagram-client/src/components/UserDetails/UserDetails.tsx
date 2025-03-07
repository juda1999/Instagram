import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext, User } from '../../App';
import { useRequest } from '../../hooks/useRequest';
import { PostList } from '../PostList';
import { ProfilePic } from '../ProfilePic';
import {
  TextField,
  Button,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
  Stack,
  FormLabel,
  Avatar,
} from '@mui/material';
import { useRequestAction } from '../../hooks';
import { Edit, PhotoCamera } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

export const UserDetails: React.FC = () => {
  const { userId } = useParams();
  const { user, setUser, setNavbarItems } = useContext(AppContext);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User>();
  const [image, setImage] = useState<File>();
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    setNavbarItems(
      <Stack spacing={2} alignItems="center" direction="row">
        <Button
          sx={{
            textTransform: 'none',
            backgroundColor: 'aliceblue',
            height: '50%',
          }}
          onClick={() => navigate('/')}
        >
          Posts
        </Button>
        <Button
          sx={{
            textTransform: 'none',
            backgroundColor: 'aliceblue',
            height: '50%',
          }}
          onClick={() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/signIn');
          }}
        >
          Logout
        </Button>
        <ProfilePic
          name={user?.firstName}
          path={user?.profilePicture}
          onClick={() => navigate(`/user/${user._id}`)}
        />
      </Stack>
    );
  }, [user]);

  const options = useMemo(() => ({ method: 'get' }), []);
  const updateUserOptions = useMemo(
    () => ({
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    []
  );
  const { data: userInfo } = useRequest<User>(
    `user/userInfo/${userId}`,
    options
  );
  const { action: updateUserAction } = useRequestAction(
    `user/update/${currentUser?._id}`,
    updateUserOptions
  );

  useEffect(() => setCurrentUser(userInfo), [userInfo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser?.username || !currentUser?.email) {
      alert('Please fill out all fields');
      return;
    }

    const formData = new FormData();
    formData.append('username', currentUser.username);
    formData.append('email', currentUser.email);
    formData.append('firstName', currentUser.firstName);
    formData.append('lastName', currentUser.lastName);

    if (image) {
      formData.append('profilePicture', image);
    }

    try {
      const { data } = await updateUserAction(formData);
      setUser?.(data);
      setCurrentUser?.(data);
      setEditMode(false);
    } catch (error) {
      setError('Failed to update user details');
    }
  };

  return (
    <Stack sx={{ backgroundColor: '#f0f4f8' }}>
      <CardHeader title={<Typography variant="h6">User Details</Typography>} />

      <Stack alignItems="center">
        <CardContent sx={{ width: '50%' }}>
          <Stack
            sx={{ position: 'relative' }}
            direction="row"
            justifyContent="center"
          >
            <ProfilePic
              key={currentUser?.profilePicture}
              name={currentUser?.firstName}
              path={currentUser?.profilePicture}
            />
            {userId === user?._id && (
              <Button
                sx={{ right: 0, position: 'absolute' }}
                onClick={() => setEditMode(true)}
                variant="text"
                color="primary"
              >
                <Edit />
              </Button>
            )}
          </Stack>

          {editMode ? (
            <>
              <TextField
                label="Username"
                value={currentUser?.username || ''}
                onChange={(e) =>
                  setCurrentUser((prevUser) => ({
                    ...prevUser,
                    username: e.target.value,
                  }))
                }
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                label="First name"
                value={currentUser?.firstName || ''}
                onChange={(e) =>
                  setCurrentUser((prevUser) => ({
                    ...prevUser,
                    firstName: e.target.value,
                  }))
                }
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last name"
                value={currentUser?.lastName || ''}
                onChange={(e) =>
                  setCurrentUser((prevUser) => ({
                    ...prevUser,
                    lastName: e.target.value,
                  }))
                }
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Stack direction="row" spacing={5}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ marginRight: '1rem' }}
                  />
                </Button>
                {image && (
                  <Avatar
                    src={URL.createObjectURL(image)}
                    sx={{ width: 50, height: 50, marginTop: 2 }}
                  />
                )}
              </Stack>
            </>
          ) : (
            <Box marginTop="1rem">
              <Stack direction="column" spacing={0.5}>
                <FormLabel sx={{ fontSize: '0.875rem' }}>Username</FormLabel>
                <Typography>{currentUser?.username}</Typography>

                <FormLabel sx={{ fontSize: '0.875rem' }}>Email</FormLabel>
                <Typography>{currentUser?.email}</Typography>

                <FormLabel sx={{ fontSize: '0.875rem' }}>First Name</FormLabel>
                <Typography>{currentUser?.firstName}</Typography>

                <FormLabel sx={{ fontSize: '0.875rem' }}>Last Name</FormLabel>
                <Typography>{currentUser?.lastName}</Typography>
              </Stack>
            </Box>
          )}
        </CardContent>

        <CardActions>
          {editMode && (
            <Stack spacing={1} direction="row">
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setEditMode(false)}
                variant="contained"
                color="primary"
              >
                cancel
              </Button>
              {error ?? <Typography sx={{ color: 'red' }}>{error}</Typography>}
            </Stack>
          )}
        </CardActions>

        <CardContent sx={{ overflow: 'hidden', maxHeight: '100%' }}>
          <PostList
            key={`${user?.profilePicture}${user?.username}`}
            userId={userId}
          />
        </CardContent>
      </Stack>
    </Stack>
  );
};
