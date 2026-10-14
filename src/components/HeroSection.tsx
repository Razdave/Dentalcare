import React from 'react';
import { Star, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useDental } from '../context/DentalContext.tsx';
import { HERO_DENTIST_IMAGE } from '../data/mockData.ts';

export const HeroSection: React.FC = () => {
  const { openBookingModal, setViewMode } = useDental();

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Main Hero Curved Container */}
        <div className="relative rounded-[32px] md:rounded-[40px] bg-gradient-to-r from-[#0D3B7D] via-[#114B97] to-[#1E5EA8] text-white overflow-hidden shadow-2xl shadow-blue-950/25 border border-blue-400/20">
          
          {/* Subtle Ambient Decorative Gradients */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sky-300/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[580px] lg:min-h-[640px] px-6 sm:px-10 lg:px-16 py-12 lg:py-8 gap-10">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 z-10 space-y-6 lg:space-y-8 max-w-2xl">
              
              {/* Clinic Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-xs sm:text-sm font-medium shadow-xs">
                <span className="text-base">🦷</span>
                <span>Trusted Dental Care Clinic</span>
              </div>

              {/* Main Headline with Signature Serif Italic */}
              <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-extrabold tracking-tight leading-[1.08] text-white">
                Healthy <span className="font-serif-italic font-normal text-white text-5xl sm:text-6xl lg:text-[80px] tracking-normal inline-block pr-1">Smiles</span>,
                <br />
                Confident Lives.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-blue-100/90 font-normal leading-relaxed max-w-xl">
                Modern, gentle, and personalized dental care to keep your smile bright and pain-free. Experience relaxed dentistry with top-tier specialists.
              </p>

              {/* Call to Action and Social Proof Rating */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
                <button
                  onClick={() => openBookingModal()}
                  className="px-8 py-4 rounded-full bg-[#CEF04C] hover:bg-[#bde038] text-slate-950 font-bold text-base shadow-lg shadow-lime-950/25 hover:shadow-lime-950/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2.5 group"
                >
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Stars and Patient Count */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1 text-amber-300">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                    ))}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-white/90 flex items-center gap-1.5">
                    <span className="font-bold text-white">5,000+</span>
                    <span>Patients Trust Our Services</span>
                  </div>
                </div>
              </div>

              {/* Quick Feature Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-blue-200/80 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#CEF04C]" />
                  <span>Pain-Free Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#CEF04C]" />
                  <span>Same-Day Emergency Slots</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Instant Confirmation Email</span>
                </div>
              </div>
            </div>

            {/* Right Visual Column with Doctor, Floating Cards, & Badges */}
            <div className="lg:col-span-5 relative flex items-end justify-center lg:justify-end h-full min-h-[420px] lg:min-h-[580px]">
              
              {/* Floating Speech Bubble Top Left */}
              <div className="absolute top-4 sm:top-8 left-2 sm:-left-6 z-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-xl border border-white/25 px-4 py-2.5 rounded-2xl shadow-xl shadow-blue-950/30">
                  <div className="text-xs sm:text-sm font-medium text-white leading-snug">
                    How Are Your Teeth Feeling<br />
                    <span className="text-sky-200 font-semibold">Today?</span>
                  </div>
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/60 shrink-0 shadow-sm">
                    <img 
                      src={HERO_DENTIST_IMAGE}
                      alt="Dr. Sarah" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Glass Stat Card: 92% Teeth in Excellent Condition */}
              <button 
                onClick={() => setViewMode('dashboard')}
                className="absolute top-28 sm:top-36 left-0 sm:-left-4 z-20 text-left cursor-pointer group hover:scale-105 transition-transform"
                title="View your teeth health dashboard"
              >
                <div className="bg-white/15 backdrop-blur-xl border border-white/25 p-4 rounded-2xl shadow-2xl shadow-blue-950/30 max-w-[210px]">
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-extrabold text-white tracking-tight">92%</div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      OPTIMAL
                    </span>
                  </div>
                  <div className="text-xs text-blue-100/90 mt-1 font-medium leading-snug">
                    Your Teeth Are In Excellent Condition
                  </div>
                  <div className="mt-2.5 w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-[#CEF04C] h-full rounded-full w-[92%]" />
                  </div>
                </div>
              </button>

              {/* High-Resolution Hero Dentist Portrait */}
              <div className="relative z-10 w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[440px] pt-12 flex items-end">
                <div className="relative w-full rounded-b-3xl overflow-hidden drop-shadow-2xl">
                  <img
                    src={HERO_DENTIST_IMAGE}
                    alt="Dr. Sarah Jenkins - Lead Aesthetic Dentist at Oraluxe"
                    className="w-full h-auto object-cover object-top max-h-[540px] transform hover:scale-[1.01] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle bottom gradient shadow blend */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#114B97] to-transparent pointer-events-none" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
