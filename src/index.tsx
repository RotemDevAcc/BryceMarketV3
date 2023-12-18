import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Login from './components/login/Login';
import DarkMode from './components/settings/DarkMode';
// End Components

// Other
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './Layout';
import Super from './components/supermarket/Super';
import Contact from './Contact';
import Profile from './Profile';
import Register from './components/login/Register';
import Adminproducts from './components/management/Adminproducts';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
        <BrowserRouter>
          <ToastContainer position="top-center" theme='dark' />
          <DarkMode/>
          <Routes>
          <Route
              path="/*"
              element={<Layout />}
            >
              <Route index element={<App />} />
              <Route path="super" element={<Super />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="contact" element={<Contact />} />
              <Route path="profile" element={<Profile />} />
              {/* Admin */}
              <Route path="allproducts" element={<Adminproducts />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </Provider>
  </React.StrictMode>
);