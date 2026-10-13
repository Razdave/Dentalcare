import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Download, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  XCircle, 
  FileText, 
  PlusCircle,
  BellRing,
  Smile
} from 'lucide-react';
import { useDental } from '../context/DentalContext.tsx';
import { ToothCondition, Appointment } from '../types.ts';
import { downloadCalendarEvent } from '../utils/audio.ts';

export const PatientDashboard: React.FC = () => {
  const { 
    patient, 
    appointments, 
    teethConditions, 
    markToothCondition, 
    services, 
    dentists, 
    rescheduleAppointment, 
    cancelAppointment, 
    trigger24hReminder,
    openBookingModal,
    setPreviewEmail,
    emailNotifications,
    setViewMode
  } = useDental();

  const [selectedTooth, setSelectedTooth] = useState<ToothCondition | null>(teethConditions[7]); // tooth #8 default
  const [reschedulingAptId, setReschedulingAptId] = useState<string | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>('2026-10-22');
  const [newRescheduleTime, setNewRescheduleTime] = useState<string>('11:30 AM');

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  );

  const pastAppointments = appointments.filter(
    (a) => a.status === 'completed'
  );

  const handleExportCal = (apt: Appointment) => {
    const service = services.find((s) => s.id === apt.serviceId) || services[0];
    const dentist = dentists.find((d) => d.id === apt.dentistId) || dentists[0];
    downloadCalendarEvent({
      title: `${service.name} with ${dentist.name}`,
      description: `Oraluxe Dental Clinic Appointment.\nPatient: ${apt.patientName}\nInsurance: ${apt.insuranceProvider}`,
      location: 'Oraluxe Clinic, Suite 400, 742 Evergreen Medical Plaza',
      startDate: apt.date,
      timeSlot: apt.timeSlot,
      durationMinutes: service.durationMinutes
    });
  };

  const handleExecuteReschedule = (aptId: string) => {
    rescheduleAppointment(aptId, newRescheduleDate, newRescheduleTime);
    setReschedulingAptId(null);
  };

  // Group teeth into Upper Arch (1-16) and Lower Arch (17-32)
  const upperTeeth = teethConditions.filter((t) => t.number <= 16);
  const lowerTeeth = teethConditions.filter((t) => t.number > 16);

  const getToothStatusColor = (status: ToothCondition['status']) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-100 border-emerald-400 text-emerald-800';
      case 'cleaned': return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'treated': return 'bg-indigo-100 border-indigo-400 text-indigo-800';
      case 'monitoring': return 'bg-amber-100 border-amber-400 text-amber-800';
      default: return 'bg-slate-100 border-slate-300 text-slate-800';
    }
  };

  return (
    <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-slate-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dashboard Patient Top Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-sky-500 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-blue-500/20">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome, {patient.name}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Active Patient
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                <span>ID: {patient.id}</span>
                <span>&bull;</span>
                <span>{patient.email}</span>
                <span>&bull;</span>
                <span className="text-emerald-700 font-semibold">{patient.insurance}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openBookingModal()}
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book Next Checkup</span>
            </button>
            <button
              onClick={() => setViewMode('emails')}
              className="px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Notification Logs</span>
            </button>
          </div>
        </div>

        {/* Top Grid: Next Appointment + Dental Health Score */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Upcoming Appointment Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h2 className="text-lg font-bold text-slate-900">Upcoming Scheduled Visit</h2>
                </div>
                {upcomingAppointments.length > 0 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    Real-time Confirmed
                  </span>
                )}
              </div>

              {upcomingAppointments.length > 0 ? (
                <div className="space-y-6">
                  {upcomingAppointments.slice(0, 1).map((apt) => {
                    const dentist = dentists.find((d) => d.id === apt.dentistId);
                    const service = services.find((s) => s.id === apt.serviceId);

                    return (
                      <div key={apt.id} className="space-y-5">
                        {/* Detail box */}
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-slate-50 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                              {service?.category} Care
                            </span>
                            <div className="text-lg font-extrabold text-slate-900">
                              {service?.name}
                            </div>
                            <div className="text-xs text-slate-600 flex items-center gap-2">
                              <span>Attending: <strong>{dentist?.name}</strong></span>
                              <span>&bull;</span>
                              <span>Duration: {service?.durationMinutes} min</span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto border sm:border-0 border-blue-100">
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Date & Time</div>
                            <div className="text-base font-extrabold text-blue-700 mt-0.5">{apt.date}</div>
                            <div className="text-xs font-bold text-slate-700">{apt.timeSlot}</div>
                          </div>
                        </div>

                        {/* Automated email triggers and calendar action bar */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-1">
                          <button
                            onClick={() => handleExportCal(apt)}
                            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export Calendar (.ICS)</span>
                          </button>

                          <button
                            onClick={() => setReschedulingAptId(reschedulingAptId === apt.id ? null : apt.id)}
                            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reschedule</span>
                          </button>

                          <button
                            onClick={() => trigger24hReminder(apt.id)}
                            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-blue-200"
                            title="Simulate automated 24-hour reminder email dispatch"
                          >
                            <BellRing className="w-3.5 h-3.5 text-blue-600" />
                            <span>Dispatch 24h Reminder Email</span>
                          </button>

                          <button
                            onClick={() => cancelAppointment(apt.id)}
                            className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 cursor-pointer ml-auto"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>

                        {/* Inline Rescheduling Picker */}
                        {reschedulingAptId === apt.id && (
                          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 animate-in fade-in duration-200">
                            <div className="text-xs font-bold text-amber-900">
                              Reschedule Appointment Slot:
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] font-semibold text-slate-600 block mb-1">New Date</label>
                                <input
                                  type="date"
                                  value={newRescheduleDate}
                                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                                  className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white border border-slate-200"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-semibold text-slate-600 block mb-1">New Time Slot</label>
                                <select
                                  value={newRescheduleTime}
                                  onChange={(e) => setNewRescheduleTime(e.target.value)}
                                  className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white border border-slate-200"
                                >
                                  <option value="09:15 AM">09:15 AM</option>
                                  <option value="10:00 AM">10:00 AM</option>
                                  <option value="11:30 AM">11:30 AM</option>
                                  <option value="02:00 PM">02:00 PM</option>
                                  <option value="03:30 PM">03:30 PM</option>
                                  <option value="04:15 PM">04:15 PM</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                onClick={() => setReschedulingAptId(null)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200/50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleExecuteReschedule(apt.id)}
                                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                              >
                                Confirm Reschedule & Send Email
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No upcoming appointments scheduled</p>
                  <p className="text-xs text-slate-500 mt-0.5">Book your routine cleaning or examination now</p>
                  <button
                    onClick={() => openBookingModal()}
                    className="mt-4 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-xs"
                  >
                    Schedule Now
                  </button>
                </div>
              )}
            </div>

            {/* Preparation notice */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Digital check-in completed. Arrive 10 mins early for coffee and relaxation lounge.</span>
            </div>
          </div>

          {/* Dental Condition Metric & Score (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0F3876] via-[#12428B] to-[#1E56A0] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  Digital Tooth Health Index
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              </div>

              <div className="flex items-baseline gap-3 my-4">
                <div className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                  {patient.toothHealthScore}%
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-300">EXCELLENT</div>
                  <div className="text-xs text-blue-200">Clinical Hygiene Rating</div>
                </div>
              </div>

              <p className="text-sm text-blue-100/90 leading-relaxed">
                {patient.teethConditionStatus}. No active cavities detected. Gum pocket depth is within optimal 2-3mm healthy thresholds.
              </p>

              {/* Progress visual bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-xs text-blue-200 font-medium">
                  <span>Enamel Stability</span>
                  <span>{patient.toothHealthScore}/100</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-[#CEF04C] transition-all duration-700"
                    style={{ width: `${patient.toothHealthScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-blue-300/80 block">Last Cleaning</span>
                <span className="font-bold text-white text-sm">{patient.lastVisitDate}</span>
              </div>
              <div>
                <span className="text-blue-300/80 block">Next Preventive Due</span>
                <span className="font-bold text-[#CEF04C] text-sm">Oct 2026</span>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive 32-Teeth Condition Explorer */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Interactive Dental Condition Chart (32 Teeth)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any tooth on the upper or lower arch to inspect clinical notes or update treatment status.
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-400"></span> Healthy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-400"></span> Cleaned & Polished
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-100 border border-indigo-400"></span> Treated (Restored)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-400"></span> Monitoring
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Tooth Grid Arch View (8 cols) */}
            <div className="lg:col-span-8 space-y-6 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
              
              {/* Upper Arch */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Upper Arch (Teeth #1 - #16)
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
                  {upperTeeth.map((tooth) => {
                    const isSelected = selectedTooth?.number === tooth.number;
                    return (
                      <button
                        key={tooth.number}
                        onClick={() => setSelectedTooth(tooth)}
                        className={`h-11 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          getToothStatusColor(tooth.status)
                        } ${isSelected ? 'ring-2 ring-blue-600 scale-105 z-10 shadow-sm' : 'hover:scale-102'}`}
                        title={`${tooth.label}: ${tooth.status}`}
                      >
                        <span className="text-[11px] font-extrabold">{tooth.number}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lower Arch */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Lower Arch (Teeth #17 - #32)
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
                  {lowerTeeth.map((tooth) => {
                    const isSelected = selectedTooth?.number === tooth.number;
                    return (
                      <button
                        key={tooth.number}
                        onClick={() => setSelectedTooth(tooth)}
                        className={`h-11 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          getToothStatusColor(tooth.status)
                        } ${isSelected ? 'ring-2 ring-blue-600 scale-105 z-10 shadow-sm' : 'hover:scale-102'}`}
                        title={`${tooth.label}: ${tooth.status}`}
                      >
                        <span className="text-[11px] font-extrabold">{tooth.number}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Selected Tooth Detail Panel (4 cols) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
              {selectedTooth ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Tooth Inspector</span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                        {selectedTooth.label}
                      </h4>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize border ${getToothStatusColor(selectedTooth.status)}`}>
                      {selectedTooth.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-600 block mb-1">Clinical Notes</span>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                      {selectedTooth.notes}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-600 block mb-2">Update Condition:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {(['healthy', 'cleaned', 'treated', 'monitoring'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            markToothCondition(selectedTooth.id, s);
                            setSelectedTooth({ ...selectedTooth, status: s });
                          }}
                          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold capitalize border transition-all cursor-pointer ${
                            selectedTooth.status === s
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Click on any tooth to view diagnosis and notes.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Treatment History & Automated Communications Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Treatment History (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Past Visits & Clinical History</span>
            </h3>

            <div className="space-y-3">
              {pastAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {apt.date} &bull; Completed
                    </span>
                    <div className="text-sm font-bold text-slate-900">
                      {services.find((s) => s.id === apt.serviceId)?.name}
                    </div>
                    <p className="text-xs text-slate-600">
                      {apt.notes}
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold shrink-0">
                    Paid &bull; Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Emails Log for Patient (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Automated Email Notifications Sent</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {emailNotifications.length} emails
              </span>
            </div>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {emailNotifications.map((email) => (
                <div
                  key={email.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {email.subject}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{email.sentAt}</span>
                      <span>&bull;</span>
                      <span className="text-emerald-600 font-medium capitalize">{email.status}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setPreviewEmail(email);
                      setViewMode('emails');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 text-xs font-semibold border border-slate-200 hover:border-blue-200 shrink-0 cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
