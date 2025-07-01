// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(formData);
      if (result?.success !== false) navigate('/dashboard');
      else setErrorMsg(result?.message || 'Login failed');
    } catch {
      setErrorMsg('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center space-y-2">
        <h1 className="text-magentaGlow text-2xl font-bold">🔐 Login</h1>
        <p className="text-cyanGlow text-sm">Login to your NotesHub account ✨</p>
      </div>

      {errorMsg && <p className="text-center text-red-400 text-sm">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full py-3 pl-4 pr-10 bg-black text-cyanGlow border border-magentaGlow placeholder-magentaGlow rounded-lg focus:outline-none"
          />
          <Mail className="absolute right-3 top-3 text-magentaGlow" size={18} />
        </div>

        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full py-3 pl-4 pr-10 bg-black text-cyanGlow border border-magentaGlow placeholder-magentaGlow rounded-lg focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-3 text-magentaGlow hover:text-cyanGlow"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
  type="submit"
  disabled={loading}
  className="w-full py-3 mt-4 text-lg font-semibold bg-cyanGlow text-white border-2 border-magentaGlow rounded-lg hover:bg-magentaGlow hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
>
  {loading ? (
    <>
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      <span>Logging in...</span>
    </>
  ) : (
    <>
      <span className="text-lg">💾</span>
      <span>Login</span>
    </>
  )}
</button>
      </form>

      <div className="text-center text-sm text-cyanGlow mt-6">
        Don’t have an account?{' '}
        <Link to="/register" className="text-magentaGlow hover:underline font-medium">
          Create one 💡
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
