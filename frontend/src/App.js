import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Contact from './pages/ContactUs';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import MaterialsPage from './pages/MaterialsPage';
import ChatsPage from './pages/ChatsPage';
import TransactionsPage from './pages/TransactionsPage';
import BuyForm from './pages/BuyForm';
import EditPost from './pages/EditPost';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#673ab7',
      },
      secondary: {
        main: '#ff5722',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
  
    if (!token || !user) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
  };
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          >
            {/* Nested Routes under /home */}
            <Route index element={<HomePage />} />
            <Route path="post" element={<PostPage />} />
            <Route path="materials" element={<MaterialsPage />} />
            <Route path="chats" element={<ChatsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="buy" element={<BuyForm />} />
            <Route path="buy/:postId" element={<BuyForm />} />
            <Route path="edit-post/:postId" element={<EditPost />} />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
