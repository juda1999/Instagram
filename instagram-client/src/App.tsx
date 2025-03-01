import React, { createContext, ReactNode, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { Home } from './components/Home';
import { PrivateRouteComponent } from './components/PrivateRouteComponent';
import { Navbar } from './components/Navbar/Navbar';
import CreatePost from './components/CreatePost/CreatePost';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
          <Routes>
            <Route path='/' element={<PrivateRouteComponent element={<Home />} />} />
            <Route path='/add' element={<PrivateRouteComponent element={<CreatePost />} />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/signIn" element={<SignIn />} />
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </GoogleOAuthProvider>);
}

export interface User {
  _id: string;
  username: string;
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
