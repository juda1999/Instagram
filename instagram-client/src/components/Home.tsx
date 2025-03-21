import React, { useContext, useEffect } from 'react';
import { PostList } from './PostList';
import { Button, Stack } from '@mui/material';
import _ from 'lodash';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { ProfilePic } from './ProfilePic';

export function Home() {
  const { setNavbarItems, user } = useContext(AppContext);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/signIn');
  }

  useEffect(() => {
    setNavbarItems(
      <Stack spacing={2} alignItems="center" direction="row">
        <Button
          sx={{
            textTransform: 'none',
            backgroundColor: 'aliceblue',
            height: '50%',
            fontFamily: 'cursive',
          }}
          
          onClick={() => navigate('/add')}
        >
          Add Post
        </Button>
        <Button
          sx={{
            textTransform: 'none',
            backgroundColor: 'aliceblue',
            height: '50%',
            fontFamily: 'cursive',
          }}
          onClick={() => handleLogout()}
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

  return <PostList />;
}

export type pageType = 'create' | 'view';
