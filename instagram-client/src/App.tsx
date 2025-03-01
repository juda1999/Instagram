import React, { createContext, ReactNode, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SignIn, SignUp, Home, PrivateRouteComponent, Navbar, CreatePost } from './components';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Box } from '@mui/material';

interface AppContextProps {
  user?: User;
  setUser?: (user: User) => void;
  navbarItems?: ReactNode;
  setNavbarItems?: (items: ReactNode) => void;
}

export const AppContext = createContext<AppContextProps>({});

export function App() {
  const [user, setUser] = useState<User>()
  const [navbarItems, setNavbarItems] = useState<ReactNode>([])

  return (
    /// move secret
    <GoogleOAuthProvider clientId="552634801343-odnvmi18ds914j0hci9a6mhuqrbuvebk.apps.googleusercontent.com">
      <AppContext.Provider value={{
        user, setUser: (user) => {
          console.log(user)
          setUser(user)
        }, navbarItems, setNavbarItems
      }}>
        <BrowserRouter>
            <Navbar />
            <Box sx={{ marginTop: "16px"}}>
            <Routes>
              <Route path='/' element={<PrivateRouteComponent element={<Home />} />} />
              <Route path='/add' element={<PrivateRouteComponent element={<CreatePost />} />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/signIn" element={<SignIn />} />
            </Routes>
            </Box>
        </BrowserRouter>
      </AppContext.Provider>
    </GoogleOAuthProvider>);
}

export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  likedPosts: string[];
}

export interface Post {
  _id: string;
  photo: string;
  title: string;
  uploadedBy: string;
  description: string;
  uploadedAt: Date;
}

export interface Comment {
  message: string;
  post: string;
  uploadedBy: string;
  uploadedAt: Date;
}
