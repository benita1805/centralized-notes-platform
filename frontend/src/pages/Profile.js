import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Settings, LogOut, Home, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-sunset-retro px-4 py-12 font-sans text-white">
      <div className="max-w-2xl mx-auto bg-black border-2 border-cyanGlow rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-4">
            <User size={48} className="text-magentaGlow" />
            <div>
              <h2 className="text-2xl font-bold text-cyanGlow">
                {user?.name || 'User'}
              </h2>
              <p className="text-sm text-magentaGlow">{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="space-y-5 text-cyanGlow text-sm mb-6">
          <div className="flex items-center space-x-3">
            <Mail size={20} />
            <span>Email: {user?.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Settings size={20} />
            <span>Account Settings <span className="text-xs text-magentaGlow">(coming soon)</span></span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 bg-cyanGlow text-white px-4 py-2 rounded-lg hover:bg-magentaGlow hover:text-white transition-all duration-200"
          >
            <Home size={18} />
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center space-x-2 bg-magentaGlow text-black px-4 py-2 rounded-lg hover:bg-cyanGlow hover:text-white transition-all duration-200"
          >
            <Upload size={18} />
            <span>Upload Note</span>
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all duration-200"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

