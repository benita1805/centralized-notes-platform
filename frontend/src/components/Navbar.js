import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  User,
  Menu,
  X,
  FileText,
  Upload,
  Home,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Upload', path: '/upload', icon: Upload },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-black border-b-2 border-cyanGlow text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <FileText className="h-7 w-7 text-magentaGlow" />
            <span className="text-xl font-bold text-cyanGlow">NotesHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive(item.path)
                      ? 'text-magentaGlow bg-cyanGlow/20'
                      : 'text-cyanGlow hover:text-magentaGlow hover:bg-cyanGlow/10'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="flex items-center space-x-2 text-sm text-magentaGlow">
              <User size={16} />
              <span>{user?.name || user?.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-red-500 hover:text-red-300 hover:bg-red-500/10 rounded-md transition"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-magentaGlow hover:bg-cyanGlow/10 rounded-md focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-cyanGlow bg-black px-4 py-4 space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition ${
                  isActive(item.path)
                    ? 'text-magentaGlow bg-cyanGlow/20'
                    : 'text-cyanGlow hover:text-magentaGlow hover:bg-cyanGlow/10'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="border-t border-cyanGlow pt-4">
            <div className="flex items-center space-x-2 text-sm text-magentaGlow mb-3">
              <User size={16} />
              <span>{user?.name || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-left text-base text-red-500 hover:text-red-300 hover:bg-red-500/10 rounded-md transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
