import React, { useState } from 'react';
import { 
  Search, 
  CalendarCheck, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Award, 
  CheckCircle2,
  Stethoscope,
  ArrowRight
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const HeroBanner: React.FC<{ onSearchSerial: (token: string) => void }> = ({ onSearchSerial }) => {
  const { language, t, hospitalStats, setActiveTab } = useHospital();
  const [quickToken, setQuickToken] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickToken.trim()) {
      onSearchSerial(quickToken.trim());
      setActiveTab('queue');
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#FDFCFB] text-[#1B2430] border-b border-[#E5E1D8] pt-10 pb-14 px-4 sm:px-6">
      {/* Decorative subtle ambient warm tones */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F4EAD4]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#EBF3F0]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4EAD4] border border-[#C5A059]/40 text-[#8C6B28] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#A8833C]" />
              <span>
                {language === 'bn' ? 'স্মার্ট ও লাক্সারি স্বাস্থ্যসেবার বিশ্বস্ত ঠিকানা' : 'Next-Gen Luxury Healthcare & Smart Telemedicine'}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1B2430] leading-tight">
              {language === 'bn' ? (
                <>
                  সহজে নিন <span className="italic text-[#A8833C] font-normal">ডাক্তারের সিরিয়াল</span> ও লাইভ ট্র্যাকিং
                </>
              ) : (
                <>
                  Effortless <span className="italic text-[#A8833C] font-normal">Doctor Serial Booking</span> & Live Queue
                </>
              )}
            </h1>

            <p className="text-[#5C6573] text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              {language === 'bn' 
                ? 'দীর্ঘক্ষণ লাইনে না দাঁড়িয়ে ঘরে বসেই দেশের শীর্ষ বিশেষজ্ঞ ডাক্তারদের সিরিয়াল নিন, সরাসরি রানিং সিরিয়াল ট্র্যাক করুন, ডিজিটাল প্রেসক্রিপশন সংরক্ষণ করুন এবং এইচডি ভিডিও কনসাল্টেশন গ্রহণ করুন।'
                : 'Skip the long waiting lines. Reserve doctor serials from anywhere, monitor real-time chamber queues, secure your lifetime medical vault, and consult specialists over HD video.'}
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1B4D3E] bg-[#EBF3F0] px-3 py-1.5 rounded-lg border border-[#1B4D3E]/20 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D3E]" />
                <span>{language === 'bn' ? 'স্বয়ংক্রিয় এসএমএস ও হোয়াটসঅ্যাপ নোটিফিকেশন' : 'Automated SMS & WhatsApp Alerts'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C6B28] bg-[#F4EAD4] px-3 py-1.5 rounded-lg border border-[#C5A059]/30 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A8833C]" />
                <span>{language === 'bn' ? '২-ফ্যাক্টর ডাটা নিরাপত্তা' : '2-Factor Security Protected'}</span>
              </div>
            </div>

            {/* Quick Serial Search Bar */}
            <div className="pt-2">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8833C]" />
                  <input
                    type="text"
                    value={quickToken}
                    onChange={(e) => setQuickToken(e.target.value)}
                    placeholder={language === 'bn' ? 'টোকেন কোড দিন (যেমন: AUR-8412)...' : 'Enter Token Code (e.g. AUR-8412)...'}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs sm:text-sm text-[#1B2430] placeholder-[#5C6573]/60 focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 shadow-xs transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <span>{t.trackSerialBtn}</span>
                </button>
              </form>
            </div>

            {/* CTA Button Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('doctor-directory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#1B4D3E] hover:bg-[#153D31] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-emerald-200" />
                <span>{t.bookSerialBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('ai-triage')}
                className="px-5 py-3 rounded-xl bg-[#F9F7F2] hover:bg-[#F1EDE4] border border-[#E5E1D8] text-[#1B2430] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#A8833C]" />
                <span>{t.aiSymptomCheckerTitle}</span>
              </button>
            </div>
          </div>

          {/* Luxury Live Stats Bento Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F4EAD4] to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between border-b border-[#EDE8DF] pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#F4EAD4] text-[#A8833C]">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B2430] text-sm">
                      {language === 'bn' ? 'লাইভ হসপিটাল কন্ট্রোল স্ট্যাটাস' : 'Live Hospital Activity Monitor'}
                    </h3>
                    <p className="text-[11px] text-[#1B4D3E] font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#1B4D3E] animate-ping inline-block" />
                      {language === 'bn' ? 'সিস্টেম সক্রিয় ও নিরবচ্ছিন্ন' : 'System Active & Real-Time'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded bg-[#F9F7F2] border border-[#E5E1D8] text-[#5C6573] font-mono">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3.5 rounded-xl bg-[#F9F7F2] border border-[#E5E1D8]">
                  <span className="text-[11px] text-[#5C6573] flex items-center gap-1 mb-1 font-medium">
                    <Stethoscope className="w-3.5 h-3.5 text-[#A8833C]" />
                    {language === 'bn' ? 'বিশেষজ্ঞ চিকিৎসক' : 'Specialist Doctors'}
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-[#1B2430]">
                    {hospitalStats.totalDoctors}+
                  </div>
                  <span className="text-[10px] text-[#5C6573]">{language === 'bn' ? 'সকল প্রধান বিভাগে' : 'Across 8 Super-Wings'}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F9F7F2] border border-[#E5E1D8]">
                  <span className="text-[11px] text-[#5C6573] flex items-center gap-1 mb-1 font-medium">
                    <CalendarCheck className="w-3.5 h-3.5 text-[#1B4D3E]" />
                    {language === 'bn' ? 'আজকের সিরিয়াল সেবা' : 'Patients Served Today'}
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-[#1B4D3E]">
                    {hospitalStats.todayPatientsServed}+
                  </div>
                  <span className="text-[10px] text-[#5C6573]">{language === 'bn' ? 'সফল সেবা সম্পন্ন' : 'Completed Serials'}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F9F7F2] border border-[#E5E1D8]">
                  <span className="text-[11px] text-[#5C6573] flex items-center gap-1 mb-1 font-medium">
                    <Award className="w-3.5 h-3.5 text-[#A8833C]" />
                    {language === 'bn' ? 'সক্রিয় চেম্বার' : 'Active Chambers'}
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-[#A8833C]">
                    {hospitalStats.activeChambers}
                  </div>
                  <span className="text-[10px] text-[#5C6573]">{language === 'bn' ? 'লাইভ কিউ মনিটরিং' : 'Chambers in Session'}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F9F7F2] border border-[#E5E1D8]">
                  <span className="text-[11px] text-[#5C6573] flex items-center gap-1 mb-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                    {language === 'bn' ? 'জরুরি আইসিইউ বেড' : 'Available ICU Beds'}
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-rose-700">
                    {hospitalStats.icuAvailable} <span className="text-xs font-normal text-[#5C6573]">Available</span>
                  </div>
                  <span className="text-[10px] text-[#5C6573]">{language === 'bn' ? '২৪/৭ প্রস্তুত টিম' : 'Instant Critical Care'}</span>
                </div>
              </div>

              {/* Security & Backup banner */}
              <div className="p-3 rounded-xl bg-[#EBF3F0] border border-[#1B4D3E]/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#FFFFFF] text-[#1B4D3E] shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B4D3E]">
                      {language === 'bn' ? 'এনক্রিপ্টেড ক্লাউড ব্যাকআপ সক্রিয়' : 'End-to-End Encrypted Cloud Storage'}
                    </p>
                    <p className="text-[10px] text-[#5C6573]">
                      {language === 'bn' ? 'আপনার সকল মেডিকেল ডাটা স্বয়ংক্রিয়ভাবে সংরক্ষিত' : 'Prescriptions and lab reports auto-synced'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
