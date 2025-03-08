import { Avatar, IconButton } from '@mui/material';
import React from 'react';
import { getImageRequestPath } from '../api';

type ProfilePicProps = {
  path: string;
  firstName: string;
  onClick?: () => void;
};

export const ProfilePic: React.FC<ProfilePicProps> = ({
  firstName,
  onClick,
  path,
}) => {
  return (
    <IconButton disableRipple onClick={onClick}>
      <Avatar
        key={path}
        alt={firstName ?? 'User'}
        src={getImageRequestPath(path)}
      />
    </IconButton>
  );
};
