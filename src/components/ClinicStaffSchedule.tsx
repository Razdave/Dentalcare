import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { LogOut, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { useDental } from '../context/DentalContext.tsx';
import { supabase } from '../Utility/supabase.js';
import { Appointment, AppointmentStatus } from '../types.ts';

interface AppointmentRow {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  service_id: string;
  dentist_id: string;
  appointment_date: string;
  time_slot: string;
  status: AppointmentStatus;
  notes: string | null;
  insurance_provider: string | null;
  created_at: string;
  reminders_sent: string[] | null;
}

const isStaff = (session: Session | null) =>
  session?.user.app_metadata?.role === 'staff';

const mapAppointment = (row: AppointmentRow): Appointment => ({
  id: row.id,
  patientName: row.patient_name,
  patientEmail: row.patient_email,
  patientPhone: row.patient_phone,
  serviceId: row.service_id,
  dentistId: row.dentist_id,
  date: row.appointment_date,
  timeSlot: row.time_slot,
  status: row.status,
  notes: row.notes ?? undefined,
  insuranceProvider: row.insurance_provider ?? undefined,
  createdAt: row.created_at,
  remindersSent: row.reminders_sent ?? []
});

export const ClinicStaffSchedule: React.FC = () => {
  const { dentists, services } = useDental();
  const [session, setSession] = useState<Session | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) setSession(nextSession);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) setErrorMessage(error.message);
      setSession(data.session);
      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadAppointments = useCallback(async () => {
    setIsLoadingAppointments(true);
    setErrorMessage('');

    const { data, error } = await supabase
      .from('appointments')
      .select('id, patient_name, patient_email, patient_phone, service_id, dentist_id, appointment_date, time_slot, status, notes, insurance_provider, created_at, reminders_sent')
      .order('appointment_date', { ascending: true })
      .order('time_slot', { ascending: true });

    if (error) {
      setErrorMessage(`Could not load appointments: ${error.message}`);
      setIsLoadingAppointments(false);
      return;
    }

    setAppointments((data as AppointmentRow[]).map(mapAppointment));
    setIsLoadingAppointments(false);
  }, []);

  useEffect(() => {
    if (isStaff(session)) {
      void loadAppointments();
    } else {
      setAppointments([]);
    }
  }, [session, loadAppointments]);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSigningIn(true);
    setErrorMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMessage(error.message);
      setIsSigningIn(false);
      return;
    }

    if (data.user.app_metadata?.role !== 'staff') {
      await supabase.auth.signOut();
      setErrorMessage('This account is not authorized for staff access.');
      setIsSigningIn(false);
      return;
    }

    setSession(data.session);
    setPassword('');
    setIsSigningIn(false);
  };

  const handleSignOut = async () => {
    setErrorMessage('');
    const { error } = await supabase.auth.signOut();
    if (error) setErrorMessage(`Could not sign out: ${error.message}`);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const query = searchQuery.trim().toLowerCase();
    return !query ||
      appointment.patientName.toLowerCase().includes(query) ||
      appointment.patientEmail.toLowerCase().includes(query) ||
      appointment.date.includes(query);
  });

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-slate-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {isCheckingSession ? (
          <p className="text-center text-sm text-slate-600">Checking staff session...</p>
        ) : !isStaff(session) ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Staff sign in</h1>
            <p className="text-sm text-slate-600 mt-2 mb-6">
              Sign in with a clinic account authorized to view appointments.
            </p>
            <form onSubmit={(event) => void handleSignIn(event)} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              {errorMessage && (
                <p role="alert" className="text-sm text-red-600">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {isSigningIn ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  Staff portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                  Clinic appointments
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Booking requests loaded securely from Supabase.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => void loadAppointments()}
                  disabled={isLoadingAppointments}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingAppointments ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={() => void handleSignOut()}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>

            {errorMessage && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <label className="relative block max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="search"
                  placeholder="Search patient, email or date..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Patient</th>
                    <th className="py-4 px-6">Treatment</th>
                    <th className="py-4 px-6">Dentist</th>
                    <th className="py-4 px-6">Date & time</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredAppointments.map((appointment) => {
                    const dentist = dentists.find((item) => item.id === appointment.dentistId);
                    const service = services.find((item) => item.id === appointment.serviceId);
                    return (
                      <tr key={appointment.id}>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-900">{appointment.patientName}</div>
                          <div className="text-xs text-slate-500">
                            {appointment.patientEmail} · {appointment.patientPhone}
                          </div>
                        </td>
                        <td className="py-4 px-6">{service?.name ?? appointment.serviceId}</td>
                        <td className="py-4 px-6">{dentist?.name ?? appointment.dentistId}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          {appointment.date} · {appointment.timeSlot}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            appointment.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : appointment.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : appointment.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {!isLoadingAppointments && filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-500">
                        No appointments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500">
              Showing {filteredAppointments.length} of {appointments.length} appointments
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
