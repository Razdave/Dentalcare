export interface Dentist {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  image: string;
  experienceYears: number;
  bio: string;
  availableDays: string[];
  education: string;
}

export interface DentalService {
  id: string;
  name: string;
  category: 'preventive' | 'cosmetic' | 'restorative' | 'orthodontics' | 'surgical';
  durationMinutes: number;
  price: number;
  description: string;
  iconName: string;
  popular?: boolean;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  serviceId: string;
  dentistId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM"
  status: AppointmentStatus;
  notes?: string;
  insuranceProvider?: string;
  createdAt: string;
  remindersSent: string[];
}

export type EmailType = 
  | 'booking_confirmation'
  | 'reminder_24h'
  | 'post_care_followup'
  | 'reschedule_confirmation'
  | 'cancellation_notice';

export interface EmailNotification {
  id: string;
  appointmentId: string;
  patientEmail: string;
  patientName: string;
  subject: string;
  type: EmailType;
  sentAt: string;
  status: 'delivered' | 'sent';
  previewSnippet: string;
  bodyHtml: string;
  dentistName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
}

export interface ToothCondition {
  id: number;
  number: number;
  label: string;
  status: 'healthy' | 'treated' | 'monitoring' | 'cleaned';
  notes: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  insurance: string;
  toothHealthScore: number; // e.g. 92
  teethConditionStatus: string;
  lastVisitDate: string;
  emergencyContact: string;
  allergies: string[];
}
