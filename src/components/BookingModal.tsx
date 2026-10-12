import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Download,
  Eye
} from 'lucide-react';
import { useDental } from '../context/DentalContext.tsx';
import { DentalService, Dentist, Appointment } from '../types.ts';
import { TIME_SLOTS } from '../data/mockData.ts';
import { downloadCalendarEvent } from '../utils/audio.ts';

export const BookingModal: React.FC = () => {
  const { 
    isBookingOpen, 
    closeBookingModal, 
    services, 
    dentists, 
    selectedService: initialService, 
    selectedDentist: initialDentist,
    getAvailableSlots,
    bookAppointment,
    patient,
    setViewMode,
    setPreviewEmail,
    emailNotifications
  } = useDental();

  // Wizard Steps: 1: Service, 2: Doctor, 3: Date & Slot, 4: Patient Info, 5: Confirmed
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<DentalService | null>(null);
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  
  // Date selection (default to tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(tomorrowFormatted);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');

  // Patient inputs
  const [formData, setFormData] = useState({
    name: patient.name || '',
    email: patient.email || '',
    phone: patient.phone || '',
    insurance: patient.insurance || 'Delta Dental Premier',
    notes: ''
  });

  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Sync initial selections from context
  useEffect(() => {
    if (isBookingOpen) {
      if (initialService) {
        setSelectedService(initialService);
        setStep(2);
      } else {
        setSelectedService(services[0]);
      }

      if (initialDentist) {
        setSelectedDentist(initialDentist);
        setStep(3);
      } else {
        setSelectedDentist(dentists[0]);
      }

      if (!initialService && !initialDentist) {
        setStep(1);
      }
    }
  }, [isBookingOpen, initialService, initialDentist, services, dentists]);

  if (!isBookingOpen) return null;

  // Real-time available slots for selected dentist & date
  const availableSlots = selectedDentist
    ? getAvailableSlots(selectedDentist.id, selectedDate)
    : TIME_SLOTS;

  // Auto-adjust selected slot if unavailable
  const isCurrentSlotAvailable = availableSlots.includes(selectedTimeSlot);

  // Generate next 10 dates for quick selection buttons
  const dateOptions = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return { dateStr, dayName, dayNum };
  });

  const handleNextStep = () => {
    if (step === 1 && !selectedService) return;
    if (step === 2 && !selectedDentist) return;
    if (step === 3) {
      if (!selectedTimeSlot) return;
    }
    if (step === 4) {
      // Validate patient details
      const errors: { [key: string]: string } = {};
      if (!formData.name.trim()) errors.name = 'Full name is required';
      if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email is required for confirmation';
      if (!formData.phone.trim()) errors.phone = 'Phone number is required';
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      setFormErrors({});

      // Complete booking!
      const newApt = bookAppointment({
        patientName: formData.name,
        patientEmail: formData.email,
        patientPhone: formData.phone,
        serviceId: selectedService?.id || services[0].id,
        dentistId: selectedDentist?.id || dentists[0].id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        insuranceProvider: formData.insurance,
        notes: formData.notes
      });

      setCreatedAppointment(newApt);
      setStep(5);
      return;
    }

    setStep(step + 1);
  };

  const handleDownloadCalendar = () => {
    if (!createdAppointment || !selectedService || !selectedDentist) return;
    downloadCalendarEvent({
      title: `${selectedService.name} - Oraluxe Dental Clinic`,
      description: `Appointment with ${selectedDentist.name} at Oraluxe.\nNotes: ${createdAppointment.notes || 'Routine checkup'}\nInsurance: ${createdAppointment.insuranceProvider}`,
      location: 'Oraluxe Clinic, Suite 400, 742 Evergreen Medical Plaza',
      startDate: createdAppointment.date,
      timeSlot: createdAppointment.timeSlot,
      durationMinutes: selectedService.durationMinutes
    });
  };

  const handleViewEmail = () => {
    if (createdAppointment) {
      const email = emailNotifications.find((e) => e.appointmentId === createdAppointment.id) || emailNotifications[0];
      if (email) {
        setPreviewEmail(email);
        closeBookingModal();
        setViewMode('emails');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              🦷
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {step === 5 ? 'Booking Confirmed!' : 'Schedule Dental Appointment'}
              </h2>
              <p className="text-xs text-slate-500">
                {step === 5
                  ? 'Real-time schedule confirmed & automated email dispatched'
                  : `Step ${step} of 4: ${
                      step === 1
                        ? 'Select Treatment'
                        : step === 2
                        ? 'Choose Specialist'
                        : step === 3
                        ? 'Choose Date & Time'
                        : 'Patient Details'
                    }`}
              </p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        {step < 5 && (
          <div className="w-full bg-slate-100 h-1.5 flex">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-full flex-1 transition-all duration-300 ${
                  s <= step ? 'bg-blue-600' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900">Choose Treatment or Consultation:</span>
                <span className="text-xs text-slate-500">{services.length} options available</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {services.map((service) => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                          : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-bold text-sm text-slate-900">{service.name}</div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 ml-2">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-500" />
                          {service.durationMinutes} min
                        </span>
                        <span className="text-blue-700">${service.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Select Specialist */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900">Select Attending Dentist:</span>
                <span className="text-xs text-emerald-600 font-medium">All certified DDS/DMD</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dentists.map((dentist) => {
                  const isSelected = selectedDentist?.id === dentist.id;
                  return (
                    <div
                      key={dentist.id}
                      onClick={() => setSelectedDentist(dentist)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                          : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <img
                        src={dentist.image}
                        alt={dentist.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900 truncate">{dentist.name}</h4>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-blue-600 font-medium truncate mt-0.5">{dentist.specialty}</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          ★ {dentist.rating} ({dentist.reviewsCount} reviews) &bull; {dentist.experienceYears} yrs exp.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Date & Real-Time Time Slot */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Date selection carousel */}
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Select Appointment Date:
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {dateOptions.map(({ dateStr, dayName, dayNum }) => {
                    const isSelected = selectedDate === dateStr;
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`px-3.5 py-3 rounded-2xl text-center border-2 transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                          {dayName}
                        </div>
                        <div className="text-sm font-extrabold mt-0.5">
                          {dayNum}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Matrix */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-900">
                    Real-Time Available Slots for {selectedDentist?.name.split(',')[0]}:
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Booked
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {TIME_SLOTS.map((slot) => {
                    const isAvailable = availableSlots.includes(slot);
                    const isSelected = selectedTimeSlot === slot && isAvailable;

                    return (
                      <button
                        key={slot}
                        disabled={!isAvailable}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          !isAvailable
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent line-through'
                            : isSelected
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-600'
                            : 'bg-white hover:bg-blue-50/60 border border-slate-200 text-slate-800 hover:border-blue-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : isAvailable ? 'text-blue-500' : 'text-slate-300'}`} />
                          {slot}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {!isCurrentSlotAvailable && (
                  <p className="text-xs text-amber-600 mt-2 font-medium">
                    ⚠️ Selected slot is already occupied. Please select an alternate highlighted green slot.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Patient Info & Summary */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Booking Summary Card */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs uppercase font-bold tracking-wider text-blue-600">Selected Visit</div>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedService?.name} &bull; ${selectedService?.price}
                  </div>
                  <div className="text-xs text-slate-600">
                    With {selectedDentist?.name} on <strong className="text-blue-700">{selectedDate}</strong> at <strong className="text-blue-700">{selectedTimeSlot}</strong>
                  </div>
                </div>
                <div className="text-xs px-3 py-1.5 rounded-full bg-white border border-blue-200 text-blue-700 font-semibold shadow-xs">
                  {selectedService?.durationMinutes} mins
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patient Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Anderson"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.name ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-white'
                      }`}
                    />
                  </div>
                  {formErrors.name && <p className="text-[11px] text-red-500 mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email (for Automated Email Notification) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sarah.anderson@example.com"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-white'
                      }`}
                    />
                  </div>
                  {formErrors.email && <p className="text-[11px] text-red-500 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-white'
                      }`}
                    />
                  </div>
                  {formErrors.phone && <p className="text-[11px] text-red-500 mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dental Insurance
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={formData.insurance}
                      onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Delta Dental Premier">Delta Dental Premier</option>
                      <option value="MetLife Dental">MetLife Dental</option>
                      <option value="Cigna Dental">Cigna Dental</option>
                      <option value="Guardian Dental">Guardian Dental</option>
                      <option value="Aetna Dental">Aetna Dental</option>
                      <option value="No Insurance / Self-Pay Concierge">No Insurance / Self-Pay Concierge</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notes, Symptoms or Anxiety Preferences (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Mild tooth sensitivity on lower left molar, prefer gentle numbing gel..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-ping"></span>
                <span>An automated confirmation email with calendar invitation will be instantly delivered to your inbox.</span>
              </div>
            </div>
          )}

          {/* STEP 5: Success & Confirmation */}
          {step === 5 && createdAppointment && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Confirmed & Dispatched
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                  You're All Set, {createdAppointment.patientName}!
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Your appointment is confirmed for <strong className="text-slate-900">{createdAppointment.date}</strong> at <strong className="text-slate-900">{createdAppointment.timeSlot}</strong> with {selectedDentist?.name}.
                </p>
              </div>

              {/* Automated Email notification alert box */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 max-w-lg mx-auto text-left flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-900">Automated Notification Delivered:</div>
                  <div className="text-xs text-blue-700 mt-0.5">
                    A confirmation email has been dispatched to <strong>{createdAppointment.patientEmail}</strong> with pre-visit instructions and calendar files.
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadCalendar}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .ICS Calendar Event</span>
                </button>

                <button
                  onClick={handleViewEmail}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Automated Email</span>
                </button>

                <button
                  onClick={() => {
                    closeBookingModal();
                    setViewMode('dashboard');
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>Open Patient Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        {step < 5 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-white text-slate-600 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              <span>{step === 4 ? 'Confirm & Dispatch Booking' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
