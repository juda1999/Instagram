import React, { Fragment, useContext } from 'react';
import { Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

interface PrivateRouteProps {
  element: React.ReactNode;
}

export const PrivateRouteComponent: React.FC<PrivateRouteProps> = ({ element }) => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/signIn');
    return null;
  }

  return <Fragment>{element}</Fragment>;
};