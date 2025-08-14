import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // <-- Import AuthProvider
import { Toaster } from 'react-hot-toast';

import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true; //allowing helping cookies exchanging with backend

const theme = createTheme({
  typography: {
    fontFamily: "Roboto Slab, serif",
    allVariants: { color: "white" },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Toaster position = "top-right"/>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
