import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { AppContext } from '../App';

export const Navbar: React.FC = () => {
  const { navbarItems } = useContext(AppContext);
  return (
    <AppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1}>
          <Typography variant="h6">Instagram</Typography>
        </Stack>
        {navbarItems}
      </Toolbar>
    </AppBar>
  );
};
