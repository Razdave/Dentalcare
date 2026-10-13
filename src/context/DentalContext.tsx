import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Appointment, 
  Dentist, 
  DentalService, 
  EmailNotification, 
  PatientProfile, 
  ToothCondition,
  EmailType 
} from '../types.ts';
import { 
  DENTISTS, 
  SERVICES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_EMAIL_NOTIFICATIONS, 
  INITIAL_PATIENT, 
  INITIAL_TEETH_DATA, 
  TIME_SLOTS 
} from '../data/mockData.ts';
import { playChime } from '../utils/audio.ts';
import { supabase } from '../Utility/supabase.js';

export type AppViewMode = 'home' | 'services' | 'doctors' | 'dashboard' | 'emails' | 'staff';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  description: string;
}

interface DentalContextType {
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  dentists: Dentist[];
  services: DentalService[];
  appointments: Appointment[];
  emailNotifications: EmailNotification[];
  patient: PatientProfile;
  teethConditions: ToothCondition[];
  isBookingOpen: boolean;
  selectedService: DentalService | null;
  selectedDentist: Dentist | null;
  toasts: ToastMessage[];
  unreadEmailCount: number;
  openBookingModal: (service?: DentalService, dentist?: Dentist) => void;
  closeBookingModal: () => void;
  bookAppointment: (data: {
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    serviceId: string;
    dentistId: string;
    date: string;
    timeSlot: string;
    notes?: string;
    insuranceProvider?: string;
  }) => Promise<Appointment>;
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => void;
  cancelAppointment: (appointmentId: string, reason?: string) => void;
  trigger24hReminder: (appointmentId: string) => void;
  triggerPostCareEmail: (appointmentId: string) => void;
  getAvailableSlots: (dentistId: string, date: string) => string[];
  markToothCondition: (toothId: number, status: ToothCondition['status'], notes?: string) => void;
  removeToast: (id: string) => void;
  previewEmail: EmailNotification | null;
  setPreviewEmail: (email: EmailNotification | null) => void;
}

const DentalContext = createContext<DentalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  APPOINTMENTS: 'oraluxe_appointments_v1',
  EMAILS: 'oraluxe_emails_v1',
  PATIENT: 'oraluxe_patient_v1',
  TEETH: 'oraluxe_teeth_v1'
};

export const DentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<AppViewMode>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<DentalService | null>(null);
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [previewEmail, setPreviewEmail] = useState<EmailNotification | null>(null);
  const [unreadEmailCount, setUnreadEmailCount] = useState(0);

  // Initialize or load from local storage
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMAILS);
      return saved ? JSON.parse(saved) : INITIAL_EMAIL_NOTIFICATIONS;
    } catch {
      return INITIAL_EMAIL_NOTIFICATIONS;
    }
  });

  const [patient, setPatient] = useState<PatientProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENT);
      return saved ? JSON.parse(saved) : INITIAL_PATIENT;
    } catch {
      return INITIAL_PATIENT;
    }
  });

  const [teethConditions, setTeethConditions] = useState<ToothCondition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEETH);
      return saved ? JSON.parse(saved) : INITIAL_TEETH_DATA;
    } catch {
      return INITIAL_TEETH_DATA;
    }
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(emailNotifications));
  }, [emailNotifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify(patient));
  }, [patient]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEETH, JSON.stringify(teethConditions));
  }, [teethConditions]);

  const addToast = (type: ToastMessage['type'], title: string, description: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openBookingModal = (service?: DentalService, dentist?: Dentist) => {
    setSelectedService(service || null);
    setSelectedDentist(dentist || null);
    setIsBookingOpen(true);
    playChime('pop');
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
  };

  const getAvailableSlots = (dentistId: string, date: string): string[] => {
    // Filter out slots already booked for that dentist on the given date
    const booked = appointments
      .filter((a) => a.dentistId === dentistId && a.date === date && a.status !== 'cancelled')
      .map((a) => a.timeSlot);

    return TIME_SLOTS.filter((slot) => !booked.includes(slot));
  };

  // Helper to construct realistic clinic email HTML
  const generateEmailHtml = (params: {
    type: EmailType;
    patientName: string;
    dentistName: string;
    serviceName: string;
    date: string;
    time: string;
    notes?: string;
  }): string => {
    const headerTitle =
      params.type === 'booking_confirmation'
        ? 'Appointment Confirmation'
        : params.type === 'reminder_24h'
        ? 'Reminder: Appointment Tomorrow'
        : params.type === 'reschedule_confirmation'
        ? 'Appointment Rescheduled'
        : 'Post-Care Smile Guidelines';

    const headerSub =
      params.type === 'booking_confirmation'
        ? 'Your visit is securely booked at Oraluxe Clinic'
        : params.type === 'reminder_24h'
        ? 'We are looking forward to seeing you tomorrow!'
        : 'Important care instructions from your dental team';

    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
        <div style="background: linear-gradient(135deg, #0F3876 0%, #164E9B 50%, #1E56A0 100%); padding: 36px 32px; text-align: center; color: #ffffff;">
          <div style="display: inline-block; background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 12px; letter-spacing: 0.5px;">
            🦷 ORALUXE DENTAL CARE
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">${headerTitle}</h1>
          <p style="margin: 8px 0 0; color: #BAE6FD; font-size: 14px;">${headerSub}</p>
        </div>

        <div style="padding: 32px 28px;">
          <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-top: 0;">
            Dear <strong>${params.patientName}</strong>,
          </p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6;">
            ${params.type === 'booking_confirmation' 
              ? 'Thank you for choosing Oraluxe. Your upcoming dental appointment has been recorded in our clinical schedule system with real-time verification.'
              : params.type === 'reminder_24h'
              ? 'This is a friendly automated reminder that your scheduled visit is coming up in 24 hours. Please review the details below:'
              : 'Here is your official appointment update from Oraluxe Dental Clinic:'}
          </p>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px 24px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 10px 0; color: #64748B; font-weight: 500;">Service</td>
                <td style="padding: 10px 0; color: #0F172A; text-align: right; font-weight: 600;">${params.serviceName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 10px 0; color: #64748B; font-weight: 500;">Attending Doctor</td>
                <td style="padding: 10px 0; color: #0F172A; text-align: right; font-weight: 600;">${params.dentistName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 10px 0; color: #64748B; font-weight: 500;">Date & Time</td>
                <td style="padding: 10px 0; color: #0284C7; text-align: right; font-weight: 700;">${params.date} at ${params.time}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748B; font-weight: 500;">Clinic Location</td>
                <td style="padding: 10px 0; color: #0F172A; text-align: right;">Oraluxe Suite 400, 742 Medical Way</td>
              </tr>
            </table>
          </div>

          <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 14px 18px; border-radius: 6px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 13px; color: #1E40AF; line-height: 1.5;">
              <strong>Patient Checklist:</strong> Complimentary valet parking is available on Level P1. Please bring your insurance ID. If you need special accommodations or have dental anxiety, let our front desk know on arrival.
            </p>
          </div>

          <div style="text-align: center; margin: 28px 0 10px;">
            <a href="#" style="display: inline-block; background: #0F3876; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px;">
              Manage in Patient Dashboard
            </a>
          </div>

          <div style="border-top: 1px solid #F1F5F9; margin-top: 32px; padding-top: 20px; font-size: 12px; color: #94A3B8; text-align: center; line-height: 1.5;">
            Oraluxe Modern Healthcare Clinic &bull; Certified Dental Excellence &bull; Emergency Tel: +1 (555) 019-2834<br/>
            This is an automated notification sent to ${params.patientName}.
          </div>
        </div>
      </div>
    `;
  };

  const bookAppointment = async (data: {
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    serviceId: string;
    dentistId: string;
    date: string;
    timeSlot: string;
    notes?: string;
    insuranceProvider?: string;
  }): Promise<Appointment> => {

    const newAppointment: Appointment = {
      id: `apt-${crypto.randomUUID()}`,
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      patientPhone: data.patientPhone,
      serviceId: data.serviceId,
      dentistId: data.dentistId,
      date: data.date,
      timeSlot: data.timeSlot,
      status: 'pending',
      notes: data.notes,
      insuranceProvider: data.insuranceProvider || 'Direct Clinical Billing',
      createdAt: new Date().toISOString(),
      remindersSent: []
    };

    const { error } = await supabase.from('appointments').insert({
      id: newAppointment.id,
      patient_name: newAppointment.patientName,
      patient_email: newAppointment.patientEmail,
      patient_phone: newAppointment.patientPhone,
      service_id: newAppointment.serviceId,
      dentist_id: newAppointment.dentistId,
      appointment_date: newAppointment.date,
      time_slot: newAppointment.timeSlot,
      status: newAppointment.status,
      notes: newAppointment.notes,
      insurance_provider: newAppointment.insuranceProvider,
      created_at: newAppointment.createdAt,
      reminders_sent: newAppointment.remindersSent
    });

    if (error) {
      if (error.code === '23505') {
        throw new Error('That time slot was just taken. Please choose another time.');
      }
      throw new Error(`Could not submit your booking request: ${error.message}`);
    }

    setAppointments((prev) => [newAppointment, ...prev]);

    // Audio chime & confetti
    playChime('success');
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Confetti fallback
    }

    addToast(
      'success',
      'Booking Request Submitted',
      `Your request for ${data.date} at ${data.timeSlot} was sent to the clinic. They will contact you to confirm.`
    );

    return newAppointment;
  };

  const rescheduleAppointment = (appointmentId: string, newDate: string, newTime: string) => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return;

    const dentist = DENTISTS.find((d) => d.id === apt.dentistId) || DENTISTS[0];
    const service = SERVICES.find((s) => s.id === apt.serviceId) || SERVICES[0];

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? {
              ...a,
              date: newDate,
              timeSlot: newTime,
              remindersSent: [...a.remindersSent, 'reschedule_confirmation']
            }
          : a
      )
    );

    const emailHtml = generateEmailHtml({
      type: 'reschedule_confirmation',
      patientName: apt.patientName,
      dentistName: dentist.name,
      serviceName: service.name,
      date: newDate,
      time: newTime
    });

    const newEmail: EmailNotification = {
      id: 'email-' + Date.now().toString(36),
      appointmentId,
      patientEmail: apt.patientEmail,
      patientName: apt.patientName,
      subject: `Rescheduled: ${service.name} moved to ${newDate} at ${newTime}`,
      type: 'reschedule_confirmation',
      sentAt: new Date().toLocaleString(),
      status: 'delivered',
      previewSnippet: `Your appointment has been successfully rescheduled to ${newDate} at ${newTime}.`,
      bodyHtml: emailHtml,
      dentistName: dentist.name,
      serviceName: service.name,
      appointmentDate: newDate,
      appointmentTime: newTime
    };

    setEmailNotifications((prev) => [newEmail, ...prev]);
    setUnreadEmailCount((prev) => prev + 1);
    playChime('success');
    addToast('info', 'Appointment Rescheduled', `Updated to ${newDate} at ${newTime}. Notification email delivered.`);
  };

  const cancelAppointment = (appointmentId: string, _reason?: string) => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return;

    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'cancelled' } : a))
    );

    addToast('warning', 'Appointment Cancelled', 'The slot has been released back into the real-time calendar.');
  };

  const trigger24hReminder = (appointmentId: string) => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return;

    const dentist = DENTISTS.find((d) => d.id === apt.dentistId) || DENTISTS[0];
    const service = SERVICES.find((s) => s.id === apt.serviceId) || SERVICES[0];

    const emailHtml = generateEmailHtml({
      type: 'reminder_24h',
      patientName: apt.patientName,
      dentistName: dentist.name,
      serviceName: service.name,
      date: apt.date,
      time: apt.timeSlot
    });

    const newEmail: EmailNotification = {
      id: 'email-' + Date.now().toString(36),
      appointmentId,
      patientEmail: apt.patientEmail,
      patientName: apt.patientName,
      subject: `Reminder: Dental Visit Tomorrow at ${apt.timeSlot} | Oraluxe`,
      type: 'reminder_24h',
      sentAt: new Date().toLocaleString(),
      status: 'delivered',
      previewSnippet: `Don't forget! Your appointment with ${dentist.name} is scheduled for tomorrow at ${apt.timeSlot}.`,
      bodyHtml: emailHtml,
      dentistName: dentist.name,
      serviceName: service.name,
      appointmentDate: apt.date,
      appointmentTime: apt.timeSlot
    };

    setEmailNotifications((prev) => [newEmail, ...prev]);
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? { ...a, remindersSent: [...new Set([...a.remindersSent, 'reminder_24h'])] }
          : a
      )
    );
    setUnreadEmailCount((prev) => prev + 1);
    playChime('pop');
    addToast('info', 'Automated 24h Reminder Dispatched', `Sent email reminder to ${apt.patientEmail}.`);
  };

  const triggerPostCareEmail = (appointmentId: string) => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return;

    const dentist = DENTISTS.find((d) => d.id === apt.dentistId) || DENTISTS[0];
    const service = SERVICES.find((s) => s.id === apt.serviceId) || SERVICES[0];

    const emailHtml = generateEmailHtml({
      type: 'post_care_followup',
      patientName: apt.patientName,
      dentistName: dentist.name,
      serviceName: service.name,
      date: apt.date,
      time: apt.timeSlot
    });

    const newEmail: EmailNotification = {
      id: 'email-' + Date.now().toString(36),
      appointmentId,
      patientEmail: apt.patientEmail,
      patientName: apt.patientName,
      subject: `Post-Care Smile Instructions: Following your ${service.name}`,
      type: 'post_care_followup',
      sentAt: new Date().toLocaleString(),
      status: 'delivered',
      previewSnippet: `Tips and guidance from ${dentist.name} to care for your teeth post-procedure.`,
      bodyHtml: emailHtml,
      dentistName: dentist.name,
      serviceName: service.name,
      appointmentDate: apt.date,
      appointmentTime: apt.timeSlot
    };

    setEmailNotifications((prev) => [newEmail, ...prev]);
    setUnreadEmailCount((prev) => prev + 1);
    playChime('pop');
    addToast('success', 'Post-Care Email Dispatched', `Care advice sent to ${apt.patientEmail}.`);
  };

  const markToothCondition = (toothId: number, status: ToothCondition['status'], notes?: string) => {
    setTeethConditions((prev) =>
      prev.map((t) => (t.id === toothId ? { ...t, status, notes: notes || t.notes } : t))
    );
    // Recalculate health score
    const healthyCount = teethConditions.filter((t) => t.id === toothId ? status !== 'monitoring' : t.status !== 'monitoring').length;
    const score = Math.round((healthyCount / 32) * 100);
    setPatient((p) => ({ ...p, toothHealthScore: score }));
  };

  return (
    <DentalContext.Provider
      value={{
        viewMode,
        setViewMode,
        dentists: DENTISTS,
        services: SERVICES,
        appointments,
        emailNotifications,
        patient,
        teethConditions,
        isBookingOpen,
        selectedService,
        selectedDentist,
        toasts,
        unreadEmailCount,
        openBookingModal,
        closeBookingModal,
        bookAppointment,
        rescheduleAppointment,
        cancelAppointment,
        trigger24hReminder,
        triggerPostCareEmail,
        getAvailableSlots,
        markToothCondition,
        removeToast,
        previewEmail,
        setPreviewEmail
      }}
    >
      {children}
    </DentalContext.Provider>
  );
};

export const useDental = () => {
  const context = useContext(DentalContext);
  if (!context) {
    throw new Error('useDental must be used within a DentalProvider');
  }
  return context;
};
