import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DoctorBooking } from './components/DoctorBooking';
import { LiveSerialTracker } from './components/LiveSerialTracker';
import { MedicalRecordsVault } from './components/MedicalRecordsVault';
import { DoctorDashboard } from './components/DoctorDashboard';
import { VideoConsultation } from './components/VideoConsultation';
import { AiSymptomChecker } from './components/AiSymptomChecker';
import { SerialBookingModal } from './components/SerialBookingModal';
import { PaymentModal } from './components/PaymentModal';
import { TwoFactorAuthModal } from './components/TwoFactorAuthModal';
import { BackupManagerModal } from './components/BackupManagerModal';
import { Footer } from './components/Footer';
import { Doctor, Appointment, AppointmentType } from './types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Sparkles, 
  Calendar, 
  Clock, 
  ShieldCheck,
  Video,
  FileText
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    selectedDoctorForBooking, 
    setSelectedDoctorForBooking, 
    bookingModalOpen, 
    setBookingModalOpen,
    paymentModalOpen,
    setPaymentModalOpen,
    activeAppointmentForPayment,
    setActiveAppointmentForPayment,
    toastMessage,
    language,
    t
  } = useHospital();

  const [bookingConsultType, setBookingConsultType] = useState<AppointmentType>('in-person');
  const [twoFAModalOpen, setTwoFAModalOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [searchTokenFromHero, setSearchTokenFromHero] = useState('');

  const handleOpenBooking = (doctor: Doctor, type: AppointmentType = 'in-person') => {
    setSelectedDoctorForBooking(doctor);
    setBookingConsultType(type);
    setBookingModalOpen(true);
  };

  const handleSearchSerialFromHero = (token: string) => {
    setSearchTokenFromHero(token);
    setActiveTab('queue');
  };

  const handleOpenPayment = (apt: Appointment) => {
    setActiveAppointmentForPayment(apt);
    setPaymentModalOpen(true);
  };

  const handleBookFromAiTriage = (deptId: string) => {
    setActiveTab('home');
    setTimeout(() => {
      const el = document.getElementById('doctor-directory-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1B2430] flex flex-col selection:bg-[#C5A059]/20 selection:text-[#1B2430] font-sans antialiased">
      
      {/* Navigation Header */}
      <Navbar 
        onOpenBackupModal={() => setBackupModalOpen(true)}
        onOpen2FAModal={() => setTwoFAModalOpen(true)}
      />

      {/* Main Tab Views */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroBanner onSearchSerial={handleSearchSerialFromHero} />
            <DoctorBooking onSelectDoctor={handleOpenBooking} />
          </div>
        )}

        {activeTab === 'queue' && (
          <LiveSerialTracker 
            initialSearchToken={searchTokenFromHero} 
            onOpenPaymentModal={handleOpenPayment} 
          />
        )}

        {activeTab === 'records' && (
          <MedicalRecordsVault />
        )}

        {activeTab === 'doctor-dashboard' && (
          <DoctorDashboard />
        )}

        {activeTab === 'telemedicine' && (
          <VideoConsultation />
        )}

        {activeTab === 'ai-triage' && (
          <AiSymptomChecker onBookSpecialist={handleBookFromAiTriage} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md ${
            toastMessage.type === 'success' ? 'bg-[#1B4D3E] text-[#FDFCFB] border-[#1B4D3E]' :
            toastMessage.type === 'warning' ? 'bg-[#C5A059] text-[#1B2430] border-[#C5A059]' :
            'bg-[#1B2430] text-[#FDFCFB] border-[#1B2430]'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
            {toastMessage.type === 'warning' && <AlertCircle className="w-4 h-4 text-[#1B2430]" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-sky-300" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Serial Booking Modal (with 2FA & payment) */}
      <SerialBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        doctor={selectedDoctorForBooking}
        initialType={bookingConsultType}
      />

      {/* Online Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        appointment={activeAppointmentForPayment}
      />

      {/* 2FA Security Modal */}
      <TwoFactorAuthModal
        isOpen={twoFAModalOpen}
        onClose={() => setTwoFAModalOpen(false)}
      />

      {/* Server Backup Manager Modal */}
      <BackupManagerModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <MainAppContent />
    </HospitalProvider>
  );
}
