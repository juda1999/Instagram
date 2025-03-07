import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Box } from '@mui/material';

interface PrivateRouteProps {
  element: React.ReactNode;
}

export const PrivateRouteComponent: React.FC<PrivateRouteProps> = ({
  element,
}) => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signIn');
    }
  }, [user]);

  return <Box sx={{ marginTop: '16px' }}>{element}</Box>;
};
