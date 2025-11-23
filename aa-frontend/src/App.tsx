import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './router';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
