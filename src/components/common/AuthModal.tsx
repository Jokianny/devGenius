import React, { useState } from 'react';
import { 
  X, Lock, Mail, User as UserIcon, Phone, 
  ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, 
  Sparkles, KeyRound 
} from 'lucide-react';
import { db } from '../../services/db';
import { User } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onAuthSuccess
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    setTimeout(() => {
      const res = db.login(loginEmail, loginPassword);
      setLoginLoading(false);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        onClose();
      } else {
        setLoginError(res.message);
      }
    }, 300);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      setRegError('Please fill in all required registration fields.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setRegLoading(true);

    setTimeout(() => {
      const res = db.register({
        full_name: regFullName,
        email: regEmail,
        phone: regPhone,
        password: regPassword
      });

      setRegLoading(false);

      if (res.success && res.user) {
        setRegSuccess(res.message);
        setTimeout(() => {
          onAuthSuccess(res.user!);
          onClose();
        }, 800);
      } else {
        setRegError(res.message);
      }
    }, 400);
  };

  const fillDemoAccount = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setLoginEmail('sarah.mensah@example.com');
      setLoginPassword('Password123!');
    } else {
      setLoginEmail('admin@devgenius.academy');
      setLoginPassword('Password123!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A3A]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 pt-5 pb-3">
          <div className="flex gap-4">
            <button
              onClick={() => { setTab('login'); setLoginError(''); }}
              className={`pb-2 text-sm font-bold tracking-tight border-b-2 transition-all cursor-pointer ${
                tab === 'login'
                  ? 'border-[#082592] text-[#082592]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setRegError(''); }}
              className={`pb-2 text-sm font-bold tracking-tight border-b-2 transition-all cursor-pointer ${
                tab === 'register'
                  ? 'border-[#F28C18] text-[#F28C18]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Student Registration
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {tab === 'login' ? (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-heading font-bold text-slate-900">
                  Welcome Back to DevGenius
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your credentials to access your courses and submissions.
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400">Default: Password123!</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2.5 px-4 bg-[#082592] hover:bg-[#061A3A] text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loginLoading ? 'Authenticating...' : 'Sign In to Portal'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Account Quick Switcher */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F28C18]" />
                  Instant Testing Accounts:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('student')}
                    className="p-2 text-left rounded-lg bg-blue-50/70 hover:bg-blue-100/70 border border-blue-100 transition-colors cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-[#082592]">Student Demo</div>
                    <div className="text-[10px] text-slate-500 truncate">Sarah Mensah</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('admin')}
                    className="p-2 text-left rounded-lg bg-amber-50/70 hover:bg-amber-100/70 border border-amber-100 transition-colors cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-amber-800">Admin Demo</div>
                    <div className="text-[10px] text-slate-500 truncate">Administrator</div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-heading font-bold text-slate-900">
                  Create Student Account
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Join thousands of learners and gain practical technology skills.
                </p>
              </div>

              {regError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Samuel Adekunle"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="samuel@gmail.com"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Student role assigned automatically. Secure bcrypt hashing.</span>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-2.5 px-4 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {regLoading ? 'Registering...' : 'Create Free Student Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
