import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '../components/ToastProvider.jsx';
import { login, reset } from '../features/auth/authSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const toast = useToast();

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }

    if (isSuccess || user) {
      // Redirect users based on their role
      if (user && user.role === 'hospital') {
        navigate('/hospital/dashboard');
      } else if (user && user.role === 'donor') {
        navigate('/donor/dashboard');
      } else {
        navigate('/');
      }
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch, toast]);

  const validate = (values) => {
    const nextErrors = { email: '', password: '' };
    if (!values.email) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!values.password) {
      nextErrors.password = 'Password is required';
    } else if (values.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }
    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, ...validate({ ...formData, [name]: value }) }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, ...validate(formData) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setTouched({ email: true, password: true });
    if (nextErrors.email || nextErrors.password) return;

    const userData = {
      email: formData.email,
      password: formData.password,
    };

    dispatch(login(userData));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-red-50" />
      <div className="relative mx-auto max-w-6xl py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="hidden md:flex bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex flex-col justify-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-bold leading-tight">Give Life</h2>
                <p className="text-white/90 max-w-sm">Donate blood, save lives. Sign in to manage donations, track requests, and connect with hospitals.</p>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-2xl font-semibold">10k+</p>
                  <p className="text-xs text-white/80">Donors</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-2xl font-semibold">500+</p>
                  <p className="text-xs text-white/80">Hospitals</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-2xl font-semibold">24/7</p>
                  <p className="text-xs text-white/80">Support</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:max-w-none max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Logo Section */}
              <div className="flex justify-center mb-8 md:hidden">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Header */}
              <div className="text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
                <p className="text-gray-600">Sign in to continue to Give Life</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Toasts handle error display */}

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your email"
                      autoComplete="email"
                      aria-invalid={Boolean(touched.email && errors.email)}
                      aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${touched.email && errors.email ? 'border-red-400' : 'border-gray-300'}`}
                      required
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p id="email-error" className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      aria-invalid={Boolean(touched.password && errors.password)}
                      aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${touched.password && errors.password ? 'border-red-400' : 'border-gray-300'}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p id="password-error" className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#forgot" className="text-sm text-red-600 hover:text-red-700 font-medium">
                    Forgot Password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  aria-busy={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-start text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    aria-label="Continue with Google"
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Google</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Continue with Facebook"
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Facebook</span>
                  </button>
                </div>
              </form>

              {/* Bottom actions */}
              <div className="mt-8 text-left space-y-3">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register-donor" className="text-red-600 hover:text-red-700 font-semibold">
                    Sign up now
                  </Link>
                </p>
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 block">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;