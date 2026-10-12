import React from 'react';
import { 
  Calendar, 
  Mail, 
  User, 
  Clock, 
  Sparkles, 
  Menu, 
  X,
  Stethoscope
} from 'lucide-react';
import { useDental, AppViewMode } from '../context/DentalContext.tsx';

export const Navbar: React.FC = () => {
  const { viewMode, setViewMode, openBookingModal, emailNotifications } = useDental();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks: { label: string; mode: AppViewMode; badge?: number; icon?: React.ReactNode }[] = [
    { label: 'Home', mode: 'home' },
    { label: 'Services', mode: 'services' },
    { label: 'Doctors', mode: 'doctors' },
    { 
      label: 'Patient Dashboard', 
      mode: 'dashboard', 
      icon: <User className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      label: 'Email Center', 
      mode: 'emails', 
      badge: emailNotifications.length, 
      icon: <Mail className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: 'Clinic Schedule', 
      mode: 'staff', 
      icon: <Clock className="w-4 h-4 text-indigo-600" /> 
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo - Oraluxe */}
        <button 
          onClick={() => setViewMode('home')}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <svg 
              className="w-6 h-6 stroke-white stroke-[2.2] fill-none" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C8.5 2 6 4.5 6 8c0 3 1.5 5.5 2 9 .3 2.1 1.5 4 3 4s1.7-.9 2-2c.3 1.1.7 2 2 2s2.7-1.9 3-4c.5-3.5 2-6 2-9 0-3.5-2.5-6-6-6z" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
              Oraluxe
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 -mt-1">
              Dental Care
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/60 shadow-xs">
          {navLinks.map((link) => {
            const isActive = viewMode === link.mode;
            return (
              <button
                key={link.mode}
                onClick={() => {
                  setViewMode(link.mode);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge !== undefined && (
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => openBookingModal()}
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#155DFC] hover:bg-[#0047DB] text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer active:scale-95"
          >
            <Calendar className="w-4 h-4 text-blue-200 group-hover:rotate-6 transition-transform" />
            <span>Book Appointment</span>
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => openBookingModal()}
            className="px-3.5 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navLinks.map((link) => (
              <button
                key={link.mode}
                onClick={() => {
                  setViewMode(link.mode);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-3 rounded-xl text-left text-sm font-medium flex items-center justify-between border ${
                  viewMode === link.mode
                    ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
                    : 'bg-slate-50 border-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {link.icon || <Sparkles className="w-4 h-4 text-blue-400" />}
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
