import { Dentist, DentalService, ToothCondition, PatientProfile, Appointment, EmailNotification } from '../types.ts';

export const HERO_DENTIST_IMAGE = '/src/assets/images/dentist_hero_1791821128305.jpg';
export const CLINIC_TEAM_IMAGE = '/src/assets/images/clinic_team_1791821139966.jpg';

export const DENTISTS: Dentist[] = [
  {
    id: 'dr-sarah-jenkins',
    name: 'Dr. Sarah Jenkins, DDS',
    title: 'Lead Aesthetic & Restorative Dentist',
    specialty: 'Cosmetic & Aesthetic Dentistry',
    rating: 4.98,
    reviewsCount: 342,
    image: HERO_DENTIST_IMAGE,
    experienceYears: 12,
    bio: 'Specializing in minimally-invasive smile makeovers, porcelain veneers, and gentle preventive care with modern digital dentistry.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    education: 'Harvard School of Dental Medicine'
  },
  {
    id: 'dr-michael-chen',
    name: 'Dr. Michael Chen, DMD',
    title: 'Orthodontics & Clear Aligner Specialist',
    specialty: 'Orthodontics & Aligners',
    rating: 4.95,
    reviewsCount: 289,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    experienceYears: 10,
    bio: 'Dedicated to creating aligned, harmonious bites using cutting-edge 3D intraoral scans and discreet clear aligner technology.',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    education: 'UCSF School of Dentistry'
  },
  {
    id: 'dr-elena-rostova',
    name: 'Dr. Elena Rostova, DDS, MS',
    title: 'Periodontist & Implant Surgeon',
    specialty: 'Dental Implants & Periodontics',
    rating: 4.97,
    reviewsCount: 198,
    image: 'https://images.unsplash.com/photo-1594824813560-5a822080a7bb?auto=format&fit=crop&w=600&q=80',
    experienceYears: 14,
    bio: 'Expert in pain-free dental implants, bone grafting, and gentle periodontal rejuvenation using laser technology.',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    education: 'Columbia University College of Dental Medicine'
  },
  {
    id: 'dr-marcus-vance',
    name: 'Dr. Marcus Vance, DDS',
    title: 'Pediatric & Family Dentistry Director',
    specialty: 'Family & Preventive Dentistry',
    rating: 4.96,
    reviewsCount: 412,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    experienceYears: 9,
    bio: 'Believes in a compassionate, anxiety-free approach for children and adults alike, ensuring each visit is reassuring and positive.',
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    education: 'University of Michigan School of Dentistry'
  }
];

export const SERVICES: DentalService[] = [
  {
    id: 'checkup-cleaning',
    name: 'Comprehensive Dental Exam & Deep Cleaning',
    category: 'preventive',
    durationMinutes: 45,
    price: 150,
    description: 'Detailed intraoral exam, low-radiation digital x-rays, ultrasonic plaque removal, and fluoride polish.',
    iconName: 'Sparkles',
    popular: true
  },
  {
    id: 'teeth-whitening',
    name: 'Advanced Laser Teeth Whitening',
    category: 'cosmetic',
    durationMinutes: 60,
    price: 320,
    description: 'In-office clinical brightening achieving up to 8 shades whiter in a single hour with zero sensitivity.',
    iconName: 'Sun',
    popular: true
  },
  {
    id: 'clear-aligners',
    name: 'Discreet Clear Aligners & Ortho Scan',
    category: 'orthodontics',
    durationMinutes: 40,
    price: 250,
    description: 'Comprehensive 3D intraoral simulation, bite alignment assessment, and custom treatment plan.',
    iconName: 'Smile',
    popular: true
  },
  {
    id: 'dental-implants',
    name: 'Titanium Dental Implant Consultation',
    category: 'surgical',
    durationMinutes: 50,
    price: 200,
    description: '3D CBCT digital bone scan, precision surgical guide planning, and permanent tooth restoration plan.',
    iconName: 'Anchor'
  },
  {
    id: 'porcelain-veneers',
    name: 'Handcrafted Porcelain Veneers',
    category: 'cosmetic',
    durationMinutes: 75,
    price: 650,
    description: 'Custom ceramic shells designed to correct chips, gaps, and discoloration with natural translucency.',
    iconName: 'Gem'
  },
  {
    id: 'root-canal',
    name: 'Gentle Rotary Endodontic Therapy',
    category: 'restorative',
    durationMinutes: 90,
    price: 450,
    description: 'Pain-free microscopic root canal treatment to rescue infected teeth and preserve your natural smile.',
    iconName: 'ShieldAlert'
  },
  {
    id: 'pediatric-checkup',
    name: 'Gentle Kids Dental Checkup & Sealants',
    category: 'preventive',
    durationMinutes: 35,
    price: 120,
    description: 'Fun, fear-free dental experience for children with cavity-preventing sealant application.',
    iconName: 'HeartHandshake'
  },
  {
    id: 'emergency-pain',
    name: 'Emergency Dental Pain Relief',
    category: 'surgical',
    durationMinutes: 45,
    price: 180,
    description: 'Same-day urgent appointment for toothaches, chipped teeth, swelling, or trauma.',
    iconName: 'Zap',
    popular: true
  }
];

export const INITIAL_TEETH_DATA: ToothCondition[] = Array.from({ length: 32 }, (_, i) => {
  const number = i + 1;
  let status: ToothCondition['status'] = 'healthy';
  let notes = 'Healthy enamel, clean margin';

  if (number === 8 || number === 9) {
    status = 'cleaned';
    notes = 'Front incisor - polished and stain-free';
  } else if (number === 14 || number === 19) {
    status = 'treated';
    notes = 'Composite filling intact, excellent stability';
  } else if (number === 30) {
    status = 'monitoring';
    notes = 'Minor enamel wear, monitor at 6-month checkup';
  }

  return {
    id: number,
    number,
    label: `Tooth #${number}`,
    status,
    notes
  };
});

export const INITIAL_PATIENT: PatientProfile = {
  id: 'patient-sarah-101',
  name: 'Sarah Anderson',
  email: 'sarah.anderson@example.com',
  phone: '+1 (555) 382-9012',
  dob: '1994-08-22',
  insurance: 'Delta Dental Premier (ID: DLT-98214)',
  toothHealthScore: 92,
  teethConditionStatus: 'Your Teeth Are In Excellent Condition',
  lastVisitDate: '2026-08-14',
  emergencyContact: 'Mark Anderson (+1 555-382-9013)',
  allergies: ['Penicillin (Mild)']
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    patientName: 'Sarah Anderson',
    patientEmail: 'sarah.anderson@example.com',
    patientPhone: '+1 (555) 382-9012',
    serviceId: 'checkup-cleaning',
    dentistId: 'dr-sarah-jenkins',
    date: '2026-10-18',
    timeSlot: '10:00 AM',
    status: 'confirmed',
    notes: 'Regular 6-month checkup and routine polish.',
    insuranceProvider: 'Delta Dental Premier',
    createdAt: '2026-10-10T14:30:00Z',
    remindersSent: ['booking_confirmation']
  },
  {
    id: 'apt-102',
    patientName: 'David Kim',
    patientEmail: 'david.kim@example.com',
    patientPhone: '+1 (555) 721-8840',
    serviceId: 'teeth-whitening',
    dentistId: 'dr-sarah-jenkins',
    date: '2026-10-19',
    timeSlot: '02:30 PM',
    status: 'confirmed',
    notes: 'Laser whitening before wedding ceremony.',
    insuranceProvider: 'MetLife Dental',
    createdAt: '2026-10-11T09:15:00Z',
    remindersSent: ['booking_confirmation']
  },
  {
    id: 'apt-103',
    patientName: 'Emily Watson',
    patientEmail: 'emily.w@example.com',
    patientPhone: '+1 (555) 492-1209',
    serviceId: 'clear-aligners',
    dentistId: 'dr-michael-chen',
    date: '2026-10-20',
    timeSlot: '11:15 AM',
    status: 'confirmed',
    notes: 'Tray #14 check and mid-course 3D scan.',
    insuranceProvider: 'Cigna Dental',
    createdAt: '2026-10-11T16:45:00Z',
    remindersSent: ['booking_confirmation']
  },
  {
    id: 'apt-104',
    patientName: 'Sarah Anderson',
    patientEmail: 'sarah.anderson@example.com',
    patientPhone: '+1 (555) 382-9012',
    serviceId: 'teeth-whitening',
    dentistId: 'dr-sarah-jenkins',
    date: '2026-08-14',
    timeSlot: '03:00 PM',
    status: 'completed',
    notes: 'Completed in-office whitening session. Enamel shade improved to BL3.',
    insuranceProvider: 'Delta Dental Premier',
    createdAt: '2026-08-01T11:00:00Z',
    remindersSent: ['booking_confirmation', 'reminder_24h', 'post_care_followup']
  }
];

export const INITIAL_EMAIL_NOTIFICATIONS: EmailNotification[] = [
  {
    id: 'email-201',
    appointmentId: 'apt-101',
    patientEmail: 'sarah.anderson@example.com',
    patientName: 'Sarah Anderson',
    subject: 'Appointment Confirmed: Comprehensive Dental Exam at Oraluxe',
    type: 'booking_confirmation',
    sentAt: '2026-10-10 14:30',
    status: 'delivered',
    previewSnippet: 'Your appointment on Saturday, October 18, 2026 at 10:00 AM with Dr. Sarah Jenkins is confirmed.',
    dentistName: 'Dr. Sarah Jenkins, DDS',
    serviceName: 'Comprehensive Dental Exam & Deep Cleaning',
    appointmentDate: '2026-10-18',
    appointmentTime: '10:00 AM',
    bodyHtml: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #0F3876 0%, #1E56A0 100%); padding: 32px 28px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Oraluxe Dental Clinic</h1>
          <p style="margin: 6px 0 0; color: #BAE6FD; font-size: 14px;">Healthy Smiles, Confident Lives</p>
        </div>
        <div style="padding: 32px 28px;">
          <h2 style="font-size: 20px; color: #0f172a; margin-top: 0;">Appointment Confirmed!</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">Hello <strong>Sarah Anderson</strong>, your upcoming dental visit has been scheduled and confirmed in our clinical system.</p>
          
          <div style="background: #F0FDF4; border-left: 4px solid #22C55E; padding: 18px 20px; border-radius: 6px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Treatment:</strong></td>
                <td style="padding: 6px 0; color: #0f172a; text-align: right;">Comprehensive Dental Exam & Cleaning</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Dentist:</strong></td>
                <td style="padding: 6px 0; color: #0f172a; text-align: right;">Dr. Sarah Jenkins, DDS</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Date & Time:</strong></td>
                <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: 600;">Saturday, Oct 18, 2026 at 10:00 AM</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Location:</strong></td>
                <td style="padding: 6px 0; color: #0f172a; text-align: right;">Suite 400, 742 Evergreen Medical Plaza</td>
              </tr>
            </table>
          </div>

          <h3 style="font-size: 16px; color: #0f172a; margin-bottom: 8px;">Pre-Appointment Guidelines:</h3>
          <ul style="font-size: 14px; color: #475569; padding-left: 20px; line-height: 1.6;">
            <li>Please arrive 10 minutes prior to your scheduled time.</li>
            <li>Bring your dental insurance card and valid photo ID.</li>
            <li>Brush and floss thoroughly prior to your examination.</li>
          </ul>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 12px;">
            <p>Need to reschedule? Call our concierge team at (555) 019-2834 or manage it directly in your Patient Dashboard.</p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'email-202',
    appointmentId: 'apt-104',
    patientEmail: 'sarah.anderson@example.com',
    patientName: 'Sarah Anderson',
    subject: 'Post-Care Instructions & Whitening Maintenance | Oraluxe',
    type: 'post_care_followup',
    sentAt: '2026-08-14 17:00',
    status: 'delivered',
    previewSnippet: 'Thank you for visiting Oraluxe today! Here are your aftercare tips for maintaining your bright smile.',
    dentistName: 'Dr. Sarah Jenkins, DDS',
    serviceName: 'Advanced Laser Teeth Whitening',
    appointmentDate: '2026-08-14',
    appointmentTime: '03:00 PM',
    bodyHtml: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #0F3876 0%, #1E56A0 100%); padding: 32px 28px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 700;">Oraluxe Dental Care</h1>
          <p style="margin: 6px 0 0; color: #BAE6FD; font-size: 14px;">Your Post-Treatment Care Guide</p>
        </div>
        <div style="padding: 32px 28px;">
          <h2 style="font-size: 20px; color: #0f172a; margin-top: 0;">How is your smile feeling today?</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">Dear Sarah, thank you for completing your Laser Whitening treatment with Dr. Sarah Jenkins. To protect your enamel and maximize results, please follow these guidelines:</p>
          <div style="background: #F8FAFC; border-radius: 8px; padding: 18px 20px; margin: 20px 0;">
            <p style="margin: 6px 0; font-size: 14px; color: #334155;"><strong>White Diet (48 Hours):</strong> Avoid coffee, red wine, soy sauce, and dark berries.</p>
            <p style="margin: 6px 0; font-size: 14px; color: #334155;"><strong>Temperature:</strong> If mild sensitivity occurs, use the potassium nitrate gel provided.</p>
            <p style="margin: 6px 0; font-size: 14px; color: #334155;"><strong>Next Follow-up:</strong> Routine checkup recommended in 6 months.</p>
          </div>
        </div>
      </div>
    `
  }
];

export const TIME_SLOTS = [
  '08:30 AM',
  '09:15 AM',
  '10:00 AM',
  '10:45 AM',
  '11:30 AM',
  '01:15 PM',
  '02:00 PM',
  '02:45 PM',
  '03:30 PM',
  '04:15 PM',
  '05:00 PM'
];
