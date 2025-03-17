import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext, User } from '../App';
import { useRequest, useRequestAction } from '../hooks';
import { PostList } from './PostList';
import { ProfilePic } from './ProfilePic';
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
import { Edit } from '@mui/icons-material';
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
      <Stack spacing={2} alignItems="center" direction="row" >
        <Button
          sx={{
            textTransform: 'none',
            backgroundColor: 'aliceblue',
            height: '50%',
            fontFamily: 'cursive',
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
            fontFamily: 'cursive',
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
          firstName={user?.firstName}
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundImage: 'url("/house-bg.jpg")', // Consistent background
        backgroundSize: 'repeat',
        backgroundPosition: 'center',
        padding: 2,
        minHeight: '100vh',
      }}
    >
      {/* Card for User Details */}
      <Box
        sx={{
          backgroundColor: '#ffffff', // Card background
          padding: 4,
          borderRadius: 2,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
          width: '100%',
          maxWidth: 800,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          fontFamily="cursive"
          sx={{
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center',
          }}
        >
          User Details
        </Typography>
  
        {error && (
          <Typography
            color="error"
            variant="body2"
            sx={{ marginBottom: 2, textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}
  
        <Stack alignItems="center">
          <CardContent sx={{ width: '100%' }}>
            <Stack
              sx={{ position: 'relative' }}
              direction="row"
              justifyContent="center"
            >
              {editMode && image ? (
                <Avatar
                  src={URL.createObjectURL(image)}
                  sx={{
                    width: 100,
                    height: 100,
                    marginTop: 2,
                    border: '2px solid #ddd',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
              ) : (
                <ProfilePic
                  key={currentUser?.profilePicture}
                  firstName={currentUser?.firstName}
                  path={currentUser?.profilePicture}
                />
              )}
              {userId === user?._id && (
                <Button
                  sx={{
                    right: 0,
                    position: 'absolute',
                    textTransform: 'none',
                    fontWeight: 'bold',
                  }}
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
                <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                  <label htmlFor="image">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      sx={{
                        textTransform: 'none',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      Change Profile Picture
                    </Button>
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </Stack>
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
                  label="First Name"
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
                  label="Last Name"
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
              </>
            ) : (
              <Box marginTop="1rem">
                <Stack direction="column" spacing={1}>
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
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderRadius: 2,
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setEditMode(false)}
                  variant="contained"
                  color="secondary"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderRadius: 2,
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            )}
          </CardActions>
        </Stack>
      </Box>
  
      {/* PostList moved outside the card */}
      <Box
        sx={{
          marginTop: 4,
          width: '100%',
          maxWidth: 800,
        }}
      >
        <PostList
          key={`${user?.profilePicture}${user?.username}`}
          userId={userId}
        />
      </Box>
    </Box>
  );
};
