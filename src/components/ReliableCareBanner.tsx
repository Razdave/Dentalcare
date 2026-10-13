import React from 'react';
import { CLINIC_TEAM_IMAGE } from '../data/mockData.ts';

export const ReliableCareBanner: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        
        {/* Top small eyebrow */}
        <p className="text-xs sm:text-sm font-bold tracking-widest text-blue-600 uppercase mb-4">
          Uncompromised Patient Safety & Clinical Excellence
        </p>

        {/* Large Typography with Inline Photo Badges as seen in Dribbble design */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-slate-800 leading-[1.4] sm:leading-[1.45] tracking-tight">
          We Provide Reliable Dental Care Using
          <span className="block mt-2 sm:mt-1 font-semibold text-slate-500">
            Modern Tools And Experienced{' '}
            <span className="inline-flex items-center align-middle mx-1.5 px-2 py-1 bg-blue-50 border border-blue-200/80 rounded-full shadow-xs hover:scale-105 transition-transform">
              <span className="w-10 h-7 rounded-full overflow-hidden inline-block mr-1.5 shadow-xs">
                <img
                  src={CLINIC_TEAM_IMAGE}
                  alt="Oraluxe Clinical Team"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </span>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider pr-1">Team</span>
            </span>{' '}
            Professionals To Keep
          </span>
          <span className="block mt-2 sm:mt-1 font-semibold text-slate-500">
            Your Treatment{' '}
            <span className="inline-flex items-center align-middle mx-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full shadow-xs hover:scale-105 transition-transform">
              <span className="w-9 h-7 rounded-full overflow-hidden inline-block mr-1.5 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=120&q=80"
                  alt="Relaxed Comfortable Patient"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </span>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider pr-1">Gentle</span>
            </span>{' '}
            Comfortable And Effective.
          </span>
        </h2>

        {/* Highlights row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-2xl font-extrabold text-blue-700">99.4%</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Patient Comfort Satisfaction</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-2xl font-extrabold text-blue-700">&lt; 15 min</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Zero Wait Time Guarantee</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-2xl font-extrabold text-blue-700">100%</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Digital 3D Intraoral Scans</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-2xl font-extrabold text-blue-700">Instant</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Automated Email Reminders</div>
          </div>
        </div>

      </div>
    </section>
  );
};
