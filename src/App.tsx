/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DentalProvider, useDental } from './context/DentalContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ReliableCareBanner } from './components/ReliableCareBanner.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { DoctorsSection } from './components/DoctorsSection.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { PatientDashboard } from './components/PatientDashboard.tsx';
import { EmailNotificationHub } from './components/EmailNotificationHub.tsx';
import { ClinicStaffSchedule } from './components/ClinicStaffSchedule.tsx';
import { ToastContainer } from './components/ToastContainer.tsx';
import { Footer } from './components/Footer.tsx';

const AppContent: React.FC = () => {
  const { viewMode } = useDental();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1">
        {viewMode === 'home' && (
          <>
            <HeroSection />
            <ReliableCareBanner />
            <ServicesSection />
            <DoctorsSection />
          </>
        )}

        {viewMode === 'services' && (
          <div className="pt-4">
            <ServicesSection />
          </div>
        )}

        {viewMode === 'doctors' && (
          <div className="pt-4">
            <DoctorsSection />
          </div>
        )}

        {viewMode === 'dashboard' && <PatientDashboard />}

        {viewMode === 'emails' && <EmailNotificationHub />}

        {viewMode === 'staff' && <ClinicStaffSchedule />}
      </main>

      <Footer />
      <BookingModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <DentalProvider>
      <AppContent />
    </DentalProvider>
  );
}
