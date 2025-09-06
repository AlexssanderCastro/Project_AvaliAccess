import React from 'react';
import HomePage from './pages/HomePage';
import Footer from './components/layout/Footer';
import './App.css';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
