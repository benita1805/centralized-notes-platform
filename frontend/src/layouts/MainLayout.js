import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-sunset-retro text-white font-sans">
      <Navbar />
      <main className="flex-grow px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
