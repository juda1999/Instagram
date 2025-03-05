import { Avatar, IconButton } from '@mui/material';
import React from 'react';
import { getImageRequestPath } from '../api';

type ProfilePicProps = {
  path: string;
  onClick?: () => void;
};

export const ProfilePic: React.FC<ProfilePicProps> = ({ onClick, path }) => {
  return (
    <IconButton disableRipple onClick={onClick} sx={{ p: 0 }}>
      <Avatar alt="User" src={getImageRequestPath(path)} />
    </IconButton>
  );
};
