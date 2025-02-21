import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './components/signIn/signIn';
import SignUp from './components/signUp/signUp';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App/>} />
          <Route path="/signUp" element={<SignIn/>} />
          <Route path="/signIn" element={<SignUp/>} />
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);
