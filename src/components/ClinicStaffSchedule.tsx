import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  User, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Plus, 
  ShieldCheck,
  Stethoscope,
  Phone,
  Mail,
  Search
} from 'lucide-react';
import { useDental } from '../context/DentalContext.tsx';
import { AppointmentStatus, Appointment } from '../types.ts';

export const ClinicStaffSchedule: React.FC = () => {
  const { appointments, dentists, services, openBookingModal, cancelAppointment, rescheduleAppointment } = useDental();
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesDoc = selectedDoctorFilter === 'all' || apt.dentistId === selectedDoctorFilter;
    const matchesSearch = 
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.date.includes(searchQuery);
    return matchesDoc && matchesSearch;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Confirmed</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 line-through">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Pending</span>;
    }
  };

  return (
    <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-slate-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Clinic Operations Portal
              </span>
              <span className="text-xs text-slate-500 font-medium">Real-Time Schedule Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Doctor Operatory & Chair Schedule
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Monitor active clinical bookings across all 4 dental chairs, prevent double-booking, and audit patient communication trails.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openBookingModal()}
              className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Manual Front-Desk Booking</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search patient, email or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter by Doctor:</span>
            <button
              onClick={() => setSelectedDoctorFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedDoctorFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Operatories
            </button>
            {dentists.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoctorFilter(doc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDoctorFilter === doc.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {doc.name.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Patient</th>
                  <th className="py-4 px-6">Treatment</th>
                  <th className="py-4 px-6">Attending Doctor</th>
                  <th className="py-4 px-6">Date & Slot</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredAppointments.map((apt) => {
                  const doc = dentists.find((d) => d.id === apt.dentistId);
                  const svc = services.find((s) => s.id === apt.serviceId);

                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{apt.patientName}</div>
                        <div className="text-[11px] text-slate-500">{apt.patientEmail} &bull; {apt.patientPhone}</div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">{svc?.name}</div>
                        <div className="text-[11px] text-blue-600">{svc?.durationMinutes} mins &bull; ${svc?.price}</div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <img
                            src={doc?.image}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-medium text-slate-900">{doc?.name}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{apt.date}</div>
                        <div className="text-blue-700 font-semibold">{apt.timeSlot}</div>
                      </td>

                      <td className="py-4 px-6">
                        {getStatusBadge(apt.status)}
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        {apt.status !== 'cancelled' && (
                          <button
                            onClick={() => cancelAppointment(apt.id)}
                            className="text-red-600 hover:text-red-800 font-semibold text-xs cursor-pointer"
                          >
                            Cancel Slot
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
