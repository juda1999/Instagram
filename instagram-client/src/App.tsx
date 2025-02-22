import React, { useEffect, createContext, useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { Home } from './components/Home';

interface AppContextProps {
  user?: User;
  setUser?: (user: User) => void
}

interface User {
  username: string;
  password: string;
}

const AppContext = createContext<AppContextProps>({});

export function App() {
  const [user, setUser] = useState<User>()

  return (
    <AppContext.Provider value={{user, setUser}}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/signUp" element={<SignUp/>} />
      <Route path="/signIn" element={<SignIn/>} />
    </Routes>
  </BrowserRouter>
  </AppContext.Provider>
  );
}
