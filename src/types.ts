export type Language = 'bn' | 'en';

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface Doctor {
  id: string;
  name: string;
  nameBn: string;
  specialty: string;
  specialtyBn: string;
  degree: string;
  designation: string;
  designationBn: string;
  chamber: string;
  chamberBn: string;
  roomNo: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  avatarUrl: string;
  availableDays: string[];
  availableDaysBn: string[];
  timeSlot: string;
  timeSlotBn: string;
  currentSerialServing: number;
  totalSerialsToday: number;
  maxPatientsPerDay: number;
  experienceYears: number;
  bio: string;
  bioBn: string;
  telemedicineAvailable: boolean;
  departmentId: string;
}

export interface Department {
  id: string;
  name: string;
  nameBn: string;
  iconName: string;
  doctorCount: number;
  description: string;
  descriptionBn: string;
  bgGradient: string;
}

export type AppointmentType = 'in-person' | 'video';
export type AppointmentStatus = 'confirmed' | 'serving' | 'completed' | 'cancelled' | 'absent';
export type PaymentStatus = 'paid' | 'pending' | 'counter';
export type PaymentGateway = 'bKash' | 'Nagad' | 'Rocket' | 'Card' | 'Counter' | 'NetBanking';

export interface Appointment {
  id: string;
  tokenCode: string; // e.g. "AUR-7842"
  serialNumber: number; // e.g. 14
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientGenderBn?: string;
  doctorId: string;
  doctorName: string;
  doctorNameBn: string;
  specialty: string;
  specialtyBn: string;
  chamber: string;
  chamberBn: string;
  roomNo: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  estimatedTime: string;
  type: AppointmentType;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentGateway;
  transactionId?: string;
  amount: number;
  createdAt: string;
  notes?: string;
  prescriptionId?: string;
  backedUpToServer: boolean;
}

export interface VitalsRecord {
  bp: string; // e.g. "120/80 mmHg"
  pulse: string; // e.g. "76 bpm"
  sugar: string; // e.g. "5.8 mmol/L"
  spO2: string; // e.g. "99%"
  weight: string; // e.g. "68 kg"
  temp: string; // e.g. "98.4 °F"
  bmi: string; // e.g. "23.5"
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string; // "1+0+1"
  timing: string; // "খাবারের পরে / After meal"
  duration: string; // "৭ দিন / 7 days"
  instructions?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  recordType: 'prescription' | 'lab_report' | 'imaging' | 'discharge_summary';
  title: string;
  titleBn: string;
  doctorName: string;
  doctorNameBn: string;
  department: string;
  date: string;
  fileUrl?: string;
  summary: string;
  summaryBn: string;
  vitals?: VitalsRecord;
  diagnoses?: string[];
  medicines?: PrescriptionMedicine[];
  testResults?: Array<{
    name: string;
    value: string;
    unit: string;
    normalRange: string;
    status: 'normal' | 'abnormal' | 'critical';
  }>;
  adviceNotes?: string;
  followUpDate?: string;
}

export interface NotificationItem {
  id: string;
  type: 'SMS' | 'WHATSAPP' | 'EMAIL' | 'IN_APP';
  title: string;
  titleBn: string;
  message: string;
  messageBn: string;
  timestamp: string;
  read: boolean;
  relatedAppointmentId?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  channelStatus?: 'DELIVERED' | 'SENT';
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  is2FAEnabled: boolean;
  bloodGroup?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  emergencyContact?: string;
  allergies?: string[];
  address?: string;
}

export interface VideoConsultationState {
  isActive: boolean;
  appointment?: Appointment;
  doctor?: Doctor;
  isDoctorView: boolean;
  isMicMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  callDurationSeconds: number;
  isPiP: boolean;
  chatMessages: Array<{
    id: string;
    sender: 'doctor' | 'patient';
    senderName: string;
    text: string;
    time: string;
  }>;
}

export interface HospitalStats {
  totalDoctors: number;
  todayPatientsServed: number;
  activeChambers: number;
  emergencyHotline: string;
  bedOccupancyRate: number;
  icuAvailable: number;
  telemedicineActive: number;
}
