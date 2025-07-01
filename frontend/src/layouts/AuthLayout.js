// src/layouts/AuthLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-sunset-retro flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-md sm:max-w-md md:max-w-lg bg-black/90 text-white border-4 border-magentaGlow p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6">
        
        {/* Logo / Branding */}
        <div className="flex items-center justify-center space-x-2 text-magentaGlow">
          <FileText size={28} />
          <span className="text-2xl font-bold tracking-wider">NotesHub</span>
        </div>

        {/* Inject Login or Register form */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
