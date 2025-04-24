/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAuthClick = () => {
    setAuthOpen(true);
  };

  const handleAuthClose = () => {
    setAuthOpen(false);
    setActiveTab(0);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Неверный логин или пароль');
      }
      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
      } else {
        throw new Error('Неверный логин или пароль');
      }

      
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Неверный логин или пароль');
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name: Math.random().toString() }),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Данная почта уже занята или некорректная');
      }

      await handleLogin(email, password);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
      throw new Error('Данная почта уже занята или некорректная');
    }
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {isAuthenticated ? (
        <>
          <Button
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.primary',
              textTransform: 'none',
            }}
          >
            <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
            <Typography variant="body1">User</Typography>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAuthClick}
          sx={{ textTransform: 'none' }}
        >
          Login
        </Button>
      )}

      <Dialog open={authOpen} onClose={handleAuthClose}>
        <DialogTitle>Авторизация</DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Вход" />
            <Tab label="Регистрация" />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {activeTab === 0 ? (
              <LoginForm onLogin={handleLogin} onClose={handleAuthClose} />
            ) : (
              <RegisterForm onRegister={handleRegister} onClose={handleAuthClose} />
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AuthButton; 