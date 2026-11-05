import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { db } from '../../services/db';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address.');
      setIsSuccess(false);
      return;
    }

    const res = db.subscribeNewsletter(email);
    setMessage(res.message);
    setIsSuccess(true);
    setEmail('');
  };

  return (
    <section className="py-14 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-[#082592] to-[#1746C5] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-white">
          {/* Subtle curved background lines */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center">
              <Mail className="w-6 h-6 text-[#F28C18]" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
              Stay Updated With DevGenius Academy
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto leading-relaxed">
              Subscribe to our weekly dispatch for modern web tutorials, free workshop alerts, and tech industry career guides.
            </p>

            <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 bg-white text-slate-900 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#F28C18]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {message && (
              <div className={`text-xs p-2 rounded-lg inline-flex items-center gap-1.5 ${isSuccess ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'}`}>
                {isSuccess && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
