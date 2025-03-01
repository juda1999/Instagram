import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PostList } from '../PostList';
import { Box, Button, IconButton, Modal, Stack } from '@mui/material';
import { UserDetails } from '../UserDetails/UserDetails';
import _ from 'lodash';
import { AppContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';
import './Home.css';
import { useRequestAction } from '../../hooks';
import { ProfilePic } from '../ProfilePic';

interface HomeContextProps {
  userDetailsId?: string;
  setUserDetailsId?: (userId: string) => void;
}

export const HomeContext = createContext<HomeContextProps>({});
export function Home() {
  const { setNavbarItems, user } = useContext(AppContext);
  const [userDetailsId, setUserDetailsId] = useState<string>();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('accessToken');
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
          }}
          onClick={() => handleLogout()}
        >
          Logout
        </Button>
        <ProfilePic
          path={user?.profilePicture}
          onClick={() => setUserDetailsId(user._id)}
        />
      </Stack>
    );
  }, []);

  return (
    <HomeContext.Provider value={{ userDetailsId, setUserDetailsId }}>
      <Box sx={{ scrollbarGutter: 'stable' }}>
        <Modal
          sx={{
            position: 'absolute',
            overflow: 'hidden',
            width: '90%',
            height: '90vh',
            left: '5%',
            top: '5%',
          }}
          onClose={() => setUserDetailsId(undefined)}
          open={!_.isNil(userDetailsId)}
        >
          <UserDetails userId={userDetailsId} />
        </Modal>
        <PostList />
      </Box>
    </HomeContext.Provider>
  );
}

export type pageType = 'create' | 'view';
