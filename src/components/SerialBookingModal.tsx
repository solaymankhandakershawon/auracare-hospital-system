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
  QrCode, 
  Sparkles, 
  AlertCircle,
  Video,
  Building,
  CheckCircle2
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

  const [step, setStep] = useState<number>(1); // 1: Patient Info, 2: Slot & Serial, 3: 2FA OTP, 4: Payment, 5: Confirmed
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
  const [otpEntered, setOtpEntered] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifiedLocal, setIsOtpVerifiedLocal] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentGateway>('bKash');
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
        paymentMethod: paymentMethod,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B2430]/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative my-8 animate-in fade-in zoom-in-95 duration-200 text-[#1B2430]">
        
        {/* Header with Step indicator */}
        <div className="px-6 py-4 bg-[#F9F7F2] border-b border-[#EDE8DF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F4EAD4] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6B28] font-serif font-bold text-sm">
              {step < 5 ? `0${step}` : <Check className="w-4 h-4 text-[#1B4D3E]" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#1B2430] text-base sm:text-lg">
                {step === 1 && t.step1PatientInfo}
                {step === 2 && t.step2SerialSelect}
                {step === 3 && t.twoFactorTitle}
                {step === 4 && t.step3Payment}
                {step === 5 && t.step4Confirmation}
              </h3>
              <p className="text-[11px] text-[#8C6B28] font-medium">
                {language === 'bn' ? doctor.nameBn : doctor.name} • {doctor.roomNo}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5E1D8] text-[#5C6573] hover:text-[#1B2430] hover:bg-[#F1EDE4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#EDE8DF] h-1">
          <div 
            className="bg-[#1B2430] h-1 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: PATIENT DETAILS */}
          {step === 1 && (
            <form onSubmit={handleNextFromPatientInfo} className="space-y-4">
              <div className="p-3 bg-[#F9F7F2] border border-[#E5E1D8] rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[#1B2430] font-medium">{language === 'bn' ? 'পরামর্শের ধরন নির্বাচন করুন:' : 'Select Consultation Mode:'}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultType('in-person')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      consultType === 'in-person' 
                        ? 'bg-[#1B2430] text-[#FDFCFB] shadow-xs' 
                        : 'bg-[#FFFFFF] border border-[#E5E1D8] text-[#5C6573] hover:text-[#1B2430]'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    {t.inChamberConsult}
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultType('video')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      consultType === 'video' 
                        ? 'bg-[#1B4D3E] text-[#FDFCFB] shadow-xs' 
                        : 'bg-[#FFFFFF] border border-[#E5E1D8] text-[#5C6573] hover:text-[#1B2430]'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    {t.telemedicineConsult}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                    {t.patientFullName} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6573]" />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs sm:text-sm text-[#1B2430] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                    {t.phoneNumber} (SMS Alert) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B4D3E]" />
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={e => setPatientPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs sm:text-sm text-[#1B2430] focus:outline-none focus:border-[#C5A059] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                    {t.emailAddress}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6573]" />
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={e => setPatientEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs sm:text-sm text-[#1B2430] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                      {t.patientAge}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={patientAge}
                      onChange={e => setPatientAge(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs sm:text-sm text-[#1B2430] focus:outline-none focus:border-[#C5A059] text-center font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                      {t.patientGender}
                    </label>
                    <select
                      value={patientGender}
                      onChange={e => setPatientGender(e.target.value as any)}
                      className="w-full px-2 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs sm:text-sm text-[#1B2430] focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="Male">{t.male}</option>
                      <option value="Female">{t.female}</option>
                      <option value="Other">{t.other}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                  {t.enterSymptoms}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: ৩ দিন ধরে বুকে চিনচিন ব্যথা এবং রক্তচাপ বৃদ্ধি...' : 'e.g. Mild chest pain, routine checkup and BP review...'}
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] placeholder-[#5C6573]/60 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE8DF]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#F9F7F2] text-[#5C6573] hover:bg-[#F1EDE4] text-xs font-semibold cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs shadow-xs cursor-pointer"
                >
                  {language === 'bn' ? 'পরবর্তী ধাপ (তারিখ ও সিরিয়াল)' : 'Next Step (Date & Slot)'} →
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SLOT & SERIAL CONFIRMATION */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                    {t.appointmentDate}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6B28]" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs sm:text-sm text-[#1B2430] focus:outline-none focus:border-[#C5A059] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                    {language === 'bn' ? 'চেম্বার শিডিউল' : 'Chamber Schedule'}
                  </label>
                  <div className="p-2.5 bg-[#F9F7F2] border border-[#E5E1D8] rounded-xl text-xs font-medium text-[#1B2430] flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[#1B4D3E]">
                      <Clock className="w-3.5 h-3.5" />
                      {language === 'bn' ? doctor.timeSlotBn : doctor.timeSlot}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E5E1D8] text-[#8C6B28] font-mono text-[11px] font-bold">
                      {doctor.roomNo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-Time Live Serial Allocation Calculator Card */}
              <div className="p-5 rounded-2xl bg-[#F9F7F2] border-2 border-[#C5A059] text-center relative overflow-hidden shadow-xs">
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#8C6B28] font-bold mb-1">
                  <Sparkles className="w-4 h-4 text-[#A8833C]" />
                  <span>{language === 'bn' ? 'লাইভ অ্যালকেটেড সিরিয়াল নম্বর' : 'Allocated Live Serial Slot'}</span>
                </div>

                <div className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1B2430] my-2">
                  #{currentSerialCalculated}
                </div>

                <p className="text-xs text-[#5C6573]">
                  {t.estimatedConsultTime}: <strong className="text-[#1B4D3E] font-serif text-sm font-bold">{estimatedTimeCalculated}</strong>
                </p>

                <div className="mt-3 pt-3 border-t border-[#EDE8DF] flex items-center justify-around text-xs text-[#5C6573]">
                  <span>{t.currentServing}: <strong className="text-[#8C6B28] font-bold">#{doctor.currentSerialServing}</strong></span>
                  <span>{t.waitingPatients}: <strong className="text-[#1B2430] font-bold">{Math.max(0, currentSerialCalculated - doctor.currentSerialServing)} জন</strong></span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#EDE8DF]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl bg-[#F9F7F2] text-[#5C6573] hover:bg-[#F1EDE4] text-xs font-semibold cursor-pointer"
                >
                  ← {language === 'bn' ? 'পূর্ববর্তী ধাপ' : 'Back'}
                </button>

                <button
                  type="button"
                  onClick={handleNextFromSlot}
                  className="px-6 py-2.5 rounded-xl bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs shadow-xs cursor-pointer"
                >
                  {language === 'bn' ? 'নিরাপত্তা ভেরিফিকেশন (2FA)' : 'Proceed to Security 2FA'} →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: 2-FACTOR AUTHENTICATION (2FA OTP) */}
          {step === 3 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#F4EAD4] border border-[#C5A059]/40 text-[#8C6B28] flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-7 h-7 text-[#A8833C]" />
              </div>

              <div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#1B2430]">{t.twoFactorTitle}</h4>
                <p className="text-xs text-[#5C6573] max-w-md mx-auto mt-1">
                  {t.twoFactorSubtitle} <strong className="text-[#8C6B28]">{patientPhone}</strong>
                </p>
              </div>

              {/* OTP Simulation code helper */}
              <div className="p-2.5 bg-[#EBF3F0] border border-[#1B4D3E]/30 rounded-xl text-xs text-[#1B4D3E] inline-flex items-center gap-2">
                <span>{language === 'bn' ? 'সিকিউরিটি ডেমো ওটিপি কোড:' : 'Security Demo OTP Code:'}</span>
                <span className="font-mono font-bold tracking-widest text-sm bg-white px-2 py-0.5 rounded border border-[#1B4D3E]/20 text-[#1B2430]">
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
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center font-serif font-bold text-lg sm:text-xl bg-[#FFFFFF] border-2 border-[#E5E1D8] rounded-xl text-[#1B2430] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#5C6573]">
                <span>{t.otpExpiresIn}: <strong className="text-[#8C6B28] font-mono">{otpTimer} {t.seconds}</strong></span>
                {otpTimer === 0 && (
                  <button
                    type="button"
                    onClick={() => setOtpTimer(60)}
                    className="text-[#8C6B28] font-bold hover:underline ml-2 cursor-pointer"
                  >
                    {t.resendOtp}
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#EDE8DF]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl bg-[#F9F7F2] text-[#5C6573] hover:bg-[#F1EDE4] text-xs font-semibold cursor-pointer"
                >
                  ← {language === 'bn' ? 'পূর্ববর্তী' : 'Back'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#153B30] text-[#FDFCFB] font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>{t.verifyAndConfirm}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: PAYMENT SELECTION */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="p-4 bg-[#F9F7F2] border border-[#E5E1D8] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#5C6573]">{t.consultationFee}</span>
                  <div className="font-serif text-2xl font-bold text-[#1B2430]">
                    {t.bdt} {doctor.consultationFee}
                  </div>
                </div>
                <div className="text-right text-xs text-[#5C6573]">
                  <span>সিরিয়াল: <strong className="text-[#8C6B28]">#{currentSerialCalculated}</strong></span>
                  <div className="text-[#1B4D3E] font-medium">✓ 2FA Verified</div>
                </div>
              </div>

              {/* Payment Methods Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#1B2430]">
                  {language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন:' : 'Select Payment Method:'}
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'bKash', label: 'বিকাশ (bKash)' },
                    { id: 'Nagad', label: 'নগদ (Nagad)' },
                    { id: 'Card', label: 'কার্ড (Visa/Mastercard)' },
                    { id: 'Rocket', label: 'রকেট (Rocket)' },
                    { id: 'Counter', label: 'হসপিটাল কাউন্টারে ক্যাশ' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === m.id
                          ? 'border-[#C5A059] bg-[#F4EAD4] text-[#8C6B28] shadow-xs'
                          : 'border-[#E5E1D8] bg-[#FFFFFF] text-[#5C6573] hover:text-[#1B2430]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#8C6B28]" />
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#EDE8DF]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl bg-[#F9F7F2] text-[#5C6573] hover:bg-[#F1EDE4] text-xs font-semibold cursor-pointer"
                >
                  ← {language === 'bn' ? 'পূর্ববর্তী' : 'Back'}
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalBooking}
                  className="px-6 py-2.5 rounded-xl bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>{language === 'bn' ? 'প্রসেসিং হচ্ছে...' : 'Processing...'}</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                      <span>{language === 'bn' ? 'সিরিয়াল নিশ্চিত করুন ও টোকেন নিন' : 'Confirm Serial & Get Token'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL TOKEN CONFIRMATION SLIP */}
          {step === 5 && confirmedAppointment && (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-[#EBF3F0] border-2 border-[#1B4D3E] text-[#1B4D3E] flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-serif text-xl font-bold text-[#1B2430]">{t.bookingSuccess}</h4>
                <p className="text-xs text-[#5C6573] mt-0.5">
                  {language === 'bn' 
                    ? 'আপনার মোবাইল ও হোয়াটসঅ্যাপে টোকেন স্লিপের নোটিফিকেশন পাঠানো হয়েছে।' 
                    : 'Digital token receipt has been dispatched to your SMS & WhatsApp.'}
                </p>
              </div>

              {/* Luxury Digital Token Slip */}
              <div id="printable-token-slip" className="bg-[#F9F7F2] border-2 border-[#C5A059] rounded-2xl p-5 sm:p-6 text-left relative overflow-hidden shadow-sm">
                <div className="flex items-start justify-between border-b border-[#EDE8DF] pb-3 mb-3">
                  <div>
                    <div className="text-[10px] font-bold text-[#8C6B28] uppercase tracking-widest">
                      AuraCare Super Specialty Hospital
                    </div>
                    <h5 className="font-serif text-base font-bold text-[#1B2430]">
                      {language === 'bn' ? confirmedAppointment.doctorNameBn : confirmedAppointment.doctorName}
                    </h5>
                    <p className="text-xs text-[#5C6573]">{confirmedAppointment.chamber} • {confirmedAppointment.roomNo}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#5C6573] block">{language === 'bn' ? 'টোকেন কোড' : 'Token Code'}</span>
                    <span className="text-base font-mono font-bold text-[#8C6B28] bg-[#F4EAD4] px-2 py-0.5 rounded border border-[#C5A059]/40">
                      {confirmedAppointment.tokenCode}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E5E1D8] text-xs mb-3">
                  <div>
                    <span className="text-[#5C6573] text-[10px] block">{language === 'bn' ? 'সিরিয়াল নম্বর' : 'Serial No'}</span>
                    <span className="font-serif text-2xl font-bold text-[#1B4D3E]">
                      #{confirmedAppointment.serialNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#5C6573] text-[10px] block">{language === 'bn' ? 'তারিখ' : 'Date'}</span>
                    <span className="font-bold text-[#1B2430]">{confirmedAppointment.date}</span>
                  </div>
                  <div>
                    <span className="text-[#5C6573] text-[10px] block">{language === 'bn' ? 'সম্ভাব্য সময়' : 'Est. Time'}</span>
                    <span className="font-bold text-[#8C6B28]">{confirmedAppointment.estimatedTime}</span>
                  </div>
                  <div>
                    <span className="text-[#5C6573] text-[10px] block">{language === 'bn' ? 'পেমেন্ট স্ট্যাটাস' : 'Payment'}</span>
                    <span className="font-bold text-[#1B4D3E] capitalize">{confirmedAppointment.paymentStatus}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#5C6573] pt-2 border-t border-[#EDE8DF]">
                  <span>রোগীর নাম: <strong className="text-[#1B2430]">{confirmedAppointment.patientName}</strong></span>
                  <span>মোবাইল: <strong className="text-[#1B2430]">{confirmedAppointment.patientPhone}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F1EDE4] text-[#1B2430] font-semibold text-xs flex items-center gap-1.5 border border-[#E5E1D8] cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-[#8C6B28]" />
                  <span>{t.printToken}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveTab('queue');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs shadow-xs cursor-pointer"
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
