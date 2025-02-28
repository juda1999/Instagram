import React, { createContext, ReactNode, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { Home } from './components/Home';
import { PrivateRouteComponent } from './components/PrivateRouteComponent';
import { Navbar } from './components/Navbar/Navbar';
import CreatePost from './components/CreatePost';

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
    <AppContext.Provider value={{user, setUser ,navbarItems, setNavbarItems}}>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<PrivateRouteComponent element={<Home/>}/>}/>
      <Route path='/add' element={<PrivateRouteComponent element={<CreatePost/>}/>}/>
      <Route path="/signUp" element={<SignUp/>}/>
      <Route path="/signIn" element={<SignIn/>}/>
    </Routes>
  </BrowserRouter>
  </AppContext.Provider>
  );
}

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePic: string | null;
}

export interface Post {
  photo: string,
  title: String,
  uploadedBy: string,
  description: string,
  uploadedAt: Date,
}