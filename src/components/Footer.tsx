import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useDental } from '../context/DentalContext.tsx';

export const Footer: React.FC = () => {
  const { openBookingModal, setViewMode } = useDental();

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                🦷
              </div>
              <span className="text-2xl font-extrabold tracking-tight">Oraluxe</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Modern dental clinic dedicated to pain-free, gentle dentistry. Combining digital intraoral scans, aesthetic artistry, and patient comfort.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ADA & HIPAA Certified</span>
              </div>
              <span>&bull;</span>
              <span>License #CA-DEN-88219</span>
            </div>
          </div>

          {/* Clinic Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Clinic Hours
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Mon - Thu</span>
                <span className="text-white font-medium">8:00 AM - 6:30 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Friday</span>
                <span className="text-white font-medium">8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Saturday</span>
                <span className="text-white font-medium">9:00 AM - 3:00 PM</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Sunday</span>
                <span className="text-amber-400 font-medium">Emergency Only</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => setViewMode('home')} className="hover:text-white transition-colors cursor-pointer">
                  Clinic Overview
                </button>
              </li>
              <li>
                <button onClick={() => setViewMode('services')} className="hover:text-white transition-colors cursor-pointer">
                  Dental Treatments
                </button>
              </li>
              <li>
                <button onClick={() => setViewMode('doctors')} className="hover:text-white transition-colors cursor-pointer">
                  Dentist Directory
                </button>
              </li>
              <li>
                <button onClick={() => setViewMode('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Patient Health Portal
                </button>
              </li>
              <li>
                <button onClick={() => setViewMode('emails')} className="hover:text-white transition-colors cursor-pointer">
                  Automated Email Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Booking Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Need Assistance?
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>+1 (555) 019-2834</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>care@oraluxe.clinic</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Suite 400, 742 Evergreen Medical Plaza</span>
              </div>
            </div>

            <button
              onClick={() => openBookingModal()}
              className="mt-3 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              Book an Appointment
            </button>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Oraluxe Healthcare Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>&bull;</span>
            <span>Terms of Service</span>
            <span>&bull;</span>
            <span>HIPAA Notice of Privacy Practices</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
