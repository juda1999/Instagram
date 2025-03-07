import { Avatar, IconButton } from '@mui/material';
import React from 'react';
import { getImageRequestPath } from '../api';

type ProfilePicProps = {
  path: string;
  name?: string;
  onClick?: () => void;
};

export const ProfilePic: React.FC<ProfilePicProps> = ({
  name,
  onClick,
  path,
}) => {
  return (
    <IconButton disableRipple onClick={onClick}>
      <Avatar key={path} alt={name ?? 'User'} src={getImageRequestPath(path)} />
    </IconButton>
  );
};
