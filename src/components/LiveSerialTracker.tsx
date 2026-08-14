import React, { useState } from 'react';
import { 
  Clock, 
  Search, 
  Sparkles, 
  UserCheck, 
  Building, 
  AlertCircle, 
  CheckCircle2, 
  Video, 
  CreditCard, 
  RefreshCw,
  ArrowRight,
  Activity
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Appointment } from '../types';

export const LiveSerialTracker: React.FC<{
  initialSearchToken?: string;
  onOpenPaymentModal: (apt: Appointment) => void;
}> = ({ initialSearchToken = '', onOpenPaymentModal }) => {
  const { language, t, doctors, appointments, startVideoCall, triggerServerBackup, showToast } = useHospital();
  const [tokenInput, setTokenInput] = useState(initialSearchToken);
  const [searchedAppointment, setSearchedAppointment] = useState<Appointment | null>(() => {
    if (initialSearchToken) {
      return appointments.find(a => a.tokenCode.toLowerCase() === initialSearchToken.toLowerCase()) || null;
    }
    return appointments[0] || null;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    const found = appointments.find(
      a => a.tokenCode.toLowerCase() === tokenInput.trim().toLowerCase() ||
           a.patientPhone.includes(tokenInput.trim()) ||
           a.id === tokenInput.trim()
    );
    if (found) {
      setSearchedAppointment(found);
      showToast(language === 'bn' ? `টোকেন ${found.tokenCode} পাওয়া গিয়েছে` : `Token ${found.tokenCode} found`, 'success');
    } else {
      showToast(language === 'bn' ? 'টোকেন পাওয়া যায়নি। কোডটি চেক করুন।' : 'Token not found. Please verify code.', 'warning');
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header & Token Search Bar */}
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EAD4] border border-[#C5A059]/40 text-[#8C6B28] text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5 text-[#A8833C]" />
            <span>{language === 'bn' ? 'রিয়েল-টাইম সিরিয়াল মনিটর' : 'Live Real-Time Queue Tracker'}</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B2430] tracking-tight">
            {language === 'bn' ? 'আপনার সিরিয়ালের অবস্থান ট্র্যাক করুন' : 'Track Your Chamber Serial & Wait Time'}
          </h2>

          <p className="text-xs sm:text-sm text-[#5C6573] mt-1 mb-5">
            {language === 'bn' 
              ? 'আপনার বুকিং টোকেন কোড (যেমন AUR-8412) বা মোবাইল নম্বর দিয়ে বর্তমান সিরিয়াল এবং অপেক্ষার সময় দেখুন।' 
              : 'Enter your Token Code (e.g. AUR-8412) or mobile number to track live chamber status.'}
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8833C]" />
              <input
                type="text"
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                placeholder={language === 'bn' ? 'টোকেন কোড (যেমন: AUR-8412) লিখুন...' : 'Enter Token Code (e.g. AUR-8412)...'}
                className="w-full pl-10 pr-3 py-2.5 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs sm:text-sm text-[#1B2430] placeholder-[#5C6573]/60 focus:outline-none focus:border-[#C5A059] shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <Search className="w-4 h-4 text-[#C5A059]" />
              <span>{language === 'bn' ? 'খুঁজুন' : 'Search Token'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Active Token Tracker Highlight Card */}
      {searchedAppointment && (
        <div className="bg-[#FFFFFF] border-2 border-[#C5A059] rounded-2xl p-6 shadow-md relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE8DF] pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F4EAD4] border border-[#C5A059]/40 text-[#8C6B28] font-mono text-xs font-bold">
                  {searchedAppointment.tokenCode}
                </span>
                <span className="text-xs text-[#5C6573]">
                  {searchedAppointment.date} • {searchedAppointment.timeSlot}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  searchedAppointment.status === 'serving' ? 'bg-[#EBF3F0] text-[#1B4D3E] border border-[#1B4D3E]/30 animate-pulse' :
                  searchedAppointment.status === 'confirmed' ? 'bg-[#EBF3F0] text-[#1B4D3E]' :
                  'bg-[#F9F7F2] text-[#5C6573]'
                }`}>
                  {searchedAppointment.status}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
                {language === 'bn' ? searchedAppointment.doctorNameBn : searchedAppointment.doctorName}
              </h3>
              <p className="text-xs text-[#8C6B28] font-semibold">{searchedAppointment.chamber} • {searchedAppointment.roomNo}</p>
            </div>

            {/* Quick action buttons for this appointment */}
            <div className="flex items-center gap-2">
              {searchedAppointment.type === 'video' && (
                <button
                  onClick={() => startVideoCall(searchedAppointment)}
                  className="px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#153D31] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <Video className="w-4 h-4 text-emerald-200" />
                  <span>{language === 'bn' ? 'ভিডিও রুমে প্রবেশ করুন' : 'Join Video Consultation'}</span>
                </button>
              )}

              {searchedAppointment.paymentStatus === 'pending' && (
                <button
                  onClick={() => onOpenPaymentModal(searchedAppointment)}
                  className="px-4 py-2 rounded-xl bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  <CreditCard className="w-4 h-4 text-[#C5A059]" />
                  <span>{language === 'bn' ? 'অনলাইন পেমেন্ট করুন' : 'Pay Online Now'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Queue Status Visualizer */}
          {(() => {
            const matchingDoc = doctors.find(d => d.id === searchedAppointment.doctorId) || doctors[0];
            const servingSerial = matchingDoc.currentSerialServing;
            const mySerial = searchedAppointment.serialNumber;
            const diff = mySerial - servingSerial;

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F9F7F2] border border-[#E5E1D8] text-center">
                  <span className="text-xs text-[#5C6573] block mb-1 font-medium">{t.currentServing}</span>
                  <div className="text-3xl sm:text-4xl font-bold text-[#8C6B28] font-serif flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#1B4D3E] animate-ping inline-block" />
                    #{servingSerial}
                  </div>
                  <span className="text-[11px] text-[#1B4D3E] font-semibold mt-1 block">
                    {language === 'bn' ? 'ডাক্তার চেম্বারে রোগী দেখছেন' : 'Doctor in active consultation'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#F9F7F2] border-2 border-[#C5A059]/50 text-center">
                  <span className="text-xs text-[#8C6B28] font-bold block mb-1">{language === 'bn' ? 'আপনার সিরিয়াল নম্বর' : 'Your Serial Number'}</span>
                  <div className="text-3xl sm:text-4xl font-bold text-[#1B4D3E] font-serif">
                    #{mySerial}
                  </div>
                  <span className="text-[11px] text-[#5C6573] mt-1 block font-medium">
                    {t.estimatedConsultTime}: <strong className="text-[#1B2430]">{searchedAppointment.estimatedTime}</strong>
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#F9F7F2] border border-[#E5E1D8] text-center flex flex-col justify-center">
                  <span className="text-xs text-[#5C6573] block mb-1 font-medium">{language === 'bn' ? 'অপেক্ষমাণ দূরত্ব' : 'Queue Distance'}</span>
                  {diff > 0 ? (
                    <div>
                      <div className="text-2xl font-bold text-[#1B2430] font-serif">
                        {diff} {language === 'bn' ? 'জন রোগী আগে' : 'Patients Ahead'}
                      </div>
                      <p className="text-[11px] text-[#5C6573] mt-0.5 font-medium">
                        {language === 'bn' ? `আনুমানিক অপেক্ষা: ~${diff * 7} মিনিট` : `Est. Wait: ~${diff * 7} mins`}
                      </p>
                    </div>
                  ) : diff === 0 ? (
                    <div className="text-[#1B4D3E] font-bold text-lg animate-pulse font-serif">
                      {language === 'bn' ? 'আপনার ডাক পড়েছে! চেম্বারে প্রবেশ করুন' : 'It is Your Turn! Enter Chamber'}
                    </div>
                  ) : (
                    <div className="text-[#5C6573] text-sm font-semibold">
                      {language === 'bn' ? 'আপনার সিরিয়াল ইতিমধ্যে সম্পন্ন হয়েছে' : 'Your serial was completed'}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ALL HOSPITAL CHAMBERS LIVE DIRECTORY */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#A8833C]" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1B2430]">
              {language === 'bn' ? 'সকল চেম্বারের লাইভ সিরিয়াল বোর্ড' : 'All Hospital Chambers Live Queue Board'}
            </h3>
          </div>
          <span className="text-xs text-[#1B4D3E] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1B4D3E] animate-ping inline-block" />
            {language === 'bn' ? 'লাইভ রিফ্রেশ হচ্ছে' : 'Live Auto-Sync'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map(doc => {
            const waiting = Math.max(0, doc.totalSerialsToday - doc.currentSerialServing);
            return (
              <div 
                key={doc.id}
                className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl p-4 shadow-xs hover:border-[#C5A059] hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-serif font-bold text-[#1B2430] text-sm">
                      {language === 'bn' ? doc.nameBn : doc.name}
                    </h4>
                    <p className="text-[11px] text-[#8C6B28] font-semibold">{language === 'bn' ? doc.specialtyBn : doc.specialty}</p>
                    <p className="text-[10px] text-[#5C6573]">{doc.chamber} • <strong className="text-[#1B2430]">{doc.roomNo}</strong></p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#EBF3F0] border border-[#1B4D3E]/20 text-[#1B4D3E] text-[10px] font-bold">
                    ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#F9F7F2] p-2.5 rounded-lg text-center text-xs border border-[#E5E1D8]">
                  <div>
                    <span className="text-[10px] text-[#5C6573] block font-medium">{language === 'bn' ? 'রানিং' : 'Serving'}</span>
                    <span className="font-serif font-bold text-[#8C6B28] text-base">#{doc.currentSerialServing}</span>
                  </div>
                  <div className="border-x border-[#E5E1D8]">
                    <span className="text-[10px] text-[#5C6573] block font-medium">{language === 'bn' ? 'মোট বুকিং' : 'Total'}</span>
                    <span className="font-serif font-bold text-[#1B2430] text-base">{doc.totalSerialsToday}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5C6573] block font-medium">{language === 'bn' ? 'অপেক্ষমাণ' : 'Waiting'}</span>
                    <span className="font-serif font-bold text-[#1B4D3E] text-base">{waiting}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
