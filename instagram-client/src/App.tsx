import React, { useEffect, createContext, useState, Fragment } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { Home } from './components/Home';
import { PrivateRouteComponent } from './components/PrivateRouteComponent';

interface AppContextProps {
  user?: User;
  setUser?: (user: User) => void
}

export const AppContext = createContext<AppContextProps>({});

export function App() {
  const [user, setUser] = useState<User>()

  return (
    <AppContext.Provider value={{user, setUser}}>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<PrivateRouteComponent element={<Home/>}/>} />
      <Route path="/signUp" element={<SignUp/>}/>
      <Route path="/signIn" element={<SignIn/>}/>
    </Routes>
  </BrowserRouter>
  </AppContext.Provider>
  );
}

export interface User {
  username: string;
  email: string;
  profilePic: string | null;
}