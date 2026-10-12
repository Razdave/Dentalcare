import React from 'react';
import { Star, Calendar, Award, GraduationCap, CheckCircle } from 'lucide-react';
import { useDental } from '../context/DentalContext.tsx';
import { Dentist } from '../types.ts';

export const DoctorsSection: React.FC = () => {
  const { dentists, openBookingModal } = useDental();

  return (
    <section id="doctors" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            Certified Dental Specialists
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Meet Your Expert Care Team
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Every specialist at Oraluxe combines Ivy-League dental training with a warm, gentle touch to eliminate dental anxiety.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dentists.map((dentist: Dentist) => (
            <div
              key={dentist.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo container */}
                <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
                  <img
                    src={dentist.image}
                    alt={dentist.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{dentist.rating}</span>
                    <span className="text-slate-600 font-normal">({dentist.reviewsCount})</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-blue-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                    {dentist.experienceYears}+ Years Clinical Exp.
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {dentist.name}
                  </h3>
                  <div className="text-xs font-semibold text-blue-600 mt-0.5">
                    {dentist.specialty}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {dentist.bio}
                  </p>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
                      <span className="truncate">{dentist.education}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{dentist.availableDays.slice(0, 3).join(', ')}...</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => openBookingModal(undefined, dentist)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book with {dentist.name.split(',')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
