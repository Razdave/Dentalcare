import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  Smile, 
  Anchor, 
  Gem, 
  ShieldAlert, 
  HeartHandshake, 
  Zap, 
  Clock, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useDental } from '../context/DentalContext.tsx';
import { DentalService } from '../types.ts';

export const ServicesSection: React.FC = () => {
  const { services, openBookingModal } = useDental();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Treatments' },
    { id: 'preventive', label: 'Preventive & Hygiene' },
    { id: 'cosmetic', label: 'Cosmetic & Whitening' },
    { id: 'orthodontics', label: 'Clear Aligners' },
    { id: 'restorative', label: 'Restorative & Implants' },
    { id: 'surgical', label: 'Urgent & Surgical' },
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'Smile': return <Smile className="w-5 h-5" />;
      case 'Anchor': return <Anchor className="w-5 h-5" />;
      case 'Gem': return <Gem className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Personalized Dental Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Comprehensive Care for Every Stage of Your Smile
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              From routine gentle maintenance to transformative cosmetic treatments, each procedure is tailored with high-precision digital equipment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openBookingModal()}
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Schedule Treatment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header with icon and popular badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                    {getServiceIcon(service.iconName)}
                  </div>
                  {service.popular && (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-lime-100 text-lime-900 border border-lime-200">
                      Popular
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2 line-clamp-3">
                  {service.description}
                </p>

                {/* Duration & Features */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{service.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Insurance Accepted</span>
                  </div>
                </div>
              </div>

              {/* Price & Book Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 uppercase font-semibold block">Estimated</span>
                  <span className="text-xl font-extrabold text-slate-900">${service.price}</span>
                </div>

                <button
                  onClick={() => openBookingModal(service)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer group-hover:shadow-md"
                >
                  <span>Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
