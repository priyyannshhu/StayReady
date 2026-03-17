import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Home, User } from 'lucide-react';

interface LoginFormData { email: string; password: string; }
interface RegisterFormData { name: string; email: string; password: string; confirmPassword: string; }

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginFormData>({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Add timeout to fetch requests
  const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 15000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    try {
      const res = await fetchWithTimeout(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else { 
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || 'Invalid email or password'); 
      }
    } catch (error: any) { 
      console.error('Login error:', error);
      if (error.message === 'Request timed out. Please try again.') {
        setError('Server is taking too long to respond. Please try again.');
      } else {
        setError('Login failed. Please check your connection and try again.'); 
      }
    }
    finally { setIsLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match'); setIsLoading(false); return;
    }
    try {
      const res = await fetchWithTimeout(`${API_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: registerForm.name, email: registerForm.email, password: registerForm.password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else { 
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || 'Registration failed'); 
      }
    } catch (error: any) { 
      console.error('Registration error:', error);
      if (error.message === 'Request timed out. Please try again.') {
        setError('Server is taking too long to respond. Please try again.');
      } else {
        setError('Registration failed. Please check your connection and try again.'); 
      }
    }
    finally { setIsLoading(false); }
  };

  const inputClass = "w-full pl-10 pr-4 py-3.5 border border-[#dddddd] rounded-xl text-sm text-[#1a1a1a] placeholder-[#717171] focus:outline-none focus:border-[#1a1a1a] focus:ring-0 transition-colors duration-150 bg-white";

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[440px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Home className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-700 text-2xl text-[#1a1a1a]">
              Stay<span className="text-primary">Ready</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.12)' }}>

          {/* Tab toggle */}
          <div className="flex border border-[#e0e0e0] rounded-xl p-1 mb-8">
            {['Log in', 'Sign up'].map((label, i) => (
              <button
                key={label}
                onClick={() => { setIsLogin(i === 0); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-display font-600 transition-all duration-150 ${
                  isLogin === (i === 0)
                    ? 'bg-[#1a1a1a] text-white'
                    : 'text-[#717171] hover:text-[#1a1a1a]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="font-display font-700 text-xl text-[#1a1a1a]">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-[#717171] mt-1">
              {isLogin ? 'Sign in to manage your properties' : 'Join thousands of property managers'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="form-label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" />
                  <input type="email" required placeholder="you@example.com" value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className={inputClass} />
                </div>
              </div>
              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" />
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Your password" value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717171] hover:text-[#1a1a1a] transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-[#717171] cursor-pointer">
                  <input type="checkbox" className="rounded border-[#dddddd]" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">Forgot password?</Link>
              </div>
              <button type="submit" disabled={isLoading}
                className="btn-primary w-full py-3.5 text-sm rounded-xl font-display font-600 flex items-center justify-center gap-2 mt-2">
                {isLoading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="form-label">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" />
                  <input type="text" required placeholder="Your full name" value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className={inputClass} />
                </div>
              </div>
              <div>
                <label className="form-label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" />
                  <input type="email" required placeholder="you@example.com" value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className={inputClass} />
                </div>
              </div>
              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" />
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Create a strong password" value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717171] hover:text-[#1a1a1a] transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" />
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Confirm your password" value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    className={inputClass} />
                </div>
              </div>
              <button type="submit" disabled={isLoading}
                className="btn-primary w-full py-3.5 text-sm rounded-xl font-display font-600 flex items-center justify-center gap-2 mt-2">
                {isLoading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><span>Create account</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-[#717171] text-center leading-relaxed">
            By {isLogin ? 'signing in' : 'creating an account'}, you agree to our{' '}
            <Link to="/terms" className="text-[#1a1a1a] underline">Terms</Link> and{' '}
            <Link to="/privacy" className="text-[#1a1a1a] underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
