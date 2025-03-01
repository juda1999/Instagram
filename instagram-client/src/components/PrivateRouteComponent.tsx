import React, { Fragment, useContext, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

interface PrivateRouteProps {
  element: React.ReactNode;
}

export const PrivateRouteComponent: React.FC<PrivateRouteProps> = ({
   element
  }) => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signIn');
    }
  },
    [user])

  return <Fragment>{element}</Fragment>;
};