import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {IconButton} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate()

  return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Instagram
          </Typography>
          <IconButton
            onClick={() =>  navigate("/userProfile")}
            size="large"
            color="inherit">
            <AccountCircle />
            </IconButton>
        </Toolbar>
      </AppBar>
  );
}
