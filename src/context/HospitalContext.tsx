import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  Doctor, 
  Department, 
  Appointment, 
  MedicalRecord, 
  NotificationItem, 
  UserProfile, 
  VideoConsultationState,
  HospitalStats,
  PaymentGateway
} from '../types';
import { 
  DOCTORS as initialDoctors, 
  DEPARTMENTS as initialDepartments, 
  INITIAL_APPOINTMENTS, 
  INITIAL_RECORDS, 
  INITIAL_USER, 
  INITIAL_HOSPITAL_STATS 
} from '../data/hospitalData';
import { TRANSLATIONS } from '../utils/translations';
import confetti from 'canvas-confetti';

interface HospitalContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS.bn;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  doctors: Doctor[];
  departments: Department[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  notifications: NotificationItem[];
  hospitalStats: HospitalStats;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDoctorForBooking: Doctor | null;
  setSelectedDoctorForBooking: (doc: Doctor | null) => void;
  bookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
  paymentModalOpen: boolean;
  setPaymentModalOpen: (open: boolean) => void;
  activeAppointmentForPayment: Appointment | null;
  setActiveAppointmentForPayment: (apt: Appointment | null) => void;
  twoFactorModalOpen: boolean;
  setTwoFactorModalOpen: (open: boolean) => void;
  is2FAVerified: boolean;
  setIs2FAVerified: (verified: boolean) => void;
  videoCall: VideoConsultationState;
  setVideoCall: React.Dispatch<React.SetStateAction<VideoConsultationState>>;
  isBackingUp: boolean;
  lastBackupTime: string;
  triggerServerBackup: () => Promise<void>;
  bookNewSerial: (data: Omit<Appointment, 'id' | 'tokenCode' | 'serialNumber' | 'createdAt' | 'backedUpToServer' | 'status' | 'paymentStatus'> & { paymentMethod?: PaymentGateway }) => Promise<Appointment>;
  confirmPayment: (appointmentId: string, method: PaymentGateway, trxId?: string) => Promise<void>;
  updateDoctorQueue: (doctorId: string, newServingSerial: number) => void;
  createPrescription: (record: Omit<MedicalRecord, 'id'>) => Promise<MedicalRecord>;
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  startVideoCall: (appointment: Appointment) => void;
  endVideoCall: () => void;
  markNotificationRead: (id?: string) => void;
  selectedDoctorForDashboard: Doctor;
  setSelectedDoctorForDashboard: (doc: Doctor) => void;
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('auracare_lang') as Language) || 'bn';
  });
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('auracare_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('auracare_doctors');
    return saved ? JSON.parse(saved) : initialDoctors;
  });
  const [departments] = useState<Department[]>(initialDepartments);
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('auracare_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem('auracare_records');
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('auracare_notifications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'notif-init-1',
        type: 'SMS',
        title: 'Serial Confirmed',
        titleBn: 'সিরিয়াল নিশ্চিতকরণ',
        message: 'Your Serial #9 with Prof. Dr. Mahmudul Hasan is confirmed for Today 05:00 PM.',
        messageBn: 'অধ্যাপক ডাঃ মাহমুদুল হাসানের সাথে আপনার সিরিয়াল #০৯ আজ বিকাল ৫:০০ টায় নিশ্চিত হয়েছে।',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        recipientPhone: '+880 1712-345678',
        channelStatus: 'DELIVERED',
      },
      {
        id: 'notif-init-2',
        type: 'WHATSAPP',
        title: '2FA Security Active',
        titleBn: 'টু-ফ্যাক্টর নিরাপত্তা সক্রিয়',
        message: 'AuraHealth 2-Factor Authentication is active for your account to protect medical records.',
        messageBn: 'আপনার মেডিকেল রেকর্ড ও তথ্যের সর্বোচ্চ সুরক্ষায় ২-ফ্যাক্টর অথেন্টিকেশন চালু রয়েছে।',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        recipientPhone: '+880 1712-345678',
        channelStatus: 'DELIVERED',
      },
    ];
  });

  const [hospitalStats] = useState<HospitalStats>(INITIAL_HOSPITAL_STATS);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [activeAppointmentForPayment, setActiveAppointmentForPayment] = useState<Appointment | null>(null);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState<boolean>(false);
  const [is2FAVerified, setIs2FAVerified] = useState<boolean>(false);
  const [selectedDoctorForDashboard, setSelectedDoctorForDashboard] = useState<Doctor>(doctors[0]);
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [lastBackupTime, setLastBackupTime] = useState<string>(() => new Date().toLocaleTimeString());
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const [videoCall, setVideoCall] = useState<VideoConsultationState>({
    isActive: false,
    isDoctorView: false,
    isMicMuted: false,
    isCameraOff: false,
    isScreenSharing: false,
    callDurationSeconds: 0,
    isPiP: false,
    chatMessages: [
      {
        id: 'msg-1',
        sender: 'doctor',
        senderName: 'Prof. Dr. Mahmudul Hasan',
        text: 'আসসালামু আলাইকুম। আপনি কি আমার কথা পরিষ্কার শুনতে পাচ্ছেন?',
        time: 'Just now',
      }
    ],
  });

  const t = TRANSLATIONS[language];

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('auracare_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('auracare_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('auracare_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('auracare_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('auracare_records', JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem('auracare_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Video call timer
  useEffect(() => {
    let interval: any;
    if (videoCall.isActive) {
      interval = setInterval(() => {
        setVideoCall(prev => ({ ...prev, callDurationSeconds: prev.callDurationSeconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [videoCall.isActive]);

  // Automated Server Backup function
  const triggerServerBackup = async () => {
    setIsBackingUp(true);
    try {
      const payload = {
        appointments,
        records: medicalRecords,
        user,
        doctors,
        timestamp: new Date().toISOString(),
      };

      const res = await fetch('/api/backup/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        setLastBackupTime(new Date().toLocaleTimeString());
        showToast(
          language === 'bn' 
            ? 'সার্ভারে সফলভাবে অটোমেটিক ব্যাকআপ সম্পন্ন হয়েছে!' 
            : 'All patient data securely backed up to hospital server!',
          'success'
        );
      }
    } catch (err) {
      console.warn('Backup error, saved to offline state:', err);
      setLastBackupTime(new Date().toLocaleTimeString());
    } finally {
      setIsBackingUp(false);
    }
  };

  // Book new serial
  const bookNewSerial = async (data: Omit<Appointment, 'id' | 'tokenCode' | 'serialNumber' | 'createdAt' | 'backedUpToServer' | 'status' | 'paymentStatus'> & { paymentMethod?: PaymentGateway }) => {
    const doctor = doctors.find(d => d.id === data.doctorId) || doctors[0];
    const newSerialNo = doctor.totalSerialsToday + 1;
    const tokenCode = 'AUR-' + Math.floor(1000 + Math.random() * 9000);
    const appointmentId = 'apt-' + Date.now();

    const isInPerson = data.type === 'in-person';
    const newAppointment: Appointment = {
      ...data,
      id: appointmentId,
      tokenCode,
      serialNumber: newSerialNo,
      status: 'confirmed',
      paymentStatus: isInPerson ? 'counter' : (data.paymentMethod && data.paymentMethod !== 'Counter' ? 'paid' : 'paid'),
      paymentMethod: isInPerson ? 'Counter' : (data.paymentMethod || 'bKash'),
      transactionId: isInPerson ? undefined : ('TRX' + Math.random().toString(36).substring(2, 9).toUpperCase()),
      createdAt: new Date().toISOString(),
      backedUpToServer: true,
    };

    // Update doctor total serials
    setDoctors(prev => prev.map(d => d.id === data.doctorId ? { ...d, totalSerialsToday: d.totalSerialsToday + 1 } : d));
    setAppointments(prev => [newAppointment, ...prev]);

    // Trigger celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c5a880', '#10b981', '#3b82f6', '#f59e0b']
      });
    } catch (e) {}

    // Trigger Automated Notification Dispatcher (SMS, WhatsApp, Email)
    const notifMessageBn = `অভিনন্দন ${data.patientName}! ${data.doctorNameBn} এর সাথে আপনার সিরিয়াল #${newSerialNo} (টোকেন: ${tokenCode}) নিশ্চিত হয়েছে। সময়: ${data.estimatedTime}, তারিখ: ${data.date}।`;
    const notifMessageEn = `Congratulations ${data.patientName}! Your Serial #${newSerialNo} (Token: ${tokenCode}) with ${data.doctorName} is confirmed for ${data.date} at ${data.estimatedTime}.`;

    const newNotifSms: NotificationItem = {
      id: 'notif-' + Date.now(),
      type: 'SMS',
      title: 'Doctor Serial Confirmed',
      titleBn: 'সিরিয়াল বুকিং নিশ্চিতকরণ',
      message: notifMessageEn,
      messageBn: notifMessageBn,
      timestamp: new Date().toISOString(),
      read: false,
      relatedAppointmentId: appointmentId,
      recipientPhone: data.patientPhone,
      recipientEmail: data.patientEmail,
      channelStatus: 'DELIVERED',
    };

    const newNotifWa: NotificationItem = {
      id: 'notif-wa-' + Date.now(),
      type: 'WHATSAPP',
      title: 'WhatsApp Token Slip Ready',
      titleBn: 'হোয়াটসঅ্যাপে টোকেন স্লিপ পাঠানো হয়েছে',
      message: `Digital Token Slip: Token ${tokenCode}, Serial #${newSerialNo}, Chamber: ${data.chamber}. Show this at the hospital reception.`,
      messageBn: `ডিজিটাল টোকেন স্লিপ: টোকেন ${tokenCode}, সিরিয়াল #${newSerialNo}, চেম্বার: ${data.chamberBn}। কাউন্টারে বা চেম্বারে এটি প্রদর্শন করুন।`,
      timestamp: new Date().toISOString(),
      read: false,
      relatedAppointmentId: appointmentId,
      recipientPhone: data.patientPhone,
      channelStatus: 'DELIVERED',
    };

    setNotifications(prev => [newNotifSms, newNotifWa, ...prev]);

    // Dispatch to server notification logger
    try {
      fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: data.patientPhone,
          recipientEmail: data.patientEmail,
          patientName: data.patientName,
          type: 'SMS',
          message: notifMessageBn,
          serialNumber: newSerialNo,
          doctorName: data.doctorName,
          time: data.estimatedTime,
        }),
      }).catch(() => {});
    } catch (e) {}

    // Auto backup snapshot
    triggerServerBackup();

    showToast(
      language === 'bn' 
        ? `সিরিয়াল #${newSerialNo} সফলভাবে বুক হয়েছে! এসএমএস ও হোয়াটসঅ্যাপ পাঠানো হয়েছে।` 
        : `Serial #${newSerialNo} successfully confirmed! SMS & WhatsApp dispatched.`,
      'success'
    );

    return newAppointment;
  };

  // Confirm online payment
  const confirmPayment = async (appointmentId: string, method: PaymentGateway, trxId?: string) => {
    const generatedTrx = trxId || 'TRX' + Math.random().toString(36).substring(2, 9).toUpperCase();
    setAppointments(prev => prev.map(a => {
      if (a.id === appointmentId) {
        return {
          ...a,
          paymentStatus: 'paid',
          paymentMethod: method,
          transactionId: generatedTrx,
        };
      }
      return a;
    }));

    const apt = appointments.find(a => a.id === appointmentId);
    if (apt) {
      const notif: NotificationItem = {
        id: 'notif-pay-' + Date.now(),
        type: 'EMAIL',
        title: 'Payment Invoice & Receipt',
        titleBn: 'পেমেন্ট ইনভয়েস ও মানি রিসিট',
        message: `Payment of BDT ${apt.amount} received via ${method} (TrxID: ${generatedTrx}) for Serial #${apt.serialNumber}.`,
        messageBn: `সিরিয়াল #${apt.serialNumber} এর জন্য ${method} এর মাধ্যমে ৳${apt.amount} পেমেন্ট সম্পন্ন হয়েছে (TrxID: ${generatedTrx})।`,
        timestamp: new Date().toISOString(),
        read: false,
        relatedAppointmentId: appointmentId,
        channelStatus: 'DELIVERED',
      };
      setNotifications(prev => [notif, ...prev]);
    }

    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}

    showToast(
      language === 'bn' ? 'পেমেন্ট সফল হয়েছে এবং ডিজিটাল মানি রিসিট তৈরি হয়েছে!' : 'Payment received & digital receipt issued!',
      'success'
    );

    triggerServerBackup();
  };

  // Doctor chamber queue update
  const updateDoctorQueue = (doctorId: string, newServingSerial: number) => {
    setDoctors(prev => prev.map(d => {
      if (d.id === doctorId) {
        return { ...d, currentSerialServing: newServingSerial };
      }
      return d;
    }));

    // Update appointment status for matching doctor and serial
    setAppointments(prev => prev.map(a => {
      if (a.doctorId === doctorId) {
        if (a.serialNumber === newServingSerial) {
          return { ...a, status: 'serving' };
        } else if (a.serialNumber < newServingSerial && a.status === 'serving') {
          return { ...a, status: 'completed' };
        }
      }
      return a;
    }));

    // Check if next patient needs auto notification
    const nextPatient = appointments.find(a => a.doctorId === doctorId && a.serialNumber === newServingSerial + 2);
    if (nextPatient) {
      const reminderNotif: NotificationItem = {
        id: 'notif-remind-' + Date.now(),
        type: 'SMS',
        title: 'Approaching Serial Alert',
        titleBn: 'সিরিয়াল এগিয়ে আসার সতর্কতা',
        message: `Alert: Current running Serial is #${newServingSerial}. Your Serial #${nextPatient.serialNumber} is next in 10-15 mins! Please wait near chamber.`,
        messageBn: `সতর্কতা: বর্তমান রানিং সিরিয়াল #${newServingSerial}। আপনার সিরিয়াল #${nextPatient.serialNumber} আর ১০-১৫ মিনিটের মধ্যে ডাক পড়বে। চেম্বারের কাছে উপস্থিত থাকুন।`,
        timestamp: new Date().toISOString(),
        read: false,
        relatedAppointmentId: nextPatient.id,
        recipientPhone: nextPatient.patientPhone,
        channelStatus: 'DELIVERED',
      };
      setNotifications(prev => [reminderNotif, ...prev]);
    }

    showToast(
      language === 'bn' ? `রানিং সিরিয়াল আপডেট: এখন চেম্বারে সিরিয়াল #${newServingSerial}` : `Queue Updated: Now serving Serial #${newServingSerial}`,
      'info'
    );
  };

  // Save digital prescription
  const createPrescription = async (record: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> => {
    const newId = 'rec-' + Date.now();
    const fullRecord: MedicalRecord = {
      ...record,
      id: newId,
    };
    setMedicalRecords(prev => [fullRecord, ...prev]);

    const notif: NotificationItem = {
      id: 'notif-rx-' + Date.now(),
      type: 'WHATSAPP',
      title: 'Digital Prescription Uploaded',
      titleBn: 'ডিজিটাল প্রেসক্রিপশন সংরক্ষিত হয়েছে',
      message: `Dr. ${record.doctorName} has issued your verified digital prescription. You can view & download it from your Medical Vault.`,
      messageBn: `${record.doctorNameBn} আপনার ডিজিটাল প্রেসক্রিপশন প্রদান করেছেন। আপনার মেডিকেল ভল্ট থেকে এটি ডাউনলোড করতে পারবেন।`,
      timestamp: new Date().toISOString(),
      read: false,
      channelStatus: 'DELIVERED',
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(
      language === 'bn' ? 'প্রেসক্রিপশন সফলভাবে মেডিকেল ভল্টে সেভ হয়েছে এবং রোগীকে পাঠানো হয়েছে!' : 'Prescription saved to vault and sent to patient!',
      'success'
    );

    triggerServerBackup();
    return fullRecord;
  };

  const addMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRec: MedicalRecord = {
      ...record,
      id: 'rec-' + Date.now(),
    };
    setMedicalRecords(prev => [newRec, ...prev]);
    showToast(language === 'bn' ? 'মেডিকেল রেকর্ড সংরক্ষিত হয়েছে' : 'Medical record saved to vault', 'success');
    triggerServerBackup();
  };

  // Video call controls
  const startVideoCall = (appointment: Appointment) => {
    const doctor = doctors.find(d => d.id === appointment.doctorId) || doctors[0];
    setVideoCall({
      isActive: true,
      appointment,
      doctor,
      isDoctorView: user.role === 'doctor',
      isMicMuted: false,
      isCameraOff: false,
      isScreenSharing: false,
      callDurationSeconds: 0,
      isPiP: false,
      chatMessages: [
        {
          id: 'msg-start-1',
          sender: 'doctor',
          senderName: doctor.name,
          text: language === 'bn' ? 'আসসালামু আলাইকুম। আমি আপনার সাথে লাইভে আছি। আপনার সমস্যা বলুন।' : 'Hello! I am connected with you. Please describe your symptoms.',
          time: 'Now',
        }
      ],
    });
    setActiveTab('telemedicine');
  };

  const endVideoCall = () => {
    setVideoCall(prev => ({ ...prev, isActive: false }));
    showToast(language === 'bn' ? 'ভিডিও কনসালটেশন সম্পন্ন হয়েছে' : 'Video consultation session ended', 'info');
  };

  const markNotificationRead = (id?: string) => {
    if (id) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } else {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  return (
    <HospitalContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        setUser,
        doctors,
        departments,
        appointments,
        medicalRecords,
        notifications,
        hospitalStats,
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
        twoFactorModalOpen,
        setTwoFactorModalOpen,
        is2FAVerified,
        setIs2FAVerified,
        videoCall,
        setVideoCall,
        isBackingUp,
        lastBackupTime,
        triggerServerBackup,
        bookNewSerial,
        confirmPayment,
        updateDoctorQueue,
        createPrescription,
        addMedicalRecord,
        startVideoCall,
        endVideoCall,
        markNotificationRead,
        selectedDoctorForDashboard,
        setSelectedDoctorForDashboard,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
