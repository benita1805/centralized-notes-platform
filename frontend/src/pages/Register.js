// src/pages/Register.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) navigate('/dashboard');
  }, [isAuthenticated, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!termsAccepted) newErrors.terms = 'Accept terms to continue';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result?.success !== false) navigate('/dashboard');
      else setErrors({ submit: result?.message || 'Registration failed' });
    } catch (error) {
      setErrors({ submit: 'Something went wrong' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center space-y-2">
        <h1 className="text-magentaGlow text-2xl font-bold">✨ Create Account</h1>
        <p className="text-sm text-cyanGlow">
          Already have an account?{' '}
          <Link to="/login" className="text-magentaGlow hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {errors.submit && <p className="text-center text-red-400 text-sm">{errors.submit}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-3 bg-black text-magentaGlow border ${errors.name ? 'border-red-400' : 'border-cyanGlow'} rounded placeholder-cyanGlow focus:outline-none`}
          placeholder="Full Name"
        />
        {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full p-3 bg-black text-magentaGlow border ${errors.email ? 'border-red-400' : 'border-cyanGlow'} rounded placeholder-cyanGlow focus:outline-none`}
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}

        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-3 bg-black text-magentaGlow border ${errors.password ? 'border-red-400' : 'border-cyanGlow'} rounded placeholder-cyanGlow focus:outline-none`}
            placeholder="Password"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-cyanGlow hover:text-magentaGlow"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
        </div>

        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full p-3 bg-black text-magentaGlow border ${errors.confirmPassword ? 'border-red-400' : 'border-cyanGlow'} rounded placeholder-cyanGlow focus:outline-none`}
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword}</p>}

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="h-4 w-4 text-magentaGlow border-cyanGlow bg-black rounded"
          />
          <label className="text-sm text-cyanGlow">
            I agree to the{' '}
            <Link to="/terms" className="text-magentaGlow hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-magentaGlow hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.terms && <p className="text-sm text-red-400">{errors.terms}</p>}

        <button
  type="submit"
  disabled={isSubmitting}
  className="w-full py-3 mt-4 text-lg font-semibold bg-magentaGlow text-white border-2 border-cyanGlow rounded-lg hover:bg-cyanGlow hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
>
  {isSubmitting ? (
    <>
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      <span>Registering...</span>
    </>
  ) : (
    <>
      <span className="text-lg">🚀</span>
      <span>Create Account</span>
    </>
  )}
</button>

      </form>
    </AuthLayout>
  );
};

export default Register;
