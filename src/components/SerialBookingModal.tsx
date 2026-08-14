import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  User, 
  Phone, 
  Mail, 
  Download, 
  Printer, 
  Sparkles, 
  AlertCircle,
  Video,
  Building,
  CheckCircle2,
  Info,
  ArrowRight,
  ArrowLeft,
  Wallet,
  Landmark,
  FileCheck
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Doctor, Appointment, AppointmentType, PaymentGateway } from '../types';

export const SerialBookingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  initialType?: AppointmentType;
}> = ({ isOpen, onClose, doctor, initialType = 'in-person' }) => {
  const { language, t, user, bookNewSerial, is2FAVerified, setIs2FAVerified, setActiveTab } = useHospital();

  const [step, setStep] = useState<number>(1); // 1: Patient Info, 2: Slot & Serial, 3: 2FA OTP, 4: Payment/Confirmation, 5: Confirmed
  const [consultType, setConsultType] = useState<AppointmentType>(initialType);
  const [patientName, setPatientName] = useState(user.name);
  const [patientPhone, setPatientPhone] = useState(user.phone);
  const [patientEmail, setPatientEmail] = useState(user.email);
  const [patientAge, setPatientAge] = useState(user.age || 32);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>(user.gender || 'Male');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  // 2FA state
  const [otpCode, setOtpCode] = useState(['5', '8', '2', '9', '4', '1']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [isOtpVerifiedLocal, setIsOtpVerifiedLocal] = useState(false);

  // Payment state for video consultation
  const [paymentMethod, setPaymentMethod] = useState<PaymentGateway>('bKash');
  const [walletPhone, setWalletPhone] = useState(user.phone);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (initialType) setConsultType(initialType);
  }, [initialType]);

  useEffect(() => {
    let timer: any;
    if (step === 3 && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  if (!isOpen || !doctor) return null;

  const currentSerialCalculated = doctor.totalSerialsToday + 1;
  const estimatedTimeCalculated = '06:' + (15 + (currentSerialCalculated * 5) % 45).toString().padStart(2, '0') + ' PM';

  const handleNextFromPatientInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) return;
    setStep(2);
  };

  const handleNextFromSlot = () => {
    if (is2FAVerified || isOtpVerifiedLocal) {
      setStep(4);
    } else {
      setStep(3); // Go to 2FA verification
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpVerifiedLocal(true);
    setIs2FAVerified(true);
    setStep(4);
  };

  const handleFinalBooking = async () => {
    setIsSubmitting(true);
    try {
      const isVideo = consultType === 'video';
      const result = await bookNewSerial({
        patientName,
        patientPhone,
        patientEmail,
        patientAge: Number(patientAge),
        patientGender,
        patientGenderBn: patientGender === 'Male' ? 'পুরুষ' : patientGender === 'Female' ? 'মহিলা' : 'অন্যান্য',
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorNameBn: doctor.nameBn,
        specialty: doctor.specialty,
        specialtyBn: doctor.specialtyBn,
        chamber: doctor.chamber,
        chamberBn: doctor.chamberBn,
        roomNo: doctor.roomNo,
        date: selectedDate,
        timeSlot: doctor.timeSlot,
        estimatedTime: estimatedTimeCalculated,
        type: consultType,
        paymentMethod: isVideo ? paymentMethod : 'Counter',
        amount: doctor.consultationFee,
        notes,
      });

      setConfirmedAppointment(result);
      setStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative my-8 animate-in fade-in zoom-in-95 duration-200 text-slate-900">
        
        {/* Header with Step indicator */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 font-bold text-sm">
              {step < 5 ? `0${step}` : <Check className="w-4 h-4 text-emerald-600" />}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                {step === 1 && (language === 'bn' ? 'রোগীর তথ্য প্রদান' : 'Patient Information')}
                {step === 2 && (language === 'bn' ? 'তারিখ ও সিরিয়াল স্লট' : 'Date & Serial Slot')}
                {step === 3 && t.twoFactorTitle}
                {step === 4 && (consultType === 'in-person' 
                  ? (language === 'bn' ? 'চেম্বার বুকিং নিশ্চিতকরণ' : 'Confirm Chamber Booking') 
                  : (language === 'bn' ? 'অনলাইন পেমেন্ট গেটওয়ে' : 'Online Payment Gateway'))}
                {step === 5 && (language === 'bn' ? 'ডিজিটাল টোকেন কনফার্মেশন' : 'Digital Token Confirmation')}
              </h3>
              <p className="text-xs text-sky-700 font-semibold">
                {language === 'bn' ? doctor.nameBn : doctor.name} • {doctor.roomNo}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div 
            className="bg-sky-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: PATIENT DETAILS */}
          {step === 1 && (
            <form onSubmit={handleNextFromPatientInfo} className="space-y-4">
              {/* Consultation Type Selector */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-800 font-bold">
                  {language === 'bn' ? 'পরামর্শের ধরন নির্বাচন করুন:' : 'Select Consultation Mode:'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultType('in-person')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      consultType === 'in-person' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5 text-sky-400" />
                    <span>{t.inChamberConsult}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-700 text-white rounded font-normal ml-0.5">
                      {language === 'bn' ? 'পেমেন্ট পরে' : 'Pay at Counter'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultType('video')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      consultType === 'video' 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 text-inherit" />
                    <span>{t.telemedicineConsult}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-sky-700 text-white rounded font-normal ml-0.5">
                      {language === 'bn' ? 'অনলাইন পে' : 'Online Pay'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.patientFullName} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-sky-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.phoneNumber} (SMS Alert) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={e => setPatientPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-mono shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.emailAddress}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={e => setPatientEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-sky-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.patientAge}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={patientAge}
                      onChange={e => setPatientAge(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-sky-500 text-center font-mono shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.patientGender}
                    </label>
                    <select
                      value={patientGender}
                      onChange={e => setPatientGender(e.target.value as any)}
                      className="w-full px-2 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-sky-500 shadow-xs"
                    >
                      <option value="Male">{t.male}</option>
                      <option value="Female">{t.female}</option>
                      <option value="Other">{t.other}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.enterSymptoms}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: ৩ দিন ধরে বুকে চিনচিন ব্যথা এবং রক্তচাপ বৃদ্ধি...' : 'e.g. Mild chest pain, routine checkup and BP review...'}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-xs"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>{language === 'bn' ? 'পরবর্তী: সিরিয়াল স্লট ও শিডিউল' : 'Next: Serial Slot & Schedule'}</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: DATE & SERIAL ALLOCATION */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.appointmentDate}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-600" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-mono shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'bn' ? 'চেম্বার ও শিডিউল' : 'Chamber & Schedule'}
                  </label>
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 flex items-center justify-between">
                    <span className="truncate">{doctor.timeSlot}</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono font-bold text-[11px]">
                      {doctor.roomNo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-Time Live Serial Allocation Calculator Card */}
              <div className="p-5 rounded-2xl bg-sky-50/60 border-2 border-sky-300 text-center relative overflow-hidden shadow-xs">
                <div className="flex items-center justify-center gap-1.5 text-xs text-sky-800 font-bold mb-1">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>{language === 'bn' ? 'লাইভ অ্যালকেটেড সিরিয়াল নম্বর' : 'Allocated Live Serial Slot'}</span>
                </div>

                <div className="font-extrabold text-4xl sm:text-5xl tracking-tight text-slate-900 my-2">
                  #{currentSerialCalculated}
                </div>

                <p className="text-xs text-slate-600">
                  {t.estimatedConsultTime}: <strong className="text-emerald-700 font-bold">{estimatedTimeCalculated}</strong>
                </p>

                <div className="mt-3 pt-3 border-t border-sky-200/80 flex items-center justify-around text-xs text-slate-600">
                  <span>{t.currentServing}: <strong className="text-sky-700 font-bold">#{doctor.currentSerialServing}</strong></span>
                  <span>{t.waitingPatients}: <strong className="text-slate-900 font-bold">{Math.max(0, currentSerialCalculated - doctor.currentSerialServing)} {language === 'bn' ? 'জন' : 'pts'}</strong></span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Back'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextFromSlot}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>{language === 'bn' ? 'নিরাপত্তা ভেরিফিকেশন (2FA)' : 'Proceed to Security 2FA'}</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: 2-FACTOR AUTHENTICATION (2FA OTP) */}
          {step === 3 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900">{t.twoFactorTitle}</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  {t.twoFactorSubtitle} <strong className="text-slate-900 font-mono">{patientPhone}</strong>
                </p>
              </div>

              {/* OTP Simulation helper */}
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 inline-flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'সিকিউরিটি ডেমো ওটিপি কোড:' : 'Security Demo OTP Code:'}</span>
                <span className="font-mono font-bold tracking-widest text-sm bg-white px-2 py-0.5 rounded border border-emerald-300 text-slate-900">
                  582941
                </span>
              </div>

              {/* 6 Digit Input boxes */}
              <div className="flex justify-center gap-2 sm:gap-3 my-4">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newCode = [...otpCode];
                      newCode[idx] = e.target.value;
                      setOtpCode(newCode);
                    }}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center font-bold text-lg sm:text-xl bg-white border-2 border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 shadow-xs"
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <span>{t.otpExpiresIn}: <strong className="text-slate-800 font-mono">{otpTimer} {t.seconds}</strong></span>
                {otpTimer === 0 && (
                  <button
                    type="button"
                    onClick={() => setOtpTimer(60)}
                    className="text-sky-600 font-bold hover:underline ml-2 cursor-pointer"
                  >
                    {t.resendOtp}
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Back'}</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>{t.verifyAndConfirm}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: PAYMENT / CONFIRMATION (CONDITIONAL: IN-PERSON vs VIDEO) */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Conditional Display for In-Person Consultations (NO ONLINE PAYMENT REQUIRED) */}
              {consultType === 'in-person' ? (
                <div className="space-y-4">
                  {/* Notice Banner: No Online Payment Required */}
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-emerald-950 text-sm">
                          {language === 'bn' ? 'সরাসরি চেম্বার ভিজিট: অনলাইন পেমেন্ট লাগবে না' : 'In-Person Chamber Visit: No Online Payment Required'}
                        </h4>
                        <span className="px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {language === 'bn' ? 'ফ্রি স্লট বুকিং' : 'Pay at Chamber'}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                        {language === 'bn' 
                          ? 'সরাসরি চেম্বারে ডাক্তার দেখানোর জন্য কোনো অগ্রিম অনলাইন পেমেন্টের প্রয়োজন নেই। আপনার সিরিয়াল স্লটটি সরাসরি নিশ্চিত করা হচ্ছে। পরামর্শ ফি চেম্বারে ভিজিটের সময় রিসেপশনে প্রদান করবেন।' 
                          : 'No advance online payment is required for in-person chamber consultations. Your serial slot will be reserved immediately. Pay the consultation fee at the chamber reception upon your arrival.'}
                      </p>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[11px] text-slate-500 font-medium">{language === 'bn' ? 'নির্বাচিত ডাক্তার' : 'Doctor'}</span>
                        <h5 className="font-extrabold text-slate-900 text-sm">
                          {language === 'bn' ? doctor.nameBn : doctor.name}
                        </h5>
                        <p className="text-xs text-sky-700 font-semibold">{doctor.specialty}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 font-medium">{language === 'bn' ? 'চেম্বার ও রুম' : 'Chamber & Room'}</span>
                        <div className="text-xs font-bold text-slate-900">{doctor.roomNo}</div>
                        <div className="text-[11px] text-slate-500">{doctor.chamber}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-500 block">{language === 'bn' ? 'সিরিয়াল নম্বর' : 'Serial No'}</span>
                        <span className="font-extrabold text-lg text-sky-700">#{currentSerialCalculated}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-500 block">{language === 'bn' ? 'তারিখ' : 'Date'}</span>
                        <span className="font-bold text-slate-800 text-xs">{selectedDate}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-500 block">{language === 'bn' ? 'পরামর্শ ফি' : 'Consultation Fee'}</span>
                        <span className="font-extrabold text-sm text-slate-900">{t.bdt} {doctor.consultationFee}</span>
                        <span className="text-[9px] block text-emerald-700 font-semibold">({language === 'bn' ? 'কাউন্টারে প্রদেয়' : 'At counter'})</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Display for Video Consultations (ONLINE PAYMENT REQUIRED) */
                <div className="space-y-4">
                  {/* Notice Banner: Online Payment Required for Video */}
                  <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-300 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sky-950 text-sm">
                          {language === 'bn' ? 'অনলাইন ভিডিও কনসাল্টেশন: ডিজিটাল পেমেন্ট প্রয়োজন' : 'Video Consultation: Digital Payment Required'}
                        </h4>
                        <span className="px-2 py-0.5 bg-sky-700 text-white text-[10px] font-bold rounded-full">
                          {t.bdt} {doctor.consultationFee}
                        </span>
                      </div>
                      <p className="text-xs text-sky-800 mt-1 leading-relaxed">
                        {language === 'bn' 
                          ? 'অনলাইন ভিডিও কনসালটেন্সির তাৎক্ষণিক এইচডি ভিডিও কল লিংক ও ডিজিটাল প্রেসক্রিপশন সক্রিয় করতে নিচে বিকাশ, নগদ বা কার্ডের মাধ্যমে ফি পরিশোধ করুন।' 
                          : 'To activate your live HD video consultation room and digital Rx, please complete the consultation payment via bKash, Nagad, or Card.'}
                      </p>
                    </div>
                  </div>

                  {/* Payment Methods Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-800">
                      {language === 'bn' ? 'পেমেন্ট গেটওয়ে নির্বাচন করুন:' : 'Select Payment Gateway:'}
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'bKash', label: 'বিকাশ (bKash)', bg: 'hover:border-pink-500', active: 'border-pink-600 bg-pink-50 text-pink-700 font-bold' },
                        { id: 'Nagad', label: 'নগদ (Nagad)', bg: 'hover:border-orange-500', active: 'border-orange-600 bg-orange-50 text-orange-700 font-bold' },
                        { id: 'Card', label: 'কার্ড (Visa/Master)', bg: 'hover:border-sky-500', active: 'border-sky-600 bg-sky-50 text-sky-700 font-bold' },
                        { id: 'Rocket', label: 'রকেট (Rocket)', bg: 'hover:border-purple-500', active: 'border-purple-600 bg-purple-50 text-purple-700 font-bold' },
                      ].map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`p-3 rounded-xl border text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            paymentMethod === m.id
                              ? `${m.active} shadow-xs`
                              : `border-slate-200 bg-white text-slate-700 ${m.bg}`
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-inherit" />
                          <span>{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wallet Account Input Simulation */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">
                        {paymentMethod} {language === 'bn' ? 'অ্যাকাউন্ট নম্বর:' : 'Account Number:'}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL Gateway
                      </span>
                    </div>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={walletPhone}
                        onChange={e => setWalletPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500 shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Back'}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalBooking}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all ${
                    consultType === 'in-person'
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <span>{language === 'bn' ? 'প্রসেসিং হচ্ছে...' : 'Processing...'}</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-sky-300" />
                      <span>
                        {consultType === 'in-person'
                          ? (language === 'bn' ? 'বুকিং নিশ্চিত করুন ও টোকেন নিন' : 'Confirm Booking & Get Token')
                          : (language === 'bn' ? `৳${doctor.consultationFee} অনলাইন পেমেন্ট ও বুকিং কনফার্ম` : `Pay ৳${doctor.consultationFee} & Confirm Video Slot`)}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL TOKEN CONFIRMATION SLIP */}
          {step === 5 && confirmedAppointment && (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900">{t.bookingSuccess}</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {language === 'bn' 
                    ? 'আপনার মোবাইল ও হোয়াটসঅ্যাপে টোকেন স্লিপের নোটিফিকেশন পাঠানো হয়েছে।' 
                    : 'Digital token receipt has been dispatched to your SMS & WhatsApp.'}
                </p>
              </div>

              {/* Digital Token Slip */}
              <div id="printable-token-slip" className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 sm:p-6 text-left relative overflow-hidden shadow-xs">
                <div className="flex items-start justify-between border-b border-slate-200 pb-3 mb-3">
                  <div>
                    <div className="text-[10px] font-bold text-sky-700 uppercase tracking-widest">
                      AuraCare Super Specialty Hospital
                    </div>
                    <h5 className="font-extrabold text-base text-slate-900">
                      {language === 'bn' ? confirmedAppointment.doctorNameBn : confirmedAppointment.doctorName}
                    </h5>
                    <p className="text-xs text-slate-600">{confirmedAppointment.chamber} • {confirmedAppointment.roomNo}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">{language === 'bn' ? 'টোকেন কোড' : 'Token Code'}</span>
                    <span className="text-base font-mono font-extrabold text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-sky-300 shadow-xs">
                      {confirmedAppointment.tokenCode}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs mb-3">
                  <div>
                    <span className="text-slate-500 text-[10px] block">{language === 'bn' ? 'সিরিয়াল নম্বর' : 'Serial No'}</span>
                    <span className="text-2xl font-extrabold text-slate-900">
                      #{confirmedAppointment.serialNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">{language === 'bn' ? 'তারিখ' : 'Date'}</span>
                    <span className="font-bold text-slate-800">{confirmedAppointment.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">{language === 'bn' ? 'সম্ভাব্য সময়' : 'Est. Time'}</span>
                    <span className="font-bold text-sky-700">{confirmedAppointment.estimatedTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">{language === 'bn' ? 'পেমেন্ট স্ট্যাটাস' : 'Payment Status'}</span>
                    {confirmedAppointment.type === 'in-person' ? (
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {language === 'bn' ? 'চেম্বারে প্রদেয়' : 'Pay at Chamber'}
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> {language === 'bn' ? 'পরিশোধিত (অনলাইন)' : 'Paid Online'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <span>রোগীর নাম: <strong className="text-slate-900">{confirmedAppointment.patientName}</strong></span>
                  <span>মোবাইল: <strong className="text-slate-900 font-mono">{confirmedAppointment.patientPhone}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs flex items-center gap-1.5 border border-slate-300 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-sky-600" />
                  <span>{t.printToken}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveTab('queue');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                >
                  {language === 'bn' ? 'লাইভ সিরিয়াল ট্র্যাকার দেখুন' : 'View Live Serial Tracker'} →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
