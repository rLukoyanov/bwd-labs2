import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import EventsPage from './pages/events/events';
import EventDetails from './pages/events/EventDetails';
import CreateEvent from './pages/events/CreateEvent';
import theme from './theme';
import AuthButton from './components/AuthButton';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
              <Typography
                variant="h6"
                component="a"
                href="/"
                sx={{
                  flexGrow: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 700,
                }}
              >
                Webi
              </Typography>
              <AuthButton />
            </Toolbar>
          </AppBar>
          <Container component="main" maxWidth={false} sx={{ flex: 1, py: 4 }}>
            <Routes>
              <Route path="/" element={<EventsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/events/:id" element={<EventDetails />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
