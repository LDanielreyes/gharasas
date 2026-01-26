import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../shared/components/layout/Navbar';
import Footer from '../shared/components/layout/Footer';

function App() {
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-body transition-colors duration-300">
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}

export default App;
